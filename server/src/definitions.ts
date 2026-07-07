import { Location, Position, Range } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { frameworkBuilderMethodTargetForPrefix, instanceMemberTargetForPrefix, instanceModelForPrefix } from "./instanceTypes.js";
import { LaravelIndex, SourceRange } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

export function definitionsForDocument(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): Location[] {
  const componentProp = componentPropContextAtPosition(document, position);
  if (componentProp) {
    return index.bladeComponents
      .filter((candidate) => candidate.name === componentProp.componentName && candidate.props.includes(componentProp.prop))
      .map((candidate) => Location.create(pathToFileURL(candidate.filePath).toString(), startRange()));
  }

  const component = componentContextAtPosition(document, position);
  if (component) {
    return index.bladeComponents
      .filter((candidate) => candidate.name === component.value)
      .map((candidate) => Location.create(pathToFileURL(candidate.filePath).toString(), startRange()));
  }

  const livewireComponent = livewireComponentTagContextAtPosition(document, position);
  if (livewireComponent) {
    return index.livewireComponents
      .filter((candidate) => candidate.name === livewireComponent.value)
      .map((candidate) => Location.create(pathToFileURL(candidate.filePath).toString(), startRange()));
  }

  const provider = serviceProviderContextAtPosition(document, position, index);
  if (provider?.classFilePath) {
    return [Location.create(pathToFileURL(provider.classFilePath).toString(), startRange())];
  }

  const controllerStringTargets = routeControllerStringTargetsAtPosition(document, position, index);
  if (controllerStringTargets) {
    return controllerStringTargets;
  }

  const controllerAction = routeControllerActionContextAtPosition(document, position, index);
  if (controllerAction) {
    return [Location.create(pathToFileURL(controllerAction.controller.filePath).toString(), controllerActionRange(controllerAction.controller, controllerAction.action))];
  }

  const controller = routeControllerClassContextAtPosition(document, position, index);
  if (controller) {
    return [Location.create(pathToFileURL(controller.filePath).toString(), startRange())];
  }

  const facade = facadeStaticCallContextAtPosition(document, position, index);
  if (facade) {
    return [Location.create(pathToFileURL(facade.filePath).toString(), startRange())];
  }

  const containerConcrete = containerConcreteClassContextAtPosition(document, position, index);
  if (containerConcrete) {
    return [Location.create(pathToFileURL(containerConcrete.filePath).toString(), startRange())];
  }

  const artifact = artifactClassContextAtPosition(document, position, index);
  if (artifact) {
    return [Location.create(pathToFileURL(artifact.filePath).toString(), startRange())];
  }

  const macroMethod = macroMethodContextAtPosition(document, position, index);
  if (macroMethod) {
    return [Location.create(pathToFileURL(macroMethod.filePath).toString(), startRange())];
  }

  const seeder = seederClassContextAtPosition(document, position, index);
  if (seeder) {
    return [Location.create(pathToFileURL(seeder.filePath).toString(), startRange())];
  }

  const factoryState = factoryStateContextAtPosition(document, position, index);
  if (factoryState) {
    return [Location.create(pathToFileURL(factoryState.filePath).toString(), startRange())];
  }

  const applicationMethod = applicationMethodContextAtPosition(document, position);
  if (applicationMethod) {
    return [
      Location.create(
        pathToFileURL(applicationMethod.filePath).toString(),
        applicationMethod.range ? { end: applicationMethod.range.end, start: applicationMethod.range.start } : startRange(),
      ),
    ];
  }

  const eloquentMethod = eloquentMethodContextAtPosition(document, position, index);
  if (eloquentMethod) {
    return [
      Location.create(
        pathToFileURL(eloquentMethod.filePath).toString(),
        eloquentMethod.range ? { end: eloquentMethod.range.end, start: eloquentMethod.range.start } : startRange(),
      ),
    ];
  }

  const modelProperty = modelPropertyContextAtPosition(document, position, index);
  if (modelProperty) {
    return [
      Location.create(
        pathToFileURL(modelProperty.filePath).toString(),
        modelProperty.range ? { end: modelProperty.range.end, start: modelProperty.range.start } : startRange(),
      ),
    ];
  }

  const instanceMember = instanceMemberContextAtPosition(document, position, index);
  if (instanceMember) {
    return [
      Location.create(
        pathToFileURL(instanceMember.filePath).toString(),
        instanceMember.range ? { end: instanceMember.range.end, start: instanceMember.range.start } : startRange(),
      ),
    ];
  }

  const context = stringContextAtPosition(document, position, index);
  if (!context) {
    return [];
  }

  if (context.kind === "route") {
    return index.routes
      .filter((route) => route.name === context.value)
      .map((route) =>
        Location.create(pathToFileURL(route.filePath).toString(), {
          end: route.range.end,
          start: route.range.start,
        }),
      );
  }

  if (context.kind === "routeParameter") {
    return index.routes
      .filter((route) => route.name === context.model && routeParameters(route).includes(context.value))
      .map((route) =>
        Location.create(pathToFileURL(route.filePath).toString(), {
          end: route.range.end,
          start: route.range.start,
        }),
      );
  }

  if (context.kind === "view") {
    return index.bladeViews
      .filter((view) => view.name === context.value)
      .map((view) => Location.create(pathToFileURL(view.filePath).toString(), startRange()));
  }

  if (context.kind === "inertiaPage") {
    return index.inertiaPages
      .filter((page) => page.name === context.value)
      .map((page) => Location.create(pathToFileURL(page.filePath).toString(), startRange()));
  }

  if (context.kind === "livewireComponent") {
    return index.livewireComponents
      .filter((component) => component.name === context.value)
      .map((component) => Location.create(pathToFileURL(component.filePath).toString(), startRange()));
  }

  if (context.kind === "livewireBinding") {
    const component = livewireComponentForDocument(document, index);
    return component && (component.methods.includes(context.value) || component.properties.includes(context.value))
      ? [Location.create(pathToFileURL(component.filePath).toString(), startRange())]
      : [];
  }

  if (context.kind === "bladeSection") {
    return index.bladeViews
      .filter((view) => view.name === context.model && view.yields.includes(context.value))
      .map((view) => Location.create(pathToFileURL(view.filePath).toString(), startRange()));
  }

  if (context.kind === "bladeStack") {
    return index.bladeViews
      .filter((view) => view.name === context.model && (view.stacks ?? []).includes(context.value))
      .map((view) => Location.create(pathToFileURL(view.filePath).toString(), startRange()));
  }

  if (context.kind === "translation") {
    return index.translationKeys
      .filter((translation) => translation.key === context.value)
      .map((translation) => Location.create(pathToFileURL(translation.filePath).toString(), startRange()));
  }

  if (context.kind === "config") {
    return index.configEntries
      .filter((entry) => entry.key === context.value)
      .map((entry) => Location.create(pathToFileURL(entry.filePath).toString(), {
        end: entry.range.end,
        start: entry.range.start,
      }));
  }

  if (context.kind === "env") {
    return index.envEntries
      .filter((entry) => entry.key === context.value)
      .map((entry) => Location.create(pathToFileURL(entry.filePath).toString(), {
        end: entry.range.end,
        start: entry.range.start,
      }));
  }

  if (context.kind === "authorization") {
    return index.authorization
      .filter((entry) => entry.ability === context.value)
      .map((entry) => Location.create(pathToFileURL(entry.filePath).toString(), startRange()));
  }

  if (context.kind === "container") {
    return index.containerBindings
      .filter((binding) => binding.abstract === context.value)
      .map((binding) => Location.create(pathToFileURL(binding.filePath).toString(), startRange()));
  }

  if (context.kind === "command") {
    return index.commands
      .filter((command) => command.name === context.value)
      .map((command) => Location.create(pathToFileURL(command.filePath).toString(), startRange()));
  }

  if (context.kind === "middleware") {
    // `auth:api` and `cp-grade:professional` carry parameters after the colon;
    // the registered alias is only the part before it.
    const alias = context.value.split(":")[0];
    return index.middleware
      .filter((middleware) => middleware.alias === alias)
      .map((middleware) =>
        Location.create(pathToFileURL(middleware.filePath).toString(), {
          end: middleware.range.end,
          start: middleware.range.start,
        }),
      );
  }

  if (context.kind === "relation") {
    return index.models
      .filter((model) => model.className === context.model || `${model.namespace}\\${model.className}` === context.model)
      .filter((model) => model.relations.some((relation) => relation.name === context.value))
      .map((model) => Location.create(pathToFileURL(model.filePath).toString(), startRange()));
  }

  if (context.kind === "modelAttribute") {
    return modelAttributeLocations(context, index);
  }

  if (context.kind === "schemaTable") {
    return schemaTableLocations(context.value, index);
  }

  if (context.kind === "schemaColumn") {
    return schemaColumnLocations(context, index);
  }

  if (context.kind === "validationField") {
    return validationFieldLocations(document, context.value, index);
  }

  return [];
}

type DefinitionStringContext =
  | {
  kind: "authorization" | "command" | "config" | "container" | "env" | "inertiaPage" | "livewireComponent" | "middleware" | "route" | "translation" | "validationField" | "view";
  value: string;
}
  | {
      kind: "livewireBinding";
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
type DefinitionSimpleKind = Extract<
  DefinitionStringContext,
  { kind: "authorization" | "command" | "config" | "container" | "env" | "inertiaPage" | "livewireComponent" | "middleware" | "route" | "translation" | "validationField" | "view" }
>["kind"];

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

function livewireComponentForDocument(
  document: TextDocument,
  index: LaravelIndex,
): LaravelIndex["livewireComponents"][number] | null {
  const documentPath = documentPathFromUri(document.uri);
  const match = documentPath
    ? /[/\\]resources[/\\]views[/\\]livewire[/\\](.+)\.blade\.php$/.exec(documentPath)
    : null;
  if (!match) {
    return null;
  }

  const name = match[1].split(/[/\\]/).join(".");
  return index.livewireComponents.find((component) => component.name === name) ?? null;
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
): { filePath: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isSeederCallPrefix(line.slice(0, reference.start))) {
    return null;
  }

  const seeder = index.seeders.find((candidate) => seederMatches(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder ? { filePath: seeder.filePath } : null;
}

function macroMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string } | null {
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
  return macro ? { filePath: macro.filePath } : null;
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

// Handles the legacy string route action syntax `'WorkspaceController@store'`:
// the class part navigates to the controller file, the method part navigates
// to the action inside it.
function routeControllerStringTargetsAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): Location[] | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token || !token.value.includes("@")) {
    return null;
  }

  const prefix = line.slice(0, token.start - 1);
  if (!isRouteActionStringPrefix(prefix)) {
    return null;
  }

  const [classReference, action] = token.value.split("@");
  const controllers = index.controllers.filter((controller) =>
    controllerReferenceMatches(controller, classReference),
  );
  if (controllers.length === 0) {
    return null;
  }

  const cursorInAction = Boolean(action) && position.character > token.start + classReference.length;
  if (cursorInAction) {
    const withAction = controllers.filter((controller) => controller.actions.includes(action));
    const targets = withAction.length > 0 ? withAction : controllers;
    return targets.map((controller) =>
      Location.create(pathToFileURL(controller.filePath).toString(), controllerActionRange(controller, action)),
    );
  }

  return controllers.map((controller) =>
    Location.create(pathToFileURL(controller.filePath).toString(), startRange()),
  );
}

function isRouteActionStringPrefix(prefix: string): boolean {
  return /(?:Route::|\$router->)(?:get|post|put|patch|delete|options|any|match|fallback)\s*\([^;\n]*,\s*$/.test(prefix) ||
    /['"](?:uses|controller)['"]\s*=>\s*$/.test(prefix);
}

// Route action strings resolve relative to a group namespace the indexer does
// not track, so match on trailing namespace segments instead.
function controllerReferenceMatches(
  controller: LaravelIndex["controllers"][number],
  reference: string,
): boolean {
  const normalized = reference.replace(/\\\\/g, "\\").replace(/^\\+/, "");
  if (!normalized) {
    return false;
  }

  const fullClassName = controller.namespace
    ? `${controller.namespace}\\${controller.className}`
    : controller.className;
  return fullClassName === normalized || fullClassName.endsWith(`\\${normalized}`);
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
): { filePath: string } | null {
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
  return artifact ? { filePath: artifact.filePath } : null;
}

function facadeStaticCallContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }

  const facade = index.facades.find((candidate) =>
    facadeMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade ? { filePath: facade.filePath } : null;
}

function containerConcreteClassContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !isPhpParameterTypeHint(line, reference)) {
    return null;
  }

  const resolvedReference = resolvePhpClassReference(document.getText(), reference.value);
  const binding = index.containerBindings.find((candidate) =>
    containerAbstractMatchesClass(candidate.abstract, resolvedReference)
  );
  if (!binding?.concrete) {
    return null;
  }

  return indexedClassTarget(binding.concrete, index);
}

function stringContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): DefinitionStringContext | null {
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

    if (/\bwire:[a-zA-Z0-9.-]+\s*=\s*$/.test(prefix)) {
      return { kind: "livewireBinding", value };
    }

    const kind = definitionKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }

  return null;
}

function eloquentMethodContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string; range?: SourceRange } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  const modelName = eloquentScopeModel(line.slice(0, token.start));
  if (!modelName) {
    const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index, token.value);
    return frameworkMethod ? { filePath: frameworkMethod.filePath, ...(frameworkMethod.range ? { range: frameworkMethod.range } : {}) } : null;
  }

  const resolvedModelName = resolvePhpClassReference(document.getText(), modelName);
  const model = index.models.find(
    (candidate) => candidate.className === resolvedModelName || `${candidate.namespace}\\${candidate.className}` === resolvedModelName,
  );
  if (!model) {
    return null;
  }

  if (model.scopes.includes(token.value)) {
    const traitScope = model.scopeDetails?.find((detail) => detail.name === token.value);
    if (traitScope) {
      return { filePath: traitScope.filePath };
    }

    const scopeMethod = model.methodDetails?.find(
      (method) => method.name === token.value || method.name === `scope${token.value[0].toUpperCase()}${token.value.slice(1)}`,
    );
    return { filePath: model.filePath, ...(scopeMethod ? { range: scopeMethod.range } : {}) };
  }

  if (model.staticMethods?.includes(token.value)) {
    const staticMethod = model.methodDetails?.find((method) => method.name === token.value);
    return { filePath: model.filePath, ...(staticMethod ? { range: staticMethod.range } : {}) };
  }

  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  if (builderMethod && model.customBuilder?.filePath) {
    return { filePath: model.customBuilder.filePath };
  }

  const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index, token.value);
  return frameworkMethod ? { filePath: frameworkMethod.filePath, ...(frameworkMethod.range ? { range: frameworkMethod.range } : {}) } : null;
}

function applicationMethodContextAtPosition(
  document: TextDocument,
  position: Position,
): { filePath: string; range?: SourceRange } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  if (!/\bapp\s*\(\s*\)\s*(?:->|\?->)\s*$/.test(line.slice(0, token.start))) {
    return null;
  }

  const documentPath = documentPathFromUri(document.uri);
  const rootPath = documentPath ? projectRootForDocumentPath(documentPath) : null;
  if (!rootPath) {
    return null;
  }

  const filePath = path.join(rootPath, "vendor", "laravel", "framework", "src", "Illuminate", "Foundation", "Application.php");
  const range = methodRangeInFile(filePath, token.value);
  if (range) {
    return { filePath, range };
  }

  return knownApplicationMethods().has(token.value) ? { filePath } : null;
}

// Resolves `$user->roles()` style member access when the receiver can be
// traced to an Eloquent model (auth-user expressions, auth-user assignments,
// or `@var` docblocks) and jumps to the member's declaration.
function instanceMemberContextAtPosition(
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

function modelPropertyContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string; range?: SourceRange } | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  const beforeToken = line.slice(0, token.start);
  if (!/(\?->|->)\s*$/.test(beforeToken)) {
    return null;
  }

  const model = modelForPropertyAccess(document, position, token.start, index);
  return model ? modelPropertyTarget(model, token.value, index) : null;
}

function modelForPropertyAccess(
  document: TextDocument,
  position: Position,
  tokenStart: number,
  index: LaravelIndex,
): LaravelIndex["models"][number] | null {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const beforeToken = line.slice(0, tokenStart);
  const chain = propertyAccessChainBeforeToken(beforeToken);
  if (!chain) {
    return null;
  }

  if (chain.root === "$this") {
    const documentPath = documentPathFromUri(document.uri);
    const model = documentPath ? (index.models.find((candidate) => candidate.filePath === documentPath) ?? null) : null;
    return model ? resolvePropertyChainModel(model, chain.properties, document.getText(), index) : null;
  }

  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: tokenStart }));
  const rootPrefix = prefix.slice(0, prefix.lastIndexOf(chain.properties[0] ?? ""));
  const inferredModel = instanceModelForPrefix(document.getText(), rootPrefix, index);
  if (inferredModel) {
    return resolvePropertyChainModel(inferredModel, chain.properties, document.getText(), index);
  }

  const className = chain.root.startsWith("$") ? modelClassForVariable(document.getText(), chain.root) : null;
  const resolved = className ? resolvePhpClassReference(document.getText(), className) : null;
  const model = resolved
    ? index.models.find((candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved) ?? null
    : null;
  return model ? resolvePropertyChainModel(model, chain.properties, document.getText(), index) : null;
}

function propertyAccessChainBeforeToken(prefix: string): { properties: string[]; root: string } | null {
  const match = /(\$this|\$[A-Za-z_][A-Za-z0-9_]*)((?:\s*(?:\?->|->)\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*(?:\?->|->)\s*$/.exec(prefix);
  if (!match) {
    return null;
  }

  const root = match[1];
  const properties = [...match[2].matchAll(/(?:\?->|->)\s*([A-Za-z_][A-Za-z0-9_]*)/g)].map((property) => property[1]);
  return { properties, root };
}

function resolvePropertyChainModel(
  model: LaravelIndex["models"][number],
  properties: string[],
  documentText: string,
  index: LaravelIndex,
): LaravelIndex["models"][number] | null {
  let current: LaravelIndex["models"][number] | null = model;

  for (const property of properties) {
    const relation = current?.relations.find((candidate) => candidate.name === property);
    if (!relation?.relatedModel) {
      return null;
    }

    const resolved = resolvePhpClassReference(documentText, relation.relatedModel);
    current = index.models.find((candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved) ?? null;
    if (!current) {
      return null;
    }
  }

  return current;
}

function modelPropertyTarget(
  model: LaravelIndex["models"][number],
  property: string,
  index: LaravelIndex,
): { filePath: string; range?: SourceRange } | null {
  const relation = model.relations.find((candidate) => candidate.name === property || `${candidate.name}_count` === property);
  if (relation) {
    const method = model.methodDetails?.find((candidate) => candidate.name === relation.name);
    return { filePath: model.filePath, ...(method ? { range: method.range } : {}) };
  }

  const accessor = model.accessorDetails?.find((candidate) => candidate.name === property);
  if (accessor) {
    return { filePath: model.filePath, ...(accessor.range ? { range: accessor.range } : {}) };
  }

  if (model.appends?.includes(property)) {
    return { filePath: model.filePath };
  }

  const table = index.schemaTables.find((candidate) => candidate.name === model.tableName);
  const column = table?.columns.find((candidate) => candidate.name === property);
  if (column) {
    return { filePath: column.filePath };
  }

  return model.fillable.includes(property) || model.guarded.includes(property) || model.casts.includes(property)
    ? { filePath: model.filePath }
    : null;
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

function factoryStateContextAtPosition(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): { filePath: string } | null {
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

  return factory ? { filePath: factory.filePath } : null;
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

function containerAbstractMatchesClass(abstract: string, value: string): boolean {
  if (!isClassLikeReference(abstract)) {
    return false;
  }

  return classReferenceMatches(abstract, value);
}

function indexedClassTarget(
  classReference: string,
  index: LaravelIndex,
): { filePath: string } | null {
  const candidates = [
    ...index.models,
    ...index.controllers,
    ...index.artifacts,
    ...index.livewireComponents,
  ];

  return candidates.find((candidate) =>
    classReferenceMatches(indexedClassReference(candidate), classReference)
  ) ?? null;
}

function indexedClassReference(candidate: {
  className: string;
  namespace: string | null;
}): string {
  return candidate.namespace ? `${candidate.namespace}\\${candidate.className}` : candidate.className;
}

function classReferenceMatches(indexedReference: string, value: string): boolean {
  const indexed = normalizeClassReference(indexedReference);
  const compared = normalizeClassReference(value);
  return indexed === compared ||
    indexed.split("\\").at(-1) === compared ||
    compared.split("\\").at(-1) === indexed;
}

function normalizeClassReference(value: string): string {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}

function knownApplicationMethods(): Set<string> {
  return new Set(["getFallbackLocale", "getLocale", "setLocale"]);
}

function isClassLikeReference(value: string): boolean {
  return /^[A-Z_\\][A-Za-z0-9_\\]*$/.test(value);
}

function isPhpParameterTypeHint(
  line: string,
  reference: { start: number; value: string },
): boolean {
  const prefix = line.slice(0, reference.start);
  const suffix = line.slice(reference.start + reference.value.length);
  return /(?:^|[(,|&])\s*(?:(?:public|protected|private|readonly|static)\s+)*\??\s*$/.test(prefix) &&
    /^\s+\$[A-Za-z_][A-Za-z0-9_]*/.test(suffix);
}

function artifactMatches(artifact: LaravelIndex["artifacts"][number], value: string): boolean {
  return artifact.className === value ||
    artifact.className === value.split("\\").at(-1) ||
    (artifact.namespace ? `${artifact.namespace}\\${artifact.className}` === value : false);
}

function facadeMatches(facade: LaravelIndex["facades"][number], value: string): boolean {
  return facade.className === value ||
    facade.className === value.split("\\").at(-1) ||
    (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}

function serviceProviderMatches(provider: LaravelIndex["providers"][number], value: string): boolean {
  return provider.className === value ||
    provider.className === value.split("\\").at(-1) ||
    (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}

function controllerMatches(controller: LaravelIndex["controllers"][number], value: string): boolean {
  return controller.className === value ||
    controller.className === value.split("\\").at(-1) ||
    (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}

function controllerActionRange(controller: LaravelIndex["controllers"][number], action: string): Range {
  return controller.actionDetails?.find((candidate) => candidate.name === action)?.range ?? startRange();
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

function modelAttributeLocations(
  context: Extract<DefinitionStringContext, { kind: "modelAttribute" }>,
  index: LaravelIndex,
): Location[] {
  const table = index.schemaTables.find((candidate) => candidate.name === context.tableName);
  const column = table?.columns.find((candidate) => candidate.name === context.value);
  return column ? [Location.create(pathToFileURL(column.filePath).toString(), startRange())] : [];
}

function schemaTableLocations(tableName: string, index: LaravelIndex): Location[] {
  const table = index.schemaTables.find((candidate) => candidate.name === tableName);
  return table ? [Location.create(pathToFileURL(table.filePath).toString(), startRange())] : [];
}

function schemaColumnLocations(
  context: Extract<DefinitionStringContext, { kind: "schemaColumn" }>,
  index: LaravelIndex,
): Location[] {
  const table = index.schemaTables.find((candidate) => candidate.name === context.tableName);
  const column = table?.columns.find((candidate) => candidate.name === context.value);
  return column ? [Location.create(pathToFileURL(column.filePath).toString(), startRange())] : [];
}

function validationFieldLocations(document: TextDocument, field: string, index: LaravelIndex): Location[] {
  return validationRuleSetsForDocument(document, index)
    .filter((ruleSet) => ruleSet.fields.some((candidate) => candidate.field === field))
    .map((ruleSet) => Location.create(pathToFileURL(ruleSet.filePath).toString(), startRange()));
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

function documentPathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function projectRootForDocumentPath(filePath: string): string | null {
  for (const marker of [
    `${path.sep}app${path.sep}`,
    `${path.sep}routes${path.sep}`,
    `${path.sep}config${path.sep}`,
    `${path.sep}database${path.sep}`,
    `${path.sep}resources${path.sep}`,
  ]) {
    const markerIndex = filePath.lastIndexOf(marker);
    if (markerIndex >= 0) {
      return filePath.slice(0, markerIndex) || path.sep;
    }
  }

  return null;
}

function methodRangeInFile(filePath: string, method: string): SourceRange | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const source = readFileSync(filePath, "utf8");
    const match = new RegExp(`\\bfunction\\s+&?${escapeRegExp(method)}\\s*\\(`).exec(source);
    if (!match) {
      return null;
    }

    const nameOffset = match.index + match[0].indexOf(method);
    return sourceRangeForOffset(source, nameOffset, method.length);
  } catch {
    return null;
  }
}

function sourceRangeForOffset(source: string, offset: number, length: number): SourceRange {
  const start = sourcePositionForOffset(source, offset);
  const end = sourcePositionForOffset(source, offset + length);
  return { end, start };
}

function sourcePositionForOffset(source: string, offset: number): SourceRange["start"] {
  const lines = source.slice(0, offset).split(/\r?\n/);
  return {
    character: lines.at(-1)?.length ?? 0,
    line: lines.length - 1,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function definitionKindForPrefix(prefix: string): DefinitionSimpleKind | null {
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

  if (/@livewire\s*\(\s*$/.test(prefix)) {
    return "livewireComponent";
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

const DB_COLUMN_ARGUMENT_METHODS =
  "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";

function validationSchemaContextForPrefix(
  prefix: string,
  value: string,
): Extract<DefinitionStringContext, { kind: "schemaColumn" | "schemaTable" }> | null {
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

function startRange(): Range {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 },
  };
}

// Matches the string position inside `middleware(...)` / `withoutMiddleware(...)`
// calls, including elements after the first in an inline array such as
// `->middleware(['auth:api', 'ensure-selfsignup-completed'])`.
function isMiddlewareStringPrefix(prefix: string): boolean {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}
