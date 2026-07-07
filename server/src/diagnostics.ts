import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { isKnownEloquentBuilderMethod } from "./instanceTypes.js";
import { LaravelIndex, ValidationFieldInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

export function diagnosticsForDocument(document: TextDocument, index: LaravelIndex): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const documentText = document.getText();
  const routeNames = new Set(index.routes.map((route) => route.name).filter((name): name is string => Boolean(name)));
  const viewNames = new Set(index.bladeViews.map((view) => view.name));
  // Empty when the project has no indexed page directory; the diagnostic
  // stays silent then so non-Inertia projects are never flagged.
  const inertiaPageNames = new Set(index.inertiaPages.map((page) => page.name));
  const componentNames = new Set(index.bladeComponents.map((component) => component.name));
  const configKeys = new Set(index.configKeys);
  const envKeys = new Set(index.envKeys);
  const schemaTables = new Set(index.schemaTables.map((table) => table.name));
  const translationKeys = new Set(index.translationKeys.map((translation) => translation.key));
  const authorizationAbilities = new Set(index.authorization.map((entry) => entry.ability));
  const containerBindings = new Set(index.containerBindings.map((binding) => binding.abstract));
  const controllerNames = new Set(
    index.controllers.flatMap((controller) => [
      controller.className,
      ...(controller.namespace ? [`${controller.namespace}\\${controller.className}`] : []),
    ]),
  );
  const commandNames = new Set(index.commands.map((command) => command.name));
  const middlewareAliases = new Set(index.middleware.map((middleware) => middleware.alias));
  const providerNames = new Set(
    index.providers.flatMap((provider) => [
      provider.className,
      ...(provider.namespace ? [`${provider.namespace}\\${provider.className}`] : []),
    ]),
  );
  const seederNames = new Set(
    index.seeders.flatMap((seeder) => [
      seeder.className,
      ...(seeder.namespace ? [`${seeder.namespace}\\${seeder.className}`] : []),
    ]),
  );
  const validationFields = new Set(validationFieldsForDocument(document, index).map((field) => field.field));
  const documentPath = documentPathFromUri(document.uri);
  const attributeTableName = index.models.find((model) => model.filePath === documentPath)?.tableName ?? null;
  const indexedModelNames = new Set(index.models.flatMap((model) => [
    model.className,
    ...(model.namespace ? [`${model.namespace}\\${model.className}`] : []),
  ]));
  const currentRequest = documentPath
    ? index.validationRules.find((ruleSet) => ruleSet.filePath === documentPath && ruleSet.source === "formRequest")
    : null;
  const currentArtifact = documentPath ? index.artifacts.find((artifact) => artifact.filePath === documentPath) : null;
  const bladeSectionLayout = bladeSectionLayoutForDocument(document, index);
  const bladeStackLayout = bladeStackLayoutForDocument(document, index);
  let insideModelAttributeArray = false;

  for (const [lineIndex, line] of document.getText().split(/\r?\n/).entries()) {
    for (const convention of classConventionContextsInLine(line)) {
      if (currentRequest?.className === convention.value) {
        const inferredModelName = inferRequestModelName(convention.value);
        if (inferredModelName && indexedModelNames.size > 0 && !hasIndexedModel(indexedModelNames, inferredModelName)) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "requestConvention", model: inferredModelName },
              `Form request '${convention.value}' does not match an indexed model '${inferredModelName}'.`,
            ),
          );
        }
      }

      if (currentArtifact?.kind === "resource" && currentArtifact.className === convention.value) {
        const inferredModelName = inferResourceModelName(convention.value);
        if (indexedModelNames.size > 0 && (!inferredModelName || !hasIndexedModel(indexedModelNames, inferredModelName))) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "resourceConvention", ...(inferredModelName ? { model: inferredModelName } : {}) },
              inferredModelName
                ? `JSON resource '${convention.value}' does not match an indexed model '${inferredModelName}'.`
                : `JSON resource '${convention.value}' should be named '<Model>Resource'.`,
            ),
          );
        }
      }

      if (documentPath?.includes("/Policies/") && convention.value.endsWith("Policy")) {
        const policyModelName = convention.value.replace(/Policy$/, "");
        if (indexedModelNames.size > 0 && !hasIndexedModel(indexedModelNames, policyModelName)) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "policyConvention", model: policyModelName },
              `Policy '${convention.value}' does not match an indexed model '${policyModelName}'.`,
            ),
          );
        }
      }
    }

    for (const policyMap of policyMapConventionContextsInLine(line)) {
      const resolvedModel = resolvePhpClassReference(documentText, policyMap.model ?? "");
      const modelName = resolvedModel.split("\\").at(-1) ?? resolvedModel;
      const policyName = resolvePhpClassReference(documentText, policyMap.value).split("\\").at(-1) ?? policyMap.value;
      const expectedPolicy = `${modelName}Policy`;
      if (hasIndexedModel(indexedModelNames, resolvedModel) && policyName !== expectedPolicy) {
        diagnostics.push(
          unresolvedDiagnostic(
            lineIndex,
            policyMap,
            `Policy '${policyName}' does not follow the expected '${expectedPolicy}' name for model '${modelName}'.`,
          ),
        );
      }
    }

    if (attributeTableName && /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[/.test(line)) {
      insideModelAttributeArray = true;
    }

    if (attributeTableName && insideModelAttributeArray) {
      for (const attribute of modelAttributeContextsInLine(line, attributeTableName)) {
        const table = index.schemaTables.find((candidate) => candidate.name === attribute.tableName);
        if (table && !table.columns.some((column) => column.name === attribute.value)) {
          diagnostics.push(
            unresolvedDiagnostic(lineIndex, attribute, `Unknown Eloquent attribute '${attribute.tableName}.${attribute.value}'.`),
          );
        }
      }
    }

    for (const factoryState of factoryStateContextsInLine(line)) {
      if (!factoryState.model) {
        continue;
      }

      const states = factoryStatesForModel(index, factoryState.model);
      if (states.length > 0 && !states.includes(factoryState.value)) {
        diagnostics.push(
          unresolvedDiagnostic(
            lineIndex,
            factoryState,
            `Unknown factory state '${factoryState.model}.${factoryState.value}'.`,
          ),
        );
      }
    }

    for (const scope of eloquentScopeContextsInLine(line)) {
      const model = findModel(index, scope.model ? resolvePhpClassReference(documentText, scope.model) : undefined);
      if (
        model &&
        !model.scopes.includes(scope.value) &&
        !model.staticMethods?.includes(scope.value) &&
        !isKnownEloquentBuilderMethod(scope.value) &&
        !model.customBuilder?.methods.some((method) => method.name === scope.value)
      ) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, scope, `Unknown Eloquent scope '${scope.model}.${scope.value}'.`));
      }
    }

    for (const seeder of seederClassContextsInLine(line)) {
      if (!seederNames.has(seeder.value) && !seederNames.has(seeder.value.split("\\").at(-1) ?? seeder.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, seeder, `Unknown seeder '${seeder.value}'.`));
      }
    }

    if (documentPath && isProviderRegistrationFile(documentPath)) {
      for (const provider of serviceProviderContextsInLine(line)) {
        const resolvedProvider = resolvePhpClassReference(documentText, provider.value);
        if (!providerNames.has(resolvedProvider) && !providerNames.has(resolvedProvider.split("\\").at(-1) ?? resolvedProvider)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, provider, `Unknown service provider '${provider.value}'.`));
        }
      }
    }

    for (const controller of routeControllerClassContextsInLine(line)) {
      const resolvedController = resolvePhpClassReference(documentText, controller.value);
      if (!controllerNames.has(resolvedController) && !controllerNames.has(resolvedController.split("\\").at(-1) ?? resolvedController)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, controller, `Unknown controller '${controller.value}'.`));
      }
    }

    for (const action of routeControllerActionContextsInLine(line, documentText, lineIndex)) {
      const controller = findController(index, action.model ? resolvePhpClassReference(documentText, action.model) : undefined);
      if (controller && !controller.actions.includes(action.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, action, `Unknown controller action '${action.model}@${action.value}'.`));
      }
    }

    for (const parameter of routeParameterContextsInLine(line)) {
      const route = index.routes.find((candidate) => candidate.name === parameter.model);
      const parameters = routeParameters(route);
      if (route && parameters.length > 0 && !parameters.includes(parameter.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, parameter, `Unknown route parameter '${parameter.model}.${parameter.value}'.`));
      }
    }

    for (const component of componentContextsInLine(line)) {
      if (!componentNames.has(component.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, component, `Unknown Blade component '${component.value}'.`));
      }
    }

    for (const prop of componentPropContextsInLine(line)) {
      const component = index.bladeComponents.find((candidate) => candidate.name === prop.model);
      if (
        component &&
        component.props.length > 0 &&
        !component.props.includes(prop.value) &&
        shouldDiagnoseUnknownComponentProp(prop.value, component.props)
      ) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, prop, `Unknown Blade component prop '${prop.model}.${prop.value}'.`));
      }
    }

    if (bladeSectionLayout) {
      for (const section of bladeSectionContextsInLine(line, bladeSectionLayout.name)) {
        if (!bladeSectionLayout.yields.includes(section.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, section, `Unknown Blade section '${bladeSectionLayout.name}.${section.value}'.`));
        }
      }
    }

    if (bladeStackLayout) {
      for (const stack of bladeStackContextsInLine(line, bladeStackLayout.name)) {
        if (!(bladeStackLayout.stacks ?? []).includes(stack.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, stack, `Unknown Blade stack '${bladeStackLayout.name}.${stack.value}'.`));
        }
      }
    }

    for (const context of stringContextsInLine(line)) {
      if (context.kind === "route" && !routeNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Laravel route '${context.value}'.`));
      }
      if (context.kind === "view" && !viewNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Blade view '${context.value}'.`));
      }
      if (context.kind === "inertiaPage" && inertiaPageNames.size > 0 && !inertiaPageNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Inertia page '${context.value}'.`));
      }
      if (context.kind === "config" && !configKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Laravel config key '${context.value}'.`));
      }
      if (context.kind === "env" && !envKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown environment key '${context.value}'.`));
      }
      if (context.kind === "schemaTable" && !schemaTables.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown schema table '${context.value}'.`));
      }
      if (context.kind === "schemaColumn") {
        const table = index.schemaTables.find((candidate) => candidate.name === context.tableName);
        if (table && !table.columns.some((column) => column.name === context.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown schema column '${context.tableName}.${context.value}'.`));
        }
      }
      if (context.kind === "translation" && !translationKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown translation key '${context.value}'.`));
      }
      if (context.kind === "authorization" && !authorizationAbilities.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown authorization ability '${context.value}'.`));
      }
      if (context.kind === "container" && !containerBindings.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown container binding '${context.value}'.`));
      }
      if (context.kind === "command" && !commandNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Artisan command '${context.value}'.`));
      }
      if (context.kind === "middleware" && !middlewareAliases.has(context.value.split(":")[0])) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown middleware alias '${context.value}'.`));
      }
      if (context.kind === "validationField" && validationFields.size > 0 && !validationFields.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown validated request field '${context.value}'.`));
      }
      if (context.kind === "relation") {
        const model = findModel(index, context.model ? resolvePhpClassReference(documentText, context.model) : undefined);
        if (model && !model.relations.some((relation) => relation.name === context.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Eloquent relation '${context.model}.${context.value}'.`));
        }
      }
    }

    if (/\]\s*;/.test(line)) {
      insideModelAttributeArray = false;
    }
  }

  return diagnostics;
}

export interface LaravelDiagnosticData {
  kind:
    | "authorization"
    | "bladeSection"
    | "bladeStack"
    | "command"
    | "component"
    | "componentProp"
    | "config"
    | "container"
    | "controller"
    | "controllerAction"
    | "env"
    | "factoryState"
    | "inertiaPage"
    | "modelAttribute"
    | "middleware"
    | "policyConvention"
    | "relation"
    | "requestConvention"
    | "resourceConvention"
    | "route"
    | "routeParameter"
    | "schemaColumn"
    | "schemaTable"
    | "seeder"
    | "serviceProvider"
    | "scope"
    | "translation"
    | "validationField"
    | "view";
  model?: string;
  tableName?: string;
  value: string;
}

type DiagnosticStringContext = {
  end: number;
  kind: LaravelDiagnosticData["kind"];
  model?: string;
  start: number;
  tableName?: string;
  value: string;
};

function componentContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }

    const start = (match.index ?? 0) + 3;
    contexts.push({
      end: start + rawName.length,
      kind: "component",
      start,
      value: rawName.replace(/:/g, "."),
    });
  }

  return contexts;
}

function classConventionContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/g)) {
    const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
    contexts.push({
      end: start + match[1].length,
      kind: "requestConvention",
      start,
      value: match[1],
    });
  }

  return contexts;
}

function policyMapConventionContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*=>\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const policyStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    contexts.push({
      end: policyStart + match[2].length,
      kind: "policyConvention",
      model: match[1],
      start: policyStart,
      value: match[2],
    });
  }

  for (const match of line.matchAll(/Gate::policy\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const policyStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    contexts.push({
      end: policyStart + match[2].length,
      kind: "policyConvention",
      model: match[1],
      start: policyStart,
      value: match[2],
    });
  }

  return contexts;
}

function inferRequestModelName(className: string): string | null {
  return /^(?:Store|Update)([A-Z][A-Za-z0-9_]*)Request$/.exec(className)?.[1] ?? null;
}

function inferResourceModelName(className: string): string | null {
  return /^([A-Z][A-Za-z0-9_]*)Resource$/.exec(className)?.[1] ?? null;
}

function hasIndexedModel(indexedModelNames: Set<string>, modelName: string): boolean {
  const baseName = modelName.split("\\").at(-1) ?? modelName;
  return indexedModelNames.has(modelName) || indexedModelNames.has(baseName);
}

function componentPropContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }

    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    const attributes = tag[2];
    for (const attribute of attributes.matchAll(/\s(:?)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const value = attribute[2];
      if (isGenericBladeAttribute(value)) {
        continue;
      }

      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(value);
      contexts.push({
        end: start + value.length,
        kind: "componentProp",
        model: componentName,
        start,
        value,
      });
    }
  }

  return contexts;
}

function isGenericBladeAttribute(value: string): boolean {
  return value === "class" ||
    value === "id" ||
    value === "style" ||
    value === "title" ||
    value.startsWith("aria-") ||
    value.startsWith("data-") ||
    value.startsWith("wire:") ||
    value.startsWith("x-") ||
    value.startsWith("v-") ||
    value.startsWith("on");
}

function shouldDiagnoseUnknownComponentProp(value: string, candidates: string[]): boolean {
  return candidates.some((candidate) => levenshteinDistance(candidate, value) <= 2);
}

function stringContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel(prefix);
    if (relationModel) {
      contexts.push({
        end: stringRange.end,
        kind: "relation",
        model: relationModel,
        start: stringRange.start,
        value,
      });
      continue;
    }

    const kind = diagnosticKindForPrefix(prefix);
    const schemaContext = validationSchemaContextForPrefix(prefix, value);
    if (schemaContext) {
      contexts.push({
        ...schemaContext,
        end: stringRange.end,
        start: stringRange.start,
      });
      continue;
    }

    if (!kind) {
      continue;
    }

    contexts.push({
      end: stringRange.end,
      kind,
      start: stringRange.start,
      value,
    });
  }

  return contexts;
}

function bladeSectionContextsInLine(line: string, layoutName: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/@section\s*\(\s*(['"])([^'"]+)\1/g)) {
    const value = match[2];
    const start = (match.index ?? 0) + match[0].lastIndexOf(value);
    contexts.push({
      end: start + value.length,
      kind: "bladeSection",
      model: layoutName,
      start,
      value,
    });
  }

  return contexts;
}

function bladeStackContextsInLine(line: string, layoutName: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/@(push|prepend)\s*\(\s*(['"])([^'"]+)\2/g)) {
    const value = match[3];
    const start = (match.index ?? 0) + match[0].lastIndexOf(value);
    contexts.push({
      end: start + value.length,
      kind: "bladeStack",
      model: layoutName,
      start,
      value,
    });
  }

  return contexts;
}

function modelAttributeContextsInLine(line: string, tableName: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    contexts.push({
      end: stringRange.end,
      kind: "modelAttribute",
      start: stringRange.start,
      tableName,
      value: line.slice(stringRange.start, stringRange.end),
    });
  }

  return contexts;
}

function eloquentScopeContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::(?:query\(\)->)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const method = match[2];
    if (
      [
        "all",
        "create",
        "doesntHave",
        "factory",
        "find",
        "first",
        "has",
        "load",
        "loadAvg",
        "loadCount",
        "loadMax",
        "loadMin",
        "loadMissing",
        "loadSum",
        "orWhereDoesntHave",
        "orWhereHas",
        "query",
        "where",
        "whereDoesntHave",
        "whereHas",
        "with",
        "withAvg",
        "withCount",
        "withExists",
        "withMax",
        "withMin",
        "withOnly",
        "withSum",
        "withWhereHas",
        "without",
      ].includes(method)
    ) {
      continue;
    }

    const start = (match.index ?? 0) + match[0].lastIndexOf(method);
    contexts.push({
      end: start + method.length,
      kind: "scope",
      model: match[1],
      start,
      value: method,
    });
  }

  return contexts;
}

function factoryStateContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];
  const ignored = new Set([
    "afterCreating",
    "afterMaking",
    "count",
    "create",
    "createMany",
    "for",
    "has",
    "make",
    "raw",
    "recycle",
    "sequence",
    "state",
    "trashed",
  ]);

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const state = match[2];
    if (ignored.has(state)) {
      continue;
    }

    const start = (match.index ?? 0) + match[0].lastIndexOf(state);
    contexts.push({
      end: start + state.length,
      kind: "factoryState",
      model: match[1],
      start,
      value: state,
    });
  }

  return contexts;
}

function seederClassContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isSeederCallPrefix(line.slice(0, start))) {
      continue;
    }

    contexts.push({
      end: start + value.length,
      kind: "seeder",
      start,
      value,
    });
  }

  return contexts;
}

function serviceProviderContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isProviderRegistrationPrefix(line.slice(0, start))) {
      continue;
    }

    contexts.push({
      end: start + value.length,
      kind: "serviceProvider",
      start,
      value,
    });
  }

  return contexts;
}

function routeControllerClassContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isRouteControllerClassPrefix(line.slice(0, start))) {
      continue;
    }

    contexts.push({
      end: start + value.length,
      kind: "controller",
      start,
      value,
    });
  }

  return contexts;
}

function routeControllerActionContextsInLine(line: string, source: string, lineNumber: number): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const controller = routeControllerActionClass(prefix) ?? routeControllerGroupActionClass(source, lineNumber, prefix);
    if (!controller) {
      continue;
    }

    contexts.push({
      end: stringRange.end,
      kind: "controllerAction",
      model: controller,
      start: stringRange.start,
      value: line.slice(stringRange.start, stringRange.end),
    });
  }

  return contexts;
}

function routeParameterContextsInLine(line: string): DiagnosticStringContext[] {
  const contexts: DiagnosticStringContext[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    const routeName = routeParameterContextRouteName(line.slice(0, stringRange.start - 1));
    if (!routeName) {
      continue;
    }

    contexts.push({
      end: stringRange.end,
      kind: "routeParameter",
      model: routeName,
      start: stringRange.start,
      value: line.slice(stringRange.start, stringRange.end),
    });
  }

  return contexts;
}

function routeParameterContextRouteName(prefix: string): string | null {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(prefix);
  if (!match) {
    return null;
  }

  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (/=>/.test(currentEntry)) {
    return null;
  }

  return match[2];
}

function isSeederCallPrefix(prefix: string): boolean {
  return /(?:\$this|static|self)->(?:call|callSilent|callOnce)\s*\(\s*(?:\[\s*)?(?:[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*)*$/.test(prefix);
}

function isProviderRegistrationPrefix(prefix: string): boolean {
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)(?:\s*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,?)*\s*$/.test(prefix);
}

function isRouteControllerClassPrefix(prefix: string): boolean {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*$/.test(prefix) ||
    /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*$/.test(prefix);
}

function routeControllerActionClass(prefix: string): string | null {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*$/.exec(prefix)?.[1] ?? null;
}

function routeControllerGroupActionClass(source: string, lineNumber: number, prefix: string): string | null {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }

  return activeRouteControllerGroupClass(source.split(/\r?\n/).slice(0, lineNumber));
}

function activeRouteControllerGroupClass(lines: string[]): string | null {
  const stack: Array<{ closeDepth: number; controller: string }> = [];
  let braceDepth = 0;

  for (const line of lines) {
    const controller = routeControllerGroupController(line);
    const nextBraceDepth = braceDepth + braceDelta(line);

    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller,
      });
    }

    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }

  return stack.at(-1)?.controller ?? null;
}

function routeControllerGroupController(line: string): string | null {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}

function braceDelta(line: string): number {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}

function isProviderRegistrationFile(filePath: string): boolean {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}

function routeParameters(route: LaravelIndex["routes"][number] | undefined): string[] {
  if (!route?.uri) {
    return [];
  }

  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}

function diagnosticKindForPrefix(prefix: string): DiagnosticStringContext["kind"] | null {
  if (isRouteNamePrefix(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
  }
  if (
    /\bInertia::render\s*\(\s*$/.test(prefix) ||
    /(?<!::)\binertia\s*\(\s*$/.test(prefix) ||
    /\bRoute::inertia\s*\(\s*['"][^'"]*['"]\s*,\s*$/.test(prefix)
  ) {
    return "inertiaPage";
  }
  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }
  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
  }
  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }
  if (
    /->(can|cannot|authorize)\s*\(\s*$/.test(prefix) ||
    /Gate::(allows|denies|authorize|check|any|none)\s*\(\s*$/.test(prefix) ||
    /@(can|cannot|canany)\s*\(\s*$/.test(prefix)
  ) {
    return "authorization";
  }
  if (/\b(app|resolve)\s*\(\s*$/.test(prefix) || /App::(make|bound|has)\s*\(\s*$/.test(prefix)) {
    return "container";
  }
  if (
    /\bArtisan::(?:call|queue)\s*\(\s*$/.test(prefix) ||
    /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*$/.test(prefix) ||
    /\bSchedule::command\s*\(\s*$/.test(prefix) ||
    /->command\s*\(\s*$/.test(prefix)
  ) {
    return "command";
  }
  if (isMiddlewareStringPrefix(prefix)) {
    return "middleware";
  }
  if (
    /->(validated|input)\s*\(\s*$/.test(prefix) ||
    /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) ||
    /->(only|except)\s*\(\s*\[\s*$/.test(prefix)
  ) {
    return "validationField";
  }

  return null;
}

function validationSchemaContextForPrefix(
  prefix: string,
  value: string,
): Pick<DiagnosticStringContext, "kind" | "tableName" | "value"> | null {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*$/.exec(prefix);
  if (columnMatch) {
    return { kind: "schemaColumn", tableName: columnMatch[1], value };
  }

  return /\bRule::(?:exists|unique)\(\s*$/.test(prefix) ? { kind: "schemaTable", value } : null;
}

function isRouteNamePrefix(prefix: string): boolean {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) ||
    /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) ||
    /->routeIs\s*\(\s*$/.test(prefix);
}

function eloquentRelationModel(prefix: string): string | null {
  const relationMethods =
    "(with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  return (
    new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ??
    new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ??
    null
  );
}

function findModel(index: LaravelIndex, modelName: string | undefined): LaravelIndex["models"][number] | null {
  if (!modelName) {
    return null;
  }

  return index.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName,
  ) ?? null;
}

function findController(index: LaravelIndex, controllerName: string | undefined): LaravelIndex["controllers"][number] | null {
  if (!controllerName) {
    return null;
  }

  return index.controllers.find(
    (controller) => controller.className === controllerName || `${controller.namespace}\\${controller.className}` === controllerName,
  ) ?? null;
}

function factoryStatesForModel(index: LaravelIndex, modelName: string): string[] {
  return index.factories
    .filter((factory) => factory.model === modelName || factory.model?.split("\\").at(-1) === modelName)
    .flatMap((factory) => factory.states);
}

function documentPathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function bladeSectionLayoutForDocument(document: TextDocument, index: LaravelIndex): LaravelIndex["bladeViews"][number] | null {
  const documentPath = documentPathFromUri(document.uri);
  const view = documentPath ? index.bladeViews.find((candidate) => candidate.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }

  const layout = index.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}

function bladeStackLayoutForDocument(document: TextDocument, index: LaravelIndex): LaravelIndex["bladeViews"][number] | null {
  const documentPath = documentPathFromUri(document.uri);
  const view = documentPath ? index.bladeViews.find((candidate) => candidate.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }

  const layout = index.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}

function validationFieldsForDocument(document: TextDocument, index: LaravelIndex): ValidationFieldInfo[] {
  const documentPath = documentPathFromUri(document.uri);
  const documentText = document.getText();
  const fields: ValidationFieldInfo[] = [];

  if (documentPath) {
    for (const ruleSet of index.validationRules.filter((rule) => rule.filePath === documentPath)) {
      fields.push(...ruleSet.fields);
    }
  }

  const requestClass = formRequestClassForDocument(documentText);
  if (requestClass) {
    for (const ruleSet of index.validationRules.filter((rule) => rule.className === requestClass)) {
      fields.push(...ruleSet.fields);
    }
  }

  return uniqueValidationFields(fields);
}

function formRequestClassForDocument(source: string): string | null {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}

function uniqueValidationFields(fields: ValidationFieldInfo[]): ValidationFieldInfo[] {
  const byName = new Map<string, ValidationFieldInfo>();

  for (const field of fields) {
    const existing = byName.get(field.field);
    byName.set(field.field, {
      field: field.field,
      rules: existing ? uniqueStrings([...existing.rules, ...field.rules]) : field.rules,
    });
  }

  return [...byName.values()].sort((left, right) => left.field.localeCompare(right.field));
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current[rightIndex + 1] = Math.min(
        current[rightIndex] + 1,
        previous[rightIndex + 1] + 1,
        previous[rightIndex] + (left[leftIndex] === right[rightIndex] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function quotedStringRanges(line: string): Array<{ end: number; start: number }> {
  const ranges: Array<{ end: number; start: number }> = [];

  for (let index = 0; index < line.length; index += 1) {
    const quote = line[index];
    if (quote !== "'" && quote !== '"') {
      continue;
    }

    const start = index + 1;
    index += 1;
    while (index < line.length) {
      if (line[index] === "\\") {
        index += 2;
        continue;
      }
      if (line[index] === quote) {
        ranges.push({ end: index, start });
        break;
      }
      index += 1;
    }
  }

  return ranges;
}

function unresolvedDiagnostic(
  line: number,
  context: DiagnosticStringContext,
  message: string,
): Diagnostic {
  return {
    data: {
      kind: context.kind,
      ...(context.model ? { model: context.model } : {}),
      ...(context.tableName ? { tableName: context.tableName } : {}),
      value: context.value,
    } satisfies LaravelDiagnosticData,
    message,
    range: {
      end: { character: context.end, line },
      start: { character: context.start, line },
    },
    severity: DiagnosticSeverity.Warning,
    source: "laravel-assist",
  };
}

// Matches the string position inside `middleware(...)` / `withoutMiddleware(...)`
// calls, including elements after the first in an inline array such as
// `->middleware(['auth:api', 'ensure-selfsignup-completed'])`.
function isMiddlewareStringPrefix(prefix: string): boolean {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}
