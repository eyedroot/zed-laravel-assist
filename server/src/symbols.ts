import { fileURLToPath, pathToFileURL } from "node:url";
import {
  DocumentSymbol,
  Range,
  SymbolInformation,
  SymbolKind,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { LaravelIndex, SourceRange } from "./projectIndex.js";

const MAX_WORKSPACE_SYMBOLS = 200;

type SymbolCandidate = {
  containerName?: string;
  detail?: string;
  filePath: string;
  kind: SymbolKind;
  name: string;
  range?: SourceRange;
};

export function documentSymbolsForDocument(document: TextDocument, index: LaravelIndex): DocumentSymbol[] {
  const filePath = pathFromUri(document.uri);
  if (!filePath) {
    return [];
  }

  const documentRange = fullDocumentRange(document);
  const symbols = workspaceSymbolCandidates(index)
    .filter((candidate) => candidate.filePath === filePath)
    .map((candidate) => documentSymbol(candidate, documentRange));

  return sortDocumentSymbols(symbols);
}

export function workspaceSymbolsForQuery(query: string, index: LaravelIndex): SymbolInformation[] {
  const normalizedQuery = query.trim().toLowerCase();

  return workspaceSymbolCandidates(index)
    .filter((candidate) => symbolMatches(candidate, normalizedQuery))
    .slice(0, MAX_WORKSPACE_SYMBOLS)
    .map((candidate) =>
      SymbolInformation.create(
        candidate.name,
        candidate.kind,
        candidateRange(candidate),
        pathToFileURL(candidate.filePath).toString(),
        candidate.containerName,
      ),
    );
}

function workspaceSymbolCandidates(index: LaravelIndex): SymbolCandidate[] {
  return [
    ...index.routes.flatMap((route) =>
      route.name || route.uri
        ? [
            {
              containerName: route.filePath,
              detail: routeDetail(route.methods, route.uri),
              filePath: route.filePath,
              kind: SymbolKind.Function,
              name: route.name ? `route: ${route.name}` : `route: ${route.uri}`,
              range: route.range,
            },
          ]
        : [],
    ),
    ...index.bladeViews.map((view) => ({
      containerName: "Blade view",
      detail: view.extends ? `extends ${view.extends}` : undefined,
      filePath: view.filePath,
      kind: SymbolKind.File,
      name: `view: ${view.name}`,
    })),
    ...index.bladeComponents.map((component) => ({
      containerName: "Blade component",
      detail: `${component.source} component, view ${component.viewName}`,
      filePath: component.filePath,
      kind: SymbolKind.Class,
      name: `component: ${component.name}`,
    })),
    ...index.models.map((model) => ({
      containerName: model.namespace ?? "Eloquent model",
      detail: `table ${model.tableName}`,
      filePath: model.filePath,
      kind: SymbolKind.Class,
      name: `model: ${model.className}`,
    })),
    ...index.models.flatMap((model) =>
      model.relations.map((relation) => ({
        containerName: `model: ${model.className}`,
        detail: [relation.type, relation.relatedModel].filter(Boolean).join(" "),
        filePath: model.filePath,
        kind: SymbolKind.Property,
        name: `relation: ${model.className}.${relation.name}`,
      })),
    ),
    ...index.models.flatMap((model) =>
      model.scopes.map((scope) => ({
        containerName: `model: ${model.className}`,
        filePath: model.filePath,
        kind: SymbolKind.Method,
        name: `scope: ${model.className}.${scope}`,
      })),
    ),
    ...index.models.flatMap((model) =>
      model.customBuilder?.methods.map((method) => ({
        containerName: `builder: ${model.customBuilder?.className}`,
        detail: method.returnType ?? undefined,
        filePath: model.customBuilder?.filePath ?? model.filePath,
        kind: SymbolKind.Method,
        name: `builder: ${model.className}.${method.name}`,
      })) ?? [],
    ),
    ...index.schemaTables.map((table) => ({
      containerName: "Database schema",
      detail: `${table.columns.length} columns`,
      filePath: table.filePath,
      kind: SymbolKind.Struct,
      name: `table: ${table.name}`,
    })),
    ...index.schemaTables.flatMap((table) =>
      table.columns.map((column) => ({
        containerName: `table: ${table.name}`,
        detail: schemaColumnDetail(column.type, column.modifiers),
        filePath: column.filePath,
        kind: SymbolKind.Field,
        name: `column: ${table.name}.${column.name}`,
      })),
    ),
    ...index.validationRules.map((ruleSet) => ({
      containerName: ruleSet.namespace ?? "Validation",
      detail: `${ruleSet.source}, ${ruleSet.fields.length} fields`,
      filePath: ruleSet.filePath,
      kind: SymbolKind.Object,
      name: ruleSet.className ? `request: ${ruleSet.className}` : "validation: inline rules",
    })),
    ...index.configEntries.map((entry) => ({
      containerName: "Laravel config",
      filePath: entry.filePath,
      kind: SymbolKind.Key,
      name: `config: ${entry.key}`,
      range: entry.range,
    })),
    ...index.envEntries.map((entry) => ({
      containerName: "Environment",
      filePath: entry.filePath,
      kind: SymbolKind.Key,
      name: `env: ${entry.key}`,
      range: entry.range,
    })),
    ...index.translationKeys.map((translation) => ({
      containerName: `translation ${translation.locale}`,
      detail: translation.source,
      filePath: translation.filePath,
      kind: SymbolKind.String,
      name: `translation: ${translation.key}`,
    })),
    ...index.commands.map((command) => ({
      containerName: command.source === "closure" ? "routes/console.php" : command.namespace ?? "Artisan",
      detail: command.description ?? command.signature,
      filePath: command.filePath,
      kind: SymbolKind.Function,
      name: `command: ${command.name}`,
    })),
    ...index.controllers.map((controller) => ({
      containerName: controller.namespace ?? "Controller",
      detail: controller.actions.length > 0 ? `${controller.actions.length} actions` : undefined,
      filePath: controller.filePath,
      kind: SymbolKind.Class,
      name: `controller: ${controller.className}`,
    })),
    ...index.controllers.flatMap((controller) =>
      controller.actions.map((action) => ({
        containerName: `controller: ${controller.className}`,
        filePath: controller.filePath,
        kind: SymbolKind.Method,
        name: `action: ${controller.className}@${action}`,
        range: controllerActionRange(controller, action),
      })),
    ),
    ...index.middleware.map((middleware) => ({
      containerName: middleware.source,
      detail: middleware.className ?? undefined,
      filePath: middleware.filePath,
      kind: SymbolKind.Key,
      name: `middleware: ${middleware.alias}`,
    })),
    ...index.containerBindings.map((binding) => ({
      containerName: binding.lifetime,
      detail: binding.concrete ?? undefined,
      filePath: binding.filePath,
      kind: SymbolKind.Interface,
      name: `binding: ${binding.abstract}`,
    })),
    ...index.authorization.map((entry) => ({
      containerName: entry.source,
      detail: entry.policy ?? entry.model ?? undefined,
      filePath: entry.filePath,
      kind: SymbolKind.Function,
      name: `ability: ${entry.ability}`,
    })),
    ...index.facades.map((facade) => ({
      containerName: facade.namespace ?? "Facade",
      detail: facade.binding?.concrete ?? facade.accessor ?? undefined,
      filePath: facade.filePath,
      kind: SymbolKind.Class,
      name: `facade: ${facade.className}`,
    })),
    ...index.providers.map((provider) => ({
      containerName: provider.source,
      detail: provider.namespace ?? undefined,
      filePath: provider.classFilePath ?? provider.filePath,
      kind: SymbolKind.Class,
      name: `provider: ${provider.className}`,
    })),
    ...index.macros.map((macro) => ({
      containerName: macro.className,
      filePath: macro.filePath,
      kind: SymbolKind.Method,
      name: `macro: ${macro.method}`,
    })),
    ...index.factories.map((factory) => ({
      containerName: factory.namespace ?? "Factory",
      detail: factory.model ?? undefined,
      filePath: factory.filePath,
      kind: SymbolKind.Class,
      name: `factory: ${factory.className}`,
    })),
    ...index.seeders.map((seeder) => ({
      containerName: seeder.namespace ?? "Seeder",
      detail: seeder.calls.length > 0 ? `calls ${seeder.calls.join(", ")}` : undefined,
      filePath: seeder.filePath,
      kind: SymbolKind.Class,
      name: `seeder: ${seeder.className}`,
    })),
    ...index.artifacts.map((artifact) => ({
      containerName: artifact.namespace ?? artifact.kind,
      detail: artifact.related.length > 0 ? artifact.related.join(", ") : undefined,
      filePath: artifact.filePath,
      kind: artifactSymbolKind(artifact.kind),
      name: `${artifact.kind}: ${artifact.className}`,
    })),
  ].sort((left, right) => left.name.localeCompare(right.name));
}

function documentSymbol(candidate: SymbolCandidate, documentRange: Range): DocumentSymbol {
  const range = candidateRange(candidate, documentRange);

  return {
    children: [],
    detail: candidate.detail,
    kind: candidate.kind,
    name: candidate.name,
    range,
    selectionRange: range,
  };
}

function candidateRange(candidate: SymbolCandidate, fallbackRange: Range = startRange()): Range {
  if (!candidate.range) {
    return fallbackRange;
  }

  return {
    end: candidate.range.end,
    start: candidate.range.start,
  };
}

function routeDetail(methods: string[], uri: string | null): string | undefined {
  if (!uri && methods.length === 0) {
    return undefined;
  }

  return [methods.join("|"), uri].filter(Boolean).join(" ");
}

function controllerActionRange(controller: LaravelIndex["controllers"][number], action: string): SourceRange | undefined {
  return controller.actionDetails?.find((candidate) => candidate.name === action)?.range;
}

function schemaColumnDetail(type: string, modifiers: string[]): string {
  return [type, ...modifiers].join(" ");
}

function artifactSymbolKind(kind: LaravelIndex["artifacts"][number]["kind"]): SymbolKind {
  if (kind === "event") {
    return SymbolKind.Event;
  }

  if (kind === "resource") {
    return SymbolKind.Struct;
  }

  return SymbolKind.Class;
}

function symbolMatches(candidate: SymbolCandidate, normalizedQuery: string): boolean {
  if (!normalizedQuery) {
    return true;
  }

  return [
    candidate.name,
    candidate.detail,
    candidate.containerName,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

function sortDocumentSymbols(symbols: DocumentSymbol[]): DocumentSymbol[] {
  return symbols.sort((left, right) => {
    if (left.range.start.line !== right.range.start.line) {
      return left.range.start.line - right.range.start.line;
    }

    if (left.range.start.character !== right.range.start.character) {
      return left.range.start.character - right.range.start.character;
    }

    return left.name.localeCompare(right.name);
  });
}

function fullDocumentRange(document: TextDocument): Range {
  const lines = document.getText().split(/\r?\n/);
  const lastLine = Math.max(lines.length - 1, 0);

  return {
    end: {
      character: lines[lastLine]?.length ?? 0,
      line: lastLine,
    },
    start: {
      character: 0,
      line: 0,
    },
  };
}

function startRange(): Range {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 },
  };
}

function pathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}
