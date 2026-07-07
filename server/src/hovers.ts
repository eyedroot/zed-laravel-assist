import { Hover, MarkupKind, Position } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { frameworkBuilderMethodTargetForPrefix, instanceMemberTargetForPrefix } from "./instanceTypes.js";
import { LaravelIndex } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

export function hoverForDocument(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): Hover | null {
  const componentPropContext = componentPropContextAtPosition(document, position);
  if (componentPropContext) {
    const component = index.bladeComponents.find((candidate) =>
      candidate.name === componentPropContext.componentName && candidate.props.includes(componentPropContext.prop)
    );
    if (!component) {
      return null;
    }

    return markdownHover([
      `**Blade component prop** \`${component.name}.${componentPropContext.prop}\``,
      `- Component: \`${component.name}\``,
      `- File: \`${component.filePath}\``,
    ]);
  }

  const componentContext = componentContextAtPosition(document, position);
  if (componentContext) {
    const component = index.bladeComponents.find((candidate) => candidate.name === componentContext.value);
    if (!component) {
      return null;
    }

    return markdownHover([
      `**Blade ${component.source} component** \`${component.name}\``,
      component.props.length > 0 ? `- Props: \`${component.props.join(", ")}\`` : "",
      `- View: \`${component.viewName}\``,
      `- File: \`${component.filePath}\``,
    ]);
  }

  const livewireContext = livewireComponentTagContextAtPosition(document, position);
  if (livewireContext) {
    const component = index.livewireComponents.find((candidate) => candidate.name === livewireContext.value);
    if (!component) {
      return null;
    }

    return markdownHover([
      `**Livewire component** \`${component.name}\``,
      `- Class: \`${component.namespace ? `${component.namespace}\\` : ""}${component.className}\``,
      component.properties.length > 0 ? `- Properties: \`${component.properties.join(", ")}\`` : "",
      component.methods.length > 0 ? `- Actions: \`${component.methods.join(", ")}\`` : "",
      `- File: \`${component.filePath}\``,
    ]);
  }

  const providerContext = serviceProviderContextAtPosition(document, position, index);
  if (providerContext) {
    return markdownHover([
      `**Laravel service provider** \`${serviceProviderName(providerContext)}\``,
      `- Source: \`${providerContext.source}\``,
      providerContext.classFilePath ? `- Class file: \`${providerContext.classFilePath}\`` : "",
      `- Registered in: \`${providerContext.filePath}\``,
    ]);
  }

  const controllerAction = routeControllerActionContextAtPosition(document, position, index);
  if (controllerAction) {
    return markdownHover([
      `**Laravel controller action** \`${controllerAction.controller.className}@${controllerAction.action}\``,
      `- File: \`${controllerAction.controller.filePath}\``,
    ]);
  }

  const controller = routeControllerClassContextAtPosition(document, position, index);
  if (controller) {
    return markdownHover([
      `**Laravel controller** \`${controllerName(controller)}\``,
      controller.actions.length > 0 ? `- Actions: \`${controller.actions.join(", ")}\`` : "",
      `- File: \`${controller.filePath}\``,
    ]);
  }

  const facadeContext = facadeStaticCallContextAtPosition(document, position, index);
  if (facadeContext) {
    return markdownHover([
      `**Laravel facade** \`${facadeName(facadeContext.facade)}\``,
      facadeContext.facade.source ? `- Source: \`${facadeContext.facade.source}\`` : "",
      facadeContext.facade.target ? `- Target: \`${facadeContext.facade.target}\`` : "",
      facadeContext.facade.accessor ? `- Accessor: \`${facadeContext.facade.accessor}\`` : "",
      facadeContext.facade.binding ? `- Binding: \`${facadeContext.facade.binding.lifetime} ${facadeContext.facade.binding.abstract}\`` : "",
      facadeContext.facade.binding?.concrete ? `- Concrete: \`${facadeContext.facade.binding.concrete}\`` : "",
      facadeContext.facade.binding ? `- Binding file: \`${facadeContext.facade.binding.filePath}\`` : "",
      `- File: \`${facadeContext.facade.filePath}\``,
    ]);
  }

  const artifactContext = artifactClassContextAtPosition(document, position, index);
  if (artifactContext) {
    return markdownHover([
      `**Laravel ${artifactContext.artifact.kind}** \`${artifactName(artifactContext.artifact)}\``,
      artifactContext.artifact.constructorSignature
        ? `- Constructor: \`__construct(${artifactContext.artifact.constructorSignature})\``
        : "",
      artifactContext.artifact.related.length > 0 ? `- Related: \`${artifactContext.artifact.related.join(", ")}\`` : "",
      `- File: \`${artifactContext.artifact.filePath}\``,
    ]);
  }

  const macroMethod = macroMethodContextAtPosition(document, position, index);
  if (macroMethod) {
    return markdownHover([
      `**Laravel macro** \`${macroMethod.macro.className}::${macroMethod.macro.method}\``,
      `- File: \`${macroMethod.macro.filePath}\``,
    ]);
  }

  const seederContext = seederClassContextAtPosition(document, position, index);
  if (seederContext) {
    return markdownHover([
      `**Laravel seeder** \`${seederContext.seeder.className}\``,
      seederContext.seeder.calls.length > 0 ? `- Calls: \`${seederContext.seeder.calls.join(", ")}\`` : "",
      seederContext.seeder.namespace ? `- Namespace: \`${seederContext.seeder.namespace}\`` : "",
      `- File: \`${seederContext.seeder.filePath}\``,
    ]);
  }

  const factoryState = factoryStateContextAtPosition(document, position, index);
  if (factoryState) {
    return markdownHover([
      `**Factory state** \`${factoryState.model}.${factoryState.state}\``,
      `- Factory: \`${factoryState.factory.className}\``,
      `- File: \`${factoryState.factory.filePath}\``,
    ]);
  }

  const modelProperty = modelPropertyContextAtPosition(document, position, index);
  if (modelProperty) {
    return markdownHover(modelPropertyHoverLines(modelProperty.model, modelProperty.property, index));
  }

  const eloquentMethod = eloquentMethodContextAtPosition(document, position, index);
  if (eloquentMethod?.kind === "scope") {
    const traitScope = eloquentMethod.model.scopeDetails?.find((detail) => detail.name === eloquentMethod.scope);
    return markdownHover([
      `**Eloquent scope** \`${eloquentMethod.model.className}.${eloquentMethod.scope}\``,
      `- Table: \`${eloquentMethod.model.tableName}\``,
      `- File: \`${traitScope?.filePath ?? eloquentMethod.model.filePath}\``,
    ]);
  }
  if (eloquentMethod?.kind === "builderMethod") {
    return markdownHover([
      `**Custom Eloquent builder method** \`${eloquentMethod.model.className}.${eloquentMethod.method.name}\``,
      `- Builder: \`${eloquentMethod.builder.className}\``,
      eloquentMethod.method.returnType ? `- Returns: \`${eloquentMethod.method.returnType}\`` : "",
      eloquentMethod.builder.filePath ? `- File: \`${eloquentMethod.builder.filePath}\`` : "",
    ]);
  }
  if (eloquentMethod?.kind === "framework") {
    return markdownHover([
      eloquentMethod.relation
        ? `**Laravel relation method** \`${eloquentMethod.className.split("\\").at(-1)}.${eloquentMethod.name}\``
        : `**Eloquent builder method** \`${eloquentMethod.className.split("\\").at(-1)}.${eloquentMethod.name}\``,
      eloquentMethod.relation
        ? `- Relation: \`${eloquentMethod.model.className}.${eloquentMethod.relation.name}\``
        : `- Model: \`${eloquentMethod.model.className}\``,
      `- File: \`${eloquentMethod.filePath}\``,
    ]);
  }

  const instanceMember = instanceMemberHoverAtPosition(document, position, index);
  if (instanceMember) {
    const relation = instanceMember.model.relations.find((candidate) => candidate.name === instanceMember.name);
    if (relation) {
      return markdownHover([
        `**Eloquent relation** \`${instanceMember.model.className}.${relation.name}\``,
        `- Type: \`${relation.type}\``,
        relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
        `- File: \`${instanceMember.filePath}\``,
      ]);
    }

    return markdownHover([
      instanceMember.kind === "framework"
        ? `**Laravel relation method** \`${instanceMember.className?.split("\\").at(-1) ?? "Relation"}.${instanceMember.name}\``
        : instanceMember.kind === "scope"
        ? `**Eloquent scope** \`${instanceMember.model.className}.${instanceMember.name}\``
        : `**Model method** \`${instanceMember.model.className}.${instanceMember.name}\``,
      instanceMember.relation
        ? `- Relation: \`${instanceMember.model.className}.${instanceMember.relation.name}\``
        : "",
      `- File: \`${instanceMember.filePath}\``,
    ]);
  }

  const context = stringContextAtPosition(document, position, index);
  if (!context) {
    return null;
  }

  if (context.kind === "route") {
    const route = index.routes.find((candidate) => candidate.name === context.value);
    if (!route) {
      return null;
    }

    return markdownHover([
      `**Laravel route** \`${route.name}\``,
      route.methods.length > 0 ? `- Methods: \`${route.methods.join("|")}\`` : "",
      route.uri ? `- URI: \`${route.uri}\`` : "",
      route.action ? `- Action: \`${route.action}\`` : "",
      route.middleware.length > 0 ? `- Middleware: \`${route.middleware.join(", ")}\`` : "",
      `- File: \`${route.filePath}\``,
    ]);
  }

  if (context.kind === "routeParameter") {
    const route = index.routes.find((candidate) => candidate.name === context.model);
    if (!route || !routeParameters(route).includes(context.value)) {
      return null;
    }

    return markdownHover([
      `**Route parameter** \`${context.model}.${context.value}\``,
      route.uri ? `- URI: \`${route.uri}\`` : "",
      `- File: \`${route.filePath}\``,
    ]);
  }

  if (context.kind === "view") {
    const view = index.bladeViews.find((candidate) => candidate.name === context.value);
    if (!view) {
      return null;
    }

    return markdownHover([
      `**Laravel view** \`${view.name}\``,
      view.extends ? `- Extends: \`${view.extends}\`` : "",
      view.sections.length > 0 ? `- Sections: \`${view.sections.join(", ")}\`` : "",
      `- File: \`${view.filePath}\``,
    ]);
  }

  if (context.kind === "bladeSection") {
    const layout = index.bladeViews.find((candidate) => candidate.name === context.model);
    if (!layout || !layout.yields.includes(context.value)) {
      return null;
    }

    return markdownHover([
      `**Blade section** \`${context.value}\``,
      `- Layout: \`${layout.name}\``,
      `- File: \`${layout.filePath}\``,
    ]);
  }

  if (context.kind === "bladeStack") {
    const layout = index.bladeViews.find((candidate) => candidate.name === context.model);
    if (!layout || !(layout.stacks ?? []).includes(context.value)) {
      return null;
    }

    return markdownHover([
      `**Blade stack** \`${context.value}\``,
      `- Layout: \`${layout.name}\``,
      `- File: \`${layout.filePath}\``,
    ]);
  }

  if (context.kind === "config") {
    const entry = index.configEntries.find((candidate) => candidate.key === context.value);
    if (!entry && !index.configKeys.includes(context.value)) {
      return null;
    }

    return markdownHover([
      `**Laravel config** \`${context.value}\``,
      entry ? `- File: \`${entry.filePath}\`` : "",
    ]);
  }

  if (context.kind === "env") {
    const entry = index.envEntries.find((candidate) => candidate.key === context.value);
    if (!entry && !index.envKeys.includes(context.value)) {
      return null;
    }

    return markdownHover([
      `**Environment key** \`${context.value}\``,
      entry ? `- File: \`${entry.filePath}\`` : "",
    ]);
  }

  if (context.kind === "translation") {
    const translation = index.translationKeys.find((candidate) => candidate.key === context.value);
    if (!translation) {
      return null;
    }

    return markdownHover([
      `**Laravel translation** \`${translation.key}\``,
      `- Locale: \`${translation.locale}\``,
      `- Source: \`${translation.source}\``,
      `- File: \`${translation.filePath}\``,
    ]);
  }

  if (context.kind === "authorization") {
    const entry = index.authorization.find((candidate) => candidate.ability === context.value);
    if (!entry) {
      return null;
    }

    return markdownHover([
      `**Laravel ability** \`${entry.ability}\``,
      `- Source: \`${entry.source}\``,
      entry.policy ? `- Policy: \`${entry.policy}\`` : "",
      entry.model ? `- Model: \`${entry.model}\`` : "",
      `- File: \`${entry.filePath}\``,
    ]);
  }

  if (context.kind === "container") {
    const binding = index.containerBindings.find((candidate) => candidate.abstract === context.value);
    if (!binding) {
      return null;
    }

    return markdownHover([
      `**Container binding** \`${binding.abstract}\``,
      `- Lifetime: \`${binding.lifetime}\``,
      binding.concrete ? `- Concrete: \`${binding.concrete}\`` : "",
      `- File: \`${binding.filePath}\``,
    ]);
  }

  if (context.kind === "command") {
    const command = index.commands.find((candidate) => candidate.name === context.value);
    if (!command) {
      return null;
    }

    return markdownHover([
      `**Artisan command** \`${command.name}\``,
      `- Signature: \`${command.signature}\``,
      command.description ? `- Description: \`${command.description}\`` : "",
      command.className ? `- Class: \`${command.className}\`` : "",
      `- File: \`${command.filePath}\``,
    ]);
  }

  if (context.kind === "middleware") {
    const middleware = index.middleware.find((candidate) => candidate.alias === context.value.split(":")[0]);
    if (!middleware) {
      return null;
    }

    return markdownHover([
      `**Laravel middleware** \`${middleware.alias}\``,
      `- Source: \`${middleware.source}\``,
      middleware.className ? `- Class: \`${middleware.className}\`` : "",
      `- File: \`${middleware.filePath}\``,
    ]);
  }

  if (context.kind === "relation") {
    const model = index.models.find(
      (candidate) => candidate.className === context.model || `${candidate.namespace}\\${candidate.className}` === context.model,
    );
    const relation = model?.relations.find((candidate) => candidate.name === context.value);
    if (!model || !relation) {
      return null;
    }

    return markdownHover([
      `**Eloquent relation** \`${model.className}.${relation.name}\``,
      `- Type: \`${relation.type}\``,
      relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
      `- Table: \`${model.tableName}\``,
      `- File: \`${model.filePath}\``,
    ]);
  }

  if (context.kind === "modelAttribute") {
    const table = index.schemaTables.find((candidate) => candidate.name === context.tableName);
    const column = table?.columns.find((candidate) => candidate.name === context.value);
    if (!column) {
      return null;
    }

    return markdownHover([
      `**Eloquent attribute** \`${context.tableName}.${column.name}\``,
      `- Type: \`${column.type}\``,
      column.modifiers.length > 0 ? `- Modifiers: \`${column.modifiers.join(", ")}\`` : "",
      `- File: \`${column.filePath}\``,
    ]);
  }

  if (context.kind === "schemaTable") {
    const table = index.schemaTables.find((candidate) => candidate.name === context.value);
    if (!table) {
      return null;
    }

    return markdownHover([
      `**Schema table** \`${table.name}\``,
      table.columns.length > 0 ? `- Columns: \`${table.columns.map((column) => column.name).join(", ")}\`` : "",
      `- File: \`${table.filePath}\``,
    ]);
  }

  if (context.kind === "schemaColumn") {
    const table = index.schemaTables.find((candidate) => candidate.name === context.tableName);
    const column = table?.columns.find((candidate) => candidate.name === context.value);
    if (!column) {
      return null;
    }

    return markdownHover([
      `**Schema column** \`${context.tableName}.${column.name}\``,
      `- Type: \`${column.type}\``,
      column.modifiers.length > 0 ? `- Modifiers: \`${column.modifiers.join(", ")}\`` : "",
      `- File: \`${column.filePath}\``,
    ]);
  }

  if (context.kind === "validationField") {
    const field = validationFieldForDocument(document, context.value, index);
    if (!field) {
      return null;
    }

    return markdownHover([
      `**Validated request field** \`${field.field}\``,
      field.rules.length > 0 ? `- Rules: \`${field.rules.join("|")}\`` : "",
      field.filePaths.length > 0 ? `- File: \`${field.filePaths.join(", ")}\`` : "",
    ]);
  }

  return null;
}

function seederClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { seeder: LaravelIndex["seeders"][number] } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isSeederCallPrefix(line.slice(0, reference.start))) {
    return null;
  }

  const seeder = index.seeders.find((candidate) => seederMatches(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder ? { seeder } : null;
}

function macroMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { macro: LaravelIndex["macros"][number] } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const className = macroStaticCallClass(line.slice(0, token.start));
  if (!className) {
    return null;
  }

  const macro = index.macros.find((candidate) =>
    candidate.method === token.value &&
    classNameMatches(candidate.className, resolvePhpClassReference(document.getText(), className))
  );
  return macro ? { macro } : null;
}

function serviceProviderContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): LaravelIndex["providers"][number] | null {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath || !isProviderRegistrationFile(documentPath)) {
    return null;
  }

  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isProviderRegistrationPrefix(line.slice(0, reference.start))) {
    return null;
  }

  return index.providers.find((provider) =>
    serviceProviderMatches(provider, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}

function routeControllerClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): LaravelIndex["controllers"][number] | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isRouteControllerClassPrefix(line.slice(0, reference.start))) {
    return null;
  }

  return index.controllers.find((controller) =>
    controllerMatches(controller, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}

function routeControllerActionContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { action: string; controller: LaravelIndex["controllers"][number] } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const prefix = line.slice(0, token.start - 1);
  const controllerName = routeControllerActionClass(prefix) ?? routeControllerGroupActionClass(document, position.line, prefix);
  const resolvedControllerName = controllerName ? resolvePhpClassReference(document.getText(), controllerName) : null;
  const controller = resolvedControllerName ? index.controllers.find((candidate) => controllerMatches(candidate, resolvedControllerName)) : null;
  return controller?.actions.includes(token.value)
    ? { action: token.value, controller }
    : null;
}

function artifactClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { artifact: LaravelIndex["artifacts"][number] } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference) {
    return null;
  }

  const kinds = artifactKindsForReference(line, reference);
  if (!kinds) {
    return null;
  }

  const artifact = index.artifacts.find(
    (candidate) => kinds.includes(candidate.kind) && artifactMatches(candidate, resolvePhpClassReference(document.getText(), reference.value)),
  );
  return artifact ? { artifact } : null;
}

function facadeStaticCallContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { facade: LaravelIndex["facades"][number] } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }

  const facade = index.facades.find((candidate) =>
    facadeMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade ? { facade } : null;
}

type HoverStringContext =
  | {
      kind: "authorization" | "command" | "config" | "container" | "env" | "middleware" | "route" | "translation" | "validationField" | "view";
      value: string;
    }
  | {
      kind: "bladeSection";
      model: string;
      value: string;
    }
  | {
      kind: "bladeStack";
      model: string;
      value: string;
    }
  | {
      kind: "routeParameter";
      model: string;
      value: string;
    }
  | {
      kind: "relation";
      model: string;
      value: string;
    }
  | {
      kind: "modelAttribute";
      tableName: string;
      value: string;
    }
  | {
      kind: "schemaTable";
      value: string;
    }
  | {
      kind: "schemaColumn";
      tableName: string;
      value: string;
    };
type HoverSimpleKind = Extract<
  HoverStringContext,
  { kind: "authorization" | "command" | "config" | "container" | "env" | "middleware" | "route" | "translation" | "validationField" | "view" }
>["kind"];

function livewireComponentTagContextAtPosition(
  document: TextDocument,
  position: Position,
): { value: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";

  for (const match of line.matchAll(/<livewire:([A-Za-z0-9_.-]+)/g)) {
    const name = match[1];
    const start = (match.index ?? 0) + "<livewire:".length;
    const end = start + name.length;
    if (position.character >= start && position.character <= end) {
      return { value: name };
    }
  }

  return null;
}

function componentContextAtPosition(
  document: TextDocument,
  position: Position,
): { value: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";

  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }

    const start = (match.index ?? 0) + 3;
    const end = start + rawName.length;
    if (position.character >= start && position.character <= end) {
      return { value: rawName.replace(/:/g, ".") };
    }
  }

  return null;
}

function componentPropContextAtPosition(
  document: TextDocument,
  position: Position,
): { componentName: string; prop: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";

  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }

    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      const end = start + prop.length;
      if (position.character >= start && position.character <= end) {
        return { componentName, prop };
      }
    }
  }

  return null;
}

function stringContextAtPosition(document: TextDocument, position: Position, index: LaravelIndex): HoverStringContext | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";

  for (const stringRange of quotedStringRanges(line)) {
    if (position.character < stringRange.start || position.character > stringRange.end) {
      continue;
    }

    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel(prefix);
    if (relationModel) {
      return { kind: "relation", model: relationModel, value };
    }

    const tableName = modelAttributeTableAtPosition(document, position, index);
    if (tableName) {
      return { kind: "modelAttribute", tableName, value };
    }

    const validationSchemaContext = validationSchemaContextForPrefix(prefix, value);
    if (validationSchemaContext) {
      return validationSchemaContext;
    }

    const bladeSectionLayout = bladeSectionLayoutForDocument(document, prefix, index);
    if (bladeSectionLayout) {
      return { kind: "bladeSection", model: bladeSectionLayout.name, value };
    }

    const bladeStackLayout = bladeStackLayoutForDocument(document, prefix, index);
    if (bladeStackLayout) {
      return { kind: "bladeStack", model: bladeStackLayout.name, value };
    }

    const routeParameterRouteName = routeParameterContextRouteName(prefix);
    if (routeParameterRouteName) {
      return { kind: "routeParameter", model: routeParameterRouteName, value };
    }

    const kind = hoverKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }

  return null;
}

function eloquentMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
):
  | { kind: "builderMethod"; builder: NonNullable<LaravelIndex["models"][number]["customBuilder"]>; method: NonNullable<LaravelIndex["models"][number]["customBuilder"]>["methods"][number]; model: LaravelIndex["models"][number] }
  | { className: string; filePath: string; kind: "framework"; model: LaravelIndex["models"][number]; name: string; relation?: LaravelIndex["models"][number]["relations"][number] }
  | { kind: "scope"; model: LaravelIndex["models"][number]; scope: string }
  | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  const modelName = eloquentScopeModel(line.slice(0, token.start));
  if (!modelName) {
    const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index, token.value);
    return frameworkMethod?.className
      ? {
          className: frameworkMethod.className,
          filePath: frameworkMethod.filePath,
          kind: "framework",
          model: frameworkMethod.model,
          name: frameworkMethod.name,
          ...(frameworkMethod.relation ? { relation: frameworkMethod.relation } : {}),
        }
      : null;
  }

  const resolvedModelName = resolvePhpClassReference(document.getText(), modelName);
  const model = index.models.find(
    (candidate) => candidate.className === resolvedModelName || `${candidate.namespace}\\${candidate.className}` === resolvedModelName,
  );
  if (!model) {
    return null;
  }

  if (model.scopes.includes(token.value)) {
    return { kind: "scope", model, scope: token.value };
  }

  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  if (builderMethod && model.customBuilder) {
    return { builder: model.customBuilder, kind: "builderMethod", method: builderMethod, model };
  }

  const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index, token.value);
  return frameworkMethod?.className
    ? {
        className: frameworkMethod.className,
        filePath: frameworkMethod.filePath,
        kind: "framework",
        model: frameworkMethod.model,
        name: frameworkMethod.name,
      }
    : null;
}

function instanceMemberHoverAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReturnType<typeof instanceMemberTargetForPrefix> {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  return instanceMemberTargetForPrefix(document.getText(), prefix, index, token.value);
}

function factoryStateContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { factory: LaravelIndex["factories"][number]; model: string; state: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const modelName = factoryStateModel(line.slice(0, token.start));
  if (!modelName) {
    return null;
  }

  const factory = index.factories.find(
    (candidate) =>
      candidate.states.includes(token.value) &&
      (candidate.model === modelName || candidate.model?.split("\\").at(-1) === modelName),
  );

  return factory ? { factory, model: modelName, state: token.value } : null;
}

// Hover on `$model->property` where the property is a schema column, an
// accessor, a relation, or a `<relation>_count` virtual attribute.
function modelPropertyContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { model: LaravelIndex["models"][number]; property: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token || !line.slice(0, token.start).endsWith("->")) {
    return null;
  }

  const access = /(\$[A-Za-z_][A-Za-z0-9_]*)->$/.exec(line.slice(0, token.start));
  if (!access) {
    return null;
  }

  let model: LaravelIndex["models"][number] | null = null;
  if (access[1] === "$this") {
    const documentPath = documentPathFromUri(document.uri);
    model = index.models.find((candidate) => candidate.filePath === documentPath) ?? null;
  } else {
    const documentText = document.getText();
    const className = modelClassForVariable(documentText, access[1]);
    const resolved = className ? resolvePhpClassReference(documentText, className) : null;
    model = resolved
      ? index.models.find(
          (candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved,
        ) ?? null
      : null;
  }

  if (!model || !isKnownModelProperty(model, token.value, index)) {
    return null;
  }

  return { model, property: token.value };
}

function modelClassForVariable(source: string, variable: string): string | null {
  const escapedName = variable.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assignment = new RegExp(
    `\\$${escapedName}\\s*=\\s*(?:new\\s+)?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:::|\\()`,
  ).exec(source);
  if (assignment) {
    return assignment[1];
  }

  return new RegExp(`([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s+\\$${escapedName}\\b`).exec(source)?.[1] ?? null;
}

function isKnownModelProperty(
  model: LaravelIndex["models"][number],
  property: string,
  index: LaravelIndex,
): boolean {
  const table = index.schemaTables.find((candidate) => candidate.name === model.tableName);
  return Boolean(
    table?.columns.some((column) => column.name === property) ||
      model.accessors?.includes(property) ||
      model.appends?.includes(property) ||
      model.relations.some((relation) => relation.name === property || `${relation.name}_count` === property),
  );
}

function modelPropertyHoverLines(
  model: LaravelIndex["models"][number],
  property: string,
  index: LaravelIndex,
): string[] {
  const relation = model.relations.find((candidate) => candidate.name === property);
  if (relation) {
    return [
      `**Eloquent relation** \`${model.className}.${property}\``,
      `- Type: \`${relation.type}\``,
      relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
      `- File: \`${model.filePath}\``,
    ];
  }

  const countRelation = model.relations.find((candidate) => `${candidate.name}_count` === property);
  if (countRelation) {
    return [
      `**Relation count** \`${model.className}.${property}\``,
      `- Counts: \`${countRelation.name}\` (available via \`withCount\`)`,
      `- File: \`${model.filePath}\``,
    ];
  }

  if (model.accessors?.includes(property)) {
    const accessor = model.accessorDetails?.find((candidate) => candidate.name === property);
    return [
      `**Model accessor** \`${model.className}.${property}\``,
      accessor ? `- Source: \`${accessor.source === "attribute" ? "Attribute object" : "classic accessor"}\`` : "",
      accessor?.returnType ? `- Returns: \`${accessor.returnType}\`` : "",
      `- File: \`${model.filePath}\``,
    ];
  }

  if (model.appends?.includes(property)) {
    return [
      `**Appended model attribute** \`${model.className}.${property}\``,
      "- Declared in: `$appends`",
      `- File: \`${model.filePath}\``,
    ];
  }

  const table = index.schemaTables.find((candidate) => candidate.name === model.tableName);
  const column = table?.columns.find((candidate) => candidate.name === property);
  const cast = model.castDetails?.find((candidate) => candidate.name === property);
  return [
    `**Model attribute** \`${model.className}.${property}\``,
    column?.type ? `- Column type: \`${column.type}\`` : "",
    cast ? `- Cast: \`${cast.type}\`` : "",
    `- Table: \`${model.tableName}\``,
    column ? `- Migration: \`${column.filePath}\`` : "",
  ];
}

function tokenAtPosition(line: string, character: number): { start: number; value: string } | null {
  for (const match of line.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }

  return null;
}

function classConstantContextAtPosition(line: string, character: number): { start: number; value: string } | null {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }

  return null;
}

function classReferenceAtPosition(line: string, character: number): { start: number; value: string } | null {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }

  return null;
}

function quotedStringAtPosition(line: string, character: number): { end: number; start: number; value: string } | null {
  for (const range of quotedStringRanges(line)) {
    if (character >= range.start && character <= range.end) {
      return {
        ...range,
        value: line.slice(range.start, range.end),
      };
    }
  }

  return null;
}

function artifactKindsForReference(
  line: string,
  reference: { start: number; value: string },
): LaravelIndex["artifacts"][number]["kind"][] | null {
  const before = line.slice(0, reference.start);
  const after = line.slice(reference.start + reference.value.length);

  if (/\bevent\s*\(\s*new\s+$/.test(before)) {
    return ["event"];
  }
  if (/\bdispatch\s*\(\s*new\s+$/.test(before) || /^::dispatch\s*\(/.test(after)) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+$/.test(before)) {
    return ["mailable", "notification"];
  }
  if (/\bnew\s+$/.test(before)) {
    return ["event", "job", "listener", "mailable", "notification", "resource"];
  }

  return null;
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

function routeControllerGroupActionClass(document: TextDocument, lineNumber: number, prefix: string): string | null {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }

  return activeRouteControllerGroupClass(document.getText().split(/\r?\n/).slice(0, lineNumber));
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

function bladeSectionLayoutForDocument(
  document: TextDocument,
  prefix: string,
  index: LaravelIndex,
): LaravelIndex["bladeViews"][number] | null {
  if (!/@section\s*\(\s*$/.test(prefix)) {
    return null;
  }

  const view = bladeViewForDocument(document, index);
  if (!view?.extends) {
    return null;
  }

  const layout = index.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}

function bladeStackLayoutForDocument(
  document: TextDocument,
  prefix: string,
  index: LaravelIndex,
): LaravelIndex["bladeViews"][number] | null {
  if (!/@(?:push|prepend)\s*\(\s*$/.test(prefix)) {
    return null;
  }

  const view = bladeViewForDocument(document, index);
  if (!view?.extends) {
    return null;
  }

  const layout = index.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}

function bladeViewForDocument(document: TextDocument, index: LaravelIndex): LaravelIndex["bladeViews"][number] | null {
  const documentPath = documentPathFromUri(document.uri);
  return documentPath ? (index.bladeViews.find((view) => view.filePath === documentPath) ?? null) : null;
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

function routeParameters(route: LaravelIndex["routes"][number] | undefined): string[] {
  if (!route?.uri) {
    return [];
  }

  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}

function seederMatches(seeder: LaravelIndex["seeders"][number], value: string): boolean {
  return seeder.className === value ||
    seeder.className === value.split("\\").at(-1) ||
    (seeder.namespace ? `${seeder.namespace}\\${seeder.className}` === value : false);
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

function eloquentScopeModel(prefix: string): string | null {
  return (
    /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ??
    /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->$/.exec(prefix)?.[1] ??
    null
  );
}

function factoryStateModel(prefix: string): string | null {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->$/.exec(prefix)?.[1] ?? null;
}

function macroStaticCallClass(prefix: string): string | null {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? null;
}

function classNameMatches(indexedClassName: string, value: string): boolean {
  return indexedClassName === value || indexedClassName.split("\\").at(-1) === value || value.split("\\").at(-1) === indexedClassName;
}

function artifactMatches(artifact: LaravelIndex["artifacts"][number], value: string): boolean {
  return artifact.className === value ||
    artifact.className === value.split("\\").at(-1) ||
    (artifact.namespace ? `${artifact.namespace}\\${artifact.className}` === value : false);
}

function artifactName(artifact: LaravelIndex["artifacts"][number]): string {
  return artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className;
}

function facadeMatches(facade: LaravelIndex["facades"][number], value: string): boolean {
  return facade.className === value ||
    facade.className === value.split("\\").at(-1) ||
    (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}

function facadeName(facade: LaravelIndex["facades"][number]): string {
  return facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className;
}

function serviceProviderMatches(provider: LaravelIndex["providers"][number], value: string): boolean {
  return provider.className === value ||
    provider.className === value.split("\\").at(-1) ||
    (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}

function serviceProviderName(provider: LaravelIndex["providers"][number]): string {
  return provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
}

function controllerMatches(controller: LaravelIndex["controllers"][number], value: string): boolean {
  return controller.className === value ||
    controller.className === value.split("\\").at(-1) ||
    (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}

function controllerName(controller: LaravelIndex["controllers"][number]): string {
  return controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className;
}

function modelAttributeTableAtPosition(document: TextDocument, position: Position, index: LaravelIndex): string | null {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath) {
    return null;
  }

  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position,
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  if (!match || /\]\s*;\s*$/.test(match[0])) {
    return null;
  }

  return index.models.find((model) => model.filePath === documentPath)?.tableName ?? null;
}

function documentPathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function validationFieldForDocument(
  document: TextDocument,
  fieldName: string,
  index: LaravelIndex,
): { field: string; filePaths: string[]; rules: string[] } | null {
  const fields = validationRuleSetsForDocument(document, index)
    .flatMap((ruleSet) =>
      ruleSet.fields
        .filter((field) => field.field === fieldName)
        .map((field) => ({ ...field, filePath: ruleSet.filePath })),
    );

  if (fields.length === 0) {
    return null;
  }

  return {
    field: fieldName,
    filePaths: uniqueStrings(fields.map((field) => field.filePath)),
    rules: uniqueStrings(fields.flatMap((field) => field.rules)),
  };
}

const DB_COLUMN_ARGUMENT_METHODS =
  "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";

function validationSchemaContextForPrefix(
  prefix: string,
  value: string,
): Extract<HoverStringContext, { kind: "schemaColumn" | "schemaTable" }> | null {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*$/.exec(prefix);
  if (columnMatch) {
    return { kind: "schemaColumn", tableName: columnMatch[1], value };
  }

  const dbColumnMatch = new RegExp(
    `\\bDB::(?:connection\\([^)]*\\)\\s*->\\s*)?table\\(\\s*['"]([A-Za-z0-9_]+)['"]\\s*\\)[^;\\n]*->\\s*${DB_COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?$`,
  ).exec(prefix);
  if (dbColumnMatch) {
    return { kind: "schemaColumn", tableName: dbColumnMatch[1], value };
  }

  if (
    /\bRule::(?:exists|unique)\(\s*$/.test(prefix) ||
    /\bDB::(?:connection\([^)]*\)\s*->\s*)?table\(\s*$/.test(prefix)
  ) {
    return { kind: "schemaTable", value };
  }

  return null;
}

function validationRuleSetsForDocument(
  document: TextDocument,
  index: LaravelIndex,
): LaravelIndex["validationRules"] {
  const documentPath = documentPathFromUri(document.uri);
  const requestClass = formRequestClassForDocument(document.getText());
  const ruleSets = index.validationRules.filter((ruleSet) =>
    (documentPath && ruleSet.filePath === documentPath) ||
    (requestClass && ruleSet.className === requestClass)
  );
  const seen = new Set<string>();

  return ruleSets.filter((ruleSet) => {
    const key = `${ruleSet.filePath}:${ruleSet.className ?? ""}:${ruleSet.source}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function formRequestClassForDocument(source: string): string | null {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function hoverKindForPrefix(prefix: string): HoverSimpleKind | null {
  if (isRouteNamePrefix(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
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

function isRouteNamePrefix(prefix: string): boolean {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) ||
    /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) ||
    /->routeIs\s*\(\s*$/.test(prefix);
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

function markdownHover(lines: string[]): Hover {
  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: lines.filter(Boolean).join("\n"),
    },
  };
}

// Matches the string position inside `middleware(...)` / `withoutMiddleware(...)`
// calls, including elements after the first in an inline array such as
// `->middleware(['auth:api', 'ensure-selfsignup-completed'])`.
function isMiddlewareStringPrefix(prefix: string): boolean {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}
