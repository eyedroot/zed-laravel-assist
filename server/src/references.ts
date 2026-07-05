import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Location, Position, Range } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { LaravelIndex } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

type ReferenceTarget =
  | {
      kind: "component";
      value: string;
    }
  | {
      kind: "componentProp";
      model: string;
      value: string;
    }
  | {
      className: string;
      kind: "facadeClass";
      namespace: string | null;
    }
  | {
      className: string;
      kind: "artifactClass";
      namespace: string | null;
      value: string;
    }
  | {
      className: string;
      kind: "macroMethod";
      value: string;
    }
  | {
      className: string;
      kind: "seeder";
      namespace: string | null;
    }
  | {
      className: string;
      kind: "serviceProvider";
      namespace: string | null;
    }
  | {
      className: string;
      kind: "controller";
      namespace: string | null;
    }
  | {
      kind: "controllerAction";
      model: string;
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
      kind: "authorization" | "command" | "config" | "container" | "env" | "middleware" | "route" | "translation" | "validationField" | "view";
      value: string;
    }
  | {
      kind: "relation" | "scope";
      model: string;
      value: string;
    }
  | {
      builderClassName: string;
      kind: "builderMethod";
      model: string;
      value: string;
    }
  | {
      kind: "factoryState";
      model: string;
      value: string;
    }
  | {
      kind: "modelAttribute";
      modelFilePaths: string[];
      tableName: string;
      value: string;
    };
type ReferenceStringKind = Extract<
  ReferenceTarget,
  { kind: "authorization" | "command" | "config" | "container" | "env" | "middleware" | "route" | "translation" | "validationField" | "view" }
>["kind"];

type ReferenceSource = {
  filePath: string;
  source: string;
};

export async function referencesForDocument(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): Promise<Location[]> {
  const target = referenceTargetAtPosition(document, position, index);
  if (!target) {
    return [];
  }

  const sources = await referenceSources(document, index);
  const references = sources.flatMap((source) => referencesInSource(source, target, index));
  return uniqueLocations(references);
}

function referenceTargetAtPosition(document: TextDocument, position: Position, index: LaravelIndex): ReferenceTarget | null {
  const componentProp = componentPropContextAtPosition(document, position);
  if (componentProp) {
    const component = index.bladeComponents.find((candidate) =>
      candidate.name === componentProp.componentName && candidate.props.includes(componentProp.prop)
    );
    return component ? { kind: "componentProp", model: component.name, value: componentProp.prop } : null;
  }

  const component = componentContextAtPosition(document, position);
  if (component) {
    return {
      kind: "component",
      value: component.value,
    };
  }

  const provider = serviceProviderContextAtPosition(document, position, index);
  if (provider) {
    return provider;
  }

  const controllerAction = routeControllerActionContextAtPosition(document, position, index);
  if (controllerAction) {
    return controllerAction;
  }

  const controller = routeControllerClassContextAtPosition(document, position, index);
  if (controller) {
    return controller;
  }

  const facade = facadeStaticCallContextAtPosition(document, position, index);
  if (facade) {
    return facade;
  }

  const artifact = artifactClassContextAtPosition(document, position, index);
  if (artifact) {
    return artifact;
  }

  const macroMethod = macroMethodContextAtPosition(document, position, index);
  if (macroMethod) {
    return macroMethod;
  }

  const seeder = seederClassContextAtPosition(document, position, index);
  if (seeder) {
    return seeder;
  }

  const factoryState = factoryStateContextAtPosition(document, position, index);
  if (factoryState) {
    return factoryState;
  }

  const eloquentMethod = eloquentMethodContextAtPosition(document, position, index);
  if (eloquentMethod) {
    return eloquentMethod;
  }

  return stringContextAtPosition(document, position, index);
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
      return { value: normalizeComponentName(rawName) };
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

function seederClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isSeederCallPrefix(line.slice(0, reference.start))) {
    return null;
  }

  const seeder = index.seeders.find((candidate) => seederMatches(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder
    ? {
        className: seeder.className,
        kind: "seeder",
        namespace: seeder.namespace,
    }
    : null;
}

function serviceProviderContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const documentPath = pathFromUri(document.uri);
  if (!documentPath || !isProviderRegistrationFile(documentPath)) {
    return null;
  }

  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isProviderRegistrationPrefix(line.slice(0, reference.start))) {
    return null;
  }

  const provider = index.providers.find((candidate) =>
    serviceProviderMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return provider
    ? {
        className: provider.className,
        kind: "serviceProvider",
        namespace: provider.namespace,
      }
    : null;
}

function routeControllerClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isRouteControllerClassPrefix(line.slice(0, reference.start))) {
    return null;
  }

  const controller = index.controllers.find((candidate) =>
    controllerMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return controller
    ? {
        className: controller.className,
        kind: "controller",
        namespace: controller.namespace,
      }
    : null;
}

function routeControllerActionContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const prefix = line.slice(0, token.start - 1);
  const controllerName = routeControllerActionClass(prefix) ?? routeControllerGroupActionClass(document.getText(), position.line, prefix);
  const resolvedControllerName = controllerName ? resolvePhpClassReference(document.getText(), controllerName) : null;
  const controller = resolvedControllerName ? index.controllers.find((candidate) => controllerMatches(candidate, resolvedControllerName)) : null;
  return controller?.actions.includes(token.value)
    ? { kind: "controllerAction", model: controller.className, value: token.value }
    : null;
}

function macroMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
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
  return macro ? { className: macro.className, kind: "macroMethod", value: macro.method } : null;
}

function artifactClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
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
  return artifact
    ? {
        className: artifact.className,
        kind: "artifactClass",
        namespace: artifact.namespace,
        value: artifact.className,
    }
    : null;
}

function facadeStaticCallContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }

  const facade = index.facades.find((candidate) =>
    facadeMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade
    ? {
        className: facade.className,
        kind: "facadeClass",
        namespace: facade.namespace,
      }
    : null;
}

function stringContextAtPosition(document: TextDocument, position: Position, index: LaravelIndex): ReferenceTarget | null {
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

    const attributeTarget = modelAttributeTargetAtPosition(document, position, index, value);
    if (attributeTarget) {
      return attributeTarget;
    }

    if (isValidationFieldPrefix(prefix)) {
      return validationFieldTargetAtPosition(document, index, value);
    }

    const bladeSectionLayout = bladeSectionLayoutForDocument(document, prefix, index);
    if (bladeSectionLayout) {
      return bladeSectionLayout.yields.includes(value)
        ? { kind: "bladeSection", model: bladeSectionLayout.name, value }
        : null;
    }

    const bladeStackLayout = bladeStackLayoutForDocument(document, prefix, index);
    if (bladeStackLayout) {
      return (bladeStackLayout.stacks ?? []).includes(value)
        ? { kind: "bladeStack", model: bladeStackLayout.name, value }
        : null;
    }

    const routeParameterRouteName = routeParameterContextRouteName(prefix);
    if (routeParameterRouteName) {
      const route = index.routes.find((candidate) => candidate.name === routeParameterRouteName);
      return routeParameters(route).includes(value)
        ? { kind: "routeParameter", model: routeParameterRouteName, value }
        : null;
    }

    const kind = referenceKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }

  return null;
}

function eloquentMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const modelName = eloquentScopeModel(line.slice(0, token.start));
  const model = modelName ? findModel(index, modelName) : null;
  if (!model) {
    return null;
  }

  if (model.scopes.includes(token.value)) {
    return { kind: "scope", model: model.className, value: token.value };
  }

  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  return builderMethod && model.customBuilder
    ? {
        builderClassName: model.customBuilder.className,
        kind: "builderMethod",
        model: model.className,
        value: builderMethod.name,
      }
    : null;
}

function factoryStateContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): ReferenceTarget | null {
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
    (factory) =>
      factory.states.includes(token.value) &&
      (factory.model === modelName || factory.model?.split("\\").at(-1) === modelName),
  );

  return factory ? { kind: "factoryState", model: modelName, value: token.value } : null;
}

function referenceKindForPrefix(prefix: string): ReferenceStringKind | null {
  if (isRouteNamePrefix(prefix)) {
    return "route";
  }

  if (
    /\bview\s*\(\s*$/.test(prefix) ||
    /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)
  ) {
    return "view";
  }

  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }

  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }

  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
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

  if (
    /(?:Route::)?middleware\s*\(\s*(?:\[\s*)?$/.test(prefix) ||
    /->middleware\s*\(\s*(?:\[\s*)?$/.test(prefix) ||
    /(?:Route::)?withoutMiddleware\s*\(\s*(?:\[\s*)?$/.test(prefix) ||
    /->withoutMiddleware\s*\(\s*(?:\[\s*)?$/.test(prefix)
  ) {
    return "middleware";
  }

  return null;
}

function isRouteNamePrefix(prefix: string): boolean {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) ||
    /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) ||
    /->routeIs\s*\(\s*$/.test(prefix);
}

function isValidationFieldPrefix(prefix: string): boolean {
  return /->(validated|input)\s*\(\s*$/.test(prefix) ||
    /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) ||
    /->(only|except)\s*\(\s*\[\s*$/.test(prefix);
}

async function referenceSources(document: TextDocument, index: LaravelIndex): Promise<ReferenceSource[]> {
  const documentPath = pathFromUri(document.uri);
  const filePaths = new Set<string>();
  if (documentPath) {
    filePaths.add(documentPath);
  }
  for (const filePath of indexedFilePaths(index)) {
    filePaths.add(filePath);
  }

  const sources: ReferenceSource[] = [];
  for (const filePath of filePaths) {
    if (documentPath && filePath === documentPath) {
      sources.push({ filePath, source: document.getText() });
      continue;
    }

    const source = await readFileSafely(filePath);
    if (source !== null) {
      sources.push({ filePath, source });
    }
  }

  return sources;
}

function indexedFilePaths(index: LaravelIndex): Set<string> {
  const filePaths = new Set<string>();
  const add = (filePath: string | null | undefined) => {
    if (filePath) {
      filePaths.add(filePath);
    }
  };

  index.authorization.forEach((entry) => add(entry.filePath));
  index.bladeComponents.forEach((component) => add(component.filePath));
  index.bladeViews.forEach((view) => add(view.filePath));
  index.commands.forEach((command) => add(command.filePath));
  index.configEntries.forEach((entry) => add(entry.filePath));
  index.containerBindings.forEach((binding) => add(binding.filePath));
  index.controllers.forEach((controller) => add(controller.filePath));
  index.envEntries.forEach((entry) => add(entry.filePath));
  index.artifacts.forEach((artifact) => add(artifact.filePath));
  index.factories.forEach((factory) => add(factory.filePath));
  index.facades.forEach((facade) => add(facade.filePath));
  index.macros.forEach((macro) => add(macro.filePath));
  index.middleware.forEach((middleware) => add(middleware.filePath));
  index.models.forEach((model) => {
    add(model.filePath);
    add(model.customBuilder?.filePath);
  });
  index.providers.forEach((provider) => {
    add(provider.filePath);
    add(provider.classFilePath);
  });
  index.routes.forEach((route) => add(route.filePath));
  index.schemaTables.forEach((table) => {
    add(table.filePath);
    table.columns.forEach((column) => add(column.filePath));
  });
  index.seeders.forEach((seeder) => add(seeder.filePath));
  index.translationKeys.forEach((translation) => add(translation.filePath));
  index.validationRules.forEach((ruleSet) => add(ruleSet.filePath));

  return filePaths;
}

async function readFileSafely(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function referencesInSource(source: ReferenceSource, target: ReferenceTarget, index: LaravelIndex): Location[] {
  const references: Location[] = [];
  const lines = source.source.split(/\r?\n/);

  lines.forEach((line, lineNumber) => {
    if (target.kind === "route") {
      references.push(...routeReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "routeParameter") {
      references.push(...routeParameterReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "view") {
      references.push(...viewReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "bladeSection") {
      references.push(...bladeSectionReferencesInLine(source.filePath, line, lineNumber, target.model, target.value, index));
      return;
    }

    if (target.kind === "bladeStack") {
      references.push(...bladeStackReferencesInLine(source.filePath, line, lineNumber, target.model, target.value, index));
      return;
    }

    if (target.kind === "translation") {
      references.push(...translationReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "config") {
      references.push(...configReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "env") {
      references.push(...envReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "authorization") {
      references.push(...authorizationReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "container") {
      references.push(...containerReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "command") {
      references.push(...commandReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "middleware") {
      references.push(...middlewareReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "validationField") {
      references.push(...validationFieldReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }

    if (target.kind === "facadeClass") {
      references.push(...facadeClassReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }

    if (target.kind === "artifactClass") {
      references.push(...artifactClassReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }

    if (target.kind === "macroMethod") {
      references.push(...macroMethodReferencesInLine(source.filePath, source.source, line, lineNumber, target.className, target.value));
      return;
    }

    if (target.kind === "seeder") {
      references.push(...seederReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }

    if (target.kind === "serviceProvider") {
      references.push(...serviceProviderReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }

    if (target.kind === "controller") {
      references.push(...controllerReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }

    if (target.kind === "controllerAction") {
      references.push(...controllerActionReferencesInLine(source.filePath, source.source, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "factoryState") {
      references.push(...factoryStateReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "relation") {
      references.push(...relationReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "scope") {
      references.push(...scopeReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "builderMethod") {
      references.push(...scopeReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    if (target.kind === "modelAttribute") {
      references.push(...modelAttributeReferencesInLine(source.filePath, line, lineNumber, target));
      return;
    }

    if (target.kind === "componentProp") {
      references.push(...componentPropReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }

    references.push(...componentReferencesInLine(source.filePath, line, lineNumber, target.value));
  });

  return references;
}

function routeReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\b(?:route|to_route)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->route\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bRoute::(?:has|is)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->routeIs\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
  ];
}

function routeParameterReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  routeName: string,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    const matchedRouteName = routeParameterContextRouteName(line.slice(0, stringRange.start - 1));
    if (matchedRouteName !== routeName || line.slice(stringRange.start, stringRange.end) !== value) {
      continue;
    }

    references.push(location(filePath, lineNumber, stringRange.start, value.length));
  }

  return references;
}

function viewReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bview\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*(['"])([^'"]+)\2/g,
      3,
      value,
    ),
  ];
}

function bladeSectionReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  layoutName: string,
  value: string,
  index: LaravelIndex,
): Location[] {
  const view = index.bladeViews.find((view) => view.filePath === filePath);
  if (view?.extends !== layoutName) {
    return [];
  }

  return stringCallReferencesInLine(filePath, line, lineNumber, /@section\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}

function bladeStackReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  layoutName: string,
  value: string,
  index: LaravelIndex,
): Location[] {
  const view = index.bladeViews.find((view) => view.filePath === filePath);
  if (view?.extends !== layoutName) {
    return [];
  }

  return stringCallReferencesInLine(filePath, line, lineNumber, /@(push|prepend)\s*\(\s*(['"])([^'"]+)\2/g, 3, value);
}

function translationReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\b(__|trans|trans_choice)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /@(lang|choice)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
  ];
}

function configReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return stringCallReferencesInLine(filePath, line, lineNumber, /\bconfig\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}

function envReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return stringCallReferencesInLine(filePath, line, lineNumber, /\benv\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}

function authorizationReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(can|cannot|authorize)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bGate::(allows|denies|authorize|check|any|none)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /@(can|cannot|canany)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
  ];
}

function containerReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\b(app|resolve)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bApp::(make|bound|has)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
  ];
}

function commandReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bArtisan::(?:call|queue)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bSchedule::command\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->command\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
  ];
}

function middlewareReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:Route::)?middleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->middleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:Route::)?withoutMiddleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->withoutMiddleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
  ];
}

function validationFieldReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(?:validated|input)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->safe\(\)->(?:only|except)\s*\(\s*\[\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(?:only|except)\s*\(\s*\[\s*(['"])([^'"]+)\1/g, 2, value),
  ];
}

function factoryStateReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  model: string,
  value: string,
): Location[] {
  const references: Location[] = [];
  const escapedModel = escapeRegExp(model);
  const escapedValue = escapeRegExp(value);

  for (const pattern of [
    new RegExp(`\\b${escapedModel}::factory\\(\\)->(${escapedValue})\\s*\\(`, "g"),
    new RegExp(`\\b${escapedModel}::factory\\(\\)->[^;\\n]*->(${escapedValue})\\s*\\(`, "g"),
  ]) {
    for (const match of line.matchAll(pattern)) {
      const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
      references.push(location(filePath, lineNumber, start, match[1].length));
    }
  }

  return references;
}

function seederReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "seeder" }>,
): Location[] {
  const references: Location[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isSeederCallPrefix(line.slice(0, start)) || !seederReferenceMatches(target, resolvePhpClassReference(source, value))) {
      continue;
    }

    references.push(location(filePath, lineNumber, start, value.length));
  }

  return references;
}

function serviceProviderReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "serviceProvider" }>,
): Location[] {
  if (!isProviderRegistrationFile(filePath)) {
    return [];
  }

  const references: Location[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isProviderRegistrationPrefix(line.slice(0, start)) || !serviceProviderReferenceMatches(target, resolvePhpClassReference(source, value))) {
      continue;
    }

    references.push(location(filePath, lineNumber, start, value.length));
  }

  return references;
}

function controllerReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "controller" }>,
): Location[] {
  const references: Location[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isRouteControllerClassPrefix(line.slice(0, start)) || !controllerReferenceMatches(target, resolvePhpClassReference(source, value))) {
      continue;
    }

    references.push(location(filePath, lineNumber, start, value.length));
  }

  return references;
}

function controllerActionReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  model: string,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const stringRange of quotedStringRanges(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const controller = routeControllerActionClass(prefix) ?? routeControllerGroupActionClass(source, lineNumber, prefix);
    const resolvedController = controller ? resolvePhpClassReference(source, controller) : null;
    if (resolvedController !== model && resolvedController?.split("\\").at(-1) !== model) {
      continue;
    }
    if (line.slice(stringRange.start, stringRange.end) !== value) {
      continue;
    }

    references.push(location(filePath, lineNumber, stringRange.start, value.length));
  }

  return references;
}

function macroMethodReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  className: string,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const matchedClassName = match[1];
    const method = match[2];
    if (method !== value || !classNameMatches(className, resolvePhpClassReference(source, matchedClassName))) {
      continue;
    }

    const start = (match.index ?? 0) + match[0].lastIndexOf(method);
    references.push(location(filePath, lineNumber, start, method.length));
  }

  return references;
}

function artifactClassReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "artifactClass" }>,
): Location[] {
  const references: Location[] = [];

  for (const reference of classReferencesInLine(line)) {
    if (!artifactKindsForReference(line, reference) || !artifactReferenceMatches(target, resolvePhpClassReference(source, reference.value))) {
      continue;
    }

    references.push(location(filePath, lineNumber, reference.start, reference.value.length));
  }

  return references;
}

function facadeClassReferencesInLine(
  filePath: string,
  source: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "facadeClass" }>,
): Location[] {
  const references: Location[] = [];

  for (const reference of classReferencesInLine(line)) {
    if (
      !line.slice(reference.start + reference.value.length).startsWith("::") ||
      !facadeReferenceMatches(target, resolvePhpClassReference(source, reference.value))
    ) {
      continue;
    }

    references.push(location(filePath, lineNumber, reference.start, reference.value.length));
  }

  return references;
}

function relationReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  model: string,
  value: string,
): Location[] {
  const relationMethods =
    "(?:with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  const escapedModel = escapeRegExp(model);

  return [
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      new RegExp(`\\b${escapedModel}::${relationMethods}\\(\\s*(?:\\[\\s*)?(['"])([^'"]+)\\1`, "g"),
      2,
      value,
    ),
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      new RegExp(`\\b${escapedModel}::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?(['"])([^'"]+)\\1`, "g"),
      2,
      value,
    ),
  ];
}

function scopeReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  model: string,
  value: string,
): Location[] {
  const references: Location[] = [];
  const escapedModel = escapeRegExp(model);

  for (const pattern of [
    new RegExp(`\\b${escapedModel}::(?:query\\(\\)->)?(${escapeRegExp(value)})\\s*\\(`, "g"),
    new RegExp(`\\b${escapedModel}::[^;\\n]*->(${escapeRegExp(value)})\\s*\\(`, "g"),
  ]) {
    for (const match of line.matchAll(pattern)) {
      const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
      references.push(location(filePath, lineNumber, start, match[1].length));
    }
  }

  return references;
}

function modelAttributeReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  target: Extract<ReferenceTarget, { kind: "modelAttribute" }>,
): Location[] {
  if (!target.modelFilePaths.includes(filePath)) {
    return [];
  }

  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[/.test(line);
  if (!propertyStart && !line.includes(target.value)) {
    return [];
  }

  return quotedStringRanges(line)
    .filter((range) => line.slice(range.start, range.end) === target.value)
    .map((range) => location(filePath, lineNumber, range.start, target.value.length));
}

function stringCallReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  pattern: RegExp,
  valueGroup: number,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const match of line.matchAll(pattern)) {
    const matchedValue = match[valueGroup];
    if (matchedValue !== value) {
      continue;
    }

    const start = (match.index ?? 0) + match[0].lastIndexOf(matchedValue);
    references.push(location(filePath, lineNumber, start, matchedValue.length));
  }

  return references;
}

function componentReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot") || normalizeComponentName(rawName) !== value) {
      continue;
    }

    const start = (match.index ?? 0) + 3;
    references.push(location(filePath, lineNumber, start, rawName.length));
  }

  return references;
}

function componentPropReferencesInLine(
  filePath: string,
  line: string,
  lineNumber: number,
  componentName: string,
  value: string,
): Location[] {
  const references: Location[] = [];

  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot") || normalizeComponentName(rawName) !== componentName) {
      continue;
    }

    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      if (prop !== value) {
        continue;
      }

      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      references.push(location(filePath, lineNumber, start, prop.length));
    }
  }

  return references;
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

function location(filePath: string, line: number, character: number, length: number): Location {
  return Location.create(pathToFileURL(filePath).toString(), range(line, character, length));
}

function range(line: number, character: number, length: number): Range {
  return {
    end: {
      character: character + length,
      line,
    },
    start: {
      character,
      line,
    },
  };
}

function normalizeComponentName(name: string): string {
  return name.replace(/:/g, ".");
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
  return classReferencesInLine(line).find((reference) =>
    character >= reference.start && character <= reference.start + reference.value.length
  ) ?? null;
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

function classReferencesInLine(line: string): Array<{ start: number; value: string }> {
  const references: Array<{ start: number; value: string }> = [];

  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    references.push({
      start: match.index ?? 0,
      value: match[1],
    });
  }

  return references;
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
    return ["job"];
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

function seederReferenceMatches(target: Extract<ReferenceTarget, { kind: "seeder" }>, value: string): boolean {
  return target.className === value ||
    target.className === value.split("\\").at(-1) ||
    (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}

function serviceProviderMatches(provider: LaravelIndex["providers"][number], value: string): boolean {
  return provider.className === value ||
    provider.className === value.split("\\").at(-1) ||
    (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}

function serviceProviderReferenceMatches(target: Extract<ReferenceTarget, { kind: "serviceProvider" }>, value: string): boolean {
  return target.className === value ||
    target.className === value.split("\\").at(-1) ||
    (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}

function controllerMatches(controller: LaravelIndex["controllers"][number], value: string): boolean {
  return controller.className === value ||
    controller.className === value.split("\\").at(-1) ||
    (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}

function controllerReferenceMatches(target: Extract<ReferenceTarget, { kind: "controller" }>, value: string): boolean {
  return target.className === value ||
    target.className === value.split("\\").at(-1) ||
    (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
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

function artifactReferenceMatches(target: Extract<ReferenceTarget, { kind: "artifactClass" }>, value: string): boolean {
  return target.className === value ||
    target.className === value.split("\\").at(-1) ||
    (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}

function facadeMatches(facade: LaravelIndex["facades"][number], value: string): boolean {
  return facade.className === value ||
    facade.className === value.split("\\").at(-1) ||
    (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}

function facadeReferenceMatches(target: Extract<ReferenceTarget, { kind: "facadeClass" }>, value: string): boolean {
  return target.className === value ||
    target.className === value.split("\\").at(-1) ||
    (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
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

function modelAttributeTargetAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
  value: string,
): Extract<ReferenceTarget, { kind: "modelAttribute" }> | null {
  const documentPath = pathFromUri(document.uri);
  const tableName = index.models.find((model) => model.filePath === documentPath)?.tableName;
  if (!tableName) {
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

  return {
    kind: "modelAttribute",
    modelFilePaths: index.models.filter((model) => model.tableName === tableName).map((model) => model.filePath),
    tableName,
    value,
  };
}

function validationFieldTargetAtPosition(
  document: TextDocument,
  index: LaravelIndex,
  value: string,
): { kind: "validationField"; value: string } | null {
  const ruleSets = validationRuleSetsForDocument(document, index);
  if (!ruleSets.some((ruleSet) => ruleSet.fields.some((field) => field.field === value))) {
    return null;
  }

  return {
    kind: "validationField",
    value,
  };
}

function bladeSectionLayoutForDocument(
  document: TextDocument,
  prefix: string,
  index: LaravelIndex,
): LaravelIndex["bladeViews"][number] | null {
  if (!/@section\s*\(\s*$/.test(prefix)) {
    return null;
  }

  const documentPath = pathFromUri(document.uri);
  const view = documentPath ? index.bladeViews.find((view) => view.filePath === documentPath) : null;
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

  const documentPath = pathFromUri(document.uri);
  const view = documentPath ? index.bladeViews.find((view) => view.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }

  const layout = index.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}

function validationRuleSetsForDocument(
  document: TextDocument,
  index: LaravelIndex,
): LaravelIndex["validationRules"] {
  const documentPath = pathFromUri(document.uri);
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

function findModel(index: LaravelIndex, modelName: string): LaravelIndex["models"][number] | null {
  return index.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName,
  ) ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function uniqueLocations(locations: Location[]): Location[] {
  const seen = new Set<string>();
  const unique: Location[] = [];

  for (const item of locations) {
    const key = [
      item.uri,
      item.range.start.line,
      item.range.start.character,
      item.range.end.line,
      item.range.end.character,
    ].join(":");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }

  return unique;
}
