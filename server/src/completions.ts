import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { LaravelIndex, ModelInfo, PhpClassInfo, SchemaColumnInfo, ValidationFieldInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";
import { builderReceiverModel, builderVariableModel, resolveRelationPath } from "./instanceTypes.js";
import {
  containerResolvedMemberClass,
  containerResolvedPhpClasses,
  isContainerBindingStringPrefix,
  isContainerClassArgumentPrefix,
} from "./containerResolution.js";
import { phpunitMockMethodTargetsAtOffset } from "./phpunitMocks.js";

export function completionsForDocument(
  document: TextDocument,
  position: { line: number; character: number },
  index: LaravelIndex,
): CompletionItem[] {
  const line = document.getText({
    start: { line: position.line, character: 0 },
    end: position,
  });
  const offset = document.offsetAt(position);

  if (isInsideModelAttributeArray(document, position)) {
    return schemaColumnsForDocument(document, index).map((column) => ({
      label: column.name,
      kind: CompletionItemKind.Field,
      detail: schemaColumnDetail(column),
      data: { filePath: column.filePath, tableName: column.tableName },
    }));
  }

  const validationSchemaContext = validationSchemaContextForLine(line) ??
    validationRuleStringContext(document, position, line);
  if (validationSchemaContext?.kind === "table") {
    return schemaTableCompletionItems(index);
  }
  if (validationSchemaContext?.kind === "column") {
    return schemaColumnCompletionItems(index, validationSchemaContext.tableName);
  }
  if (validationSchemaContext?.kind === "rule") {
    return VALIDATION_RULE_NAMES.map((rule) => ({
      label: rule,
      kind: CompletionItemKind.Value,
      detail: "Laravel validation rule",
    }));
  }

  if (isInsideValidationFieldCall(line)) {
    return validationFieldsForDocument(document, index).map((field) => ({
      label: field.field,
      kind: CompletionItemKind.Field,
      detail: validationFieldDetail(field),
    }));
  }

  if (isInsideTranslationKeyString(line)) {
    return index.translationKeys.map((translation) => ({
      label: translation.key,
      kind: CompletionItemKind.Text,
      detail: translationDetail(translation.locale, translation.source),
      data: { filePath: translation.filePath, locale: translation.locale },
    }));
  }

  if (isInsideAuthorizationAbilityString(line)) {
    return index.authorization.map((entry) => ({
      label: entry.ability,
      kind: CompletionItemKind.Value,
      detail: authorizationDetail(entry),
      data: { filePath: entry.filePath, policy: entry.policy },
    }));
  }

  if (isContainerBindingStringPrefix(line)) {
    return index.containerBindings.map((binding) => ({
      label: binding.abstract,
      kind: CompletionItemKind.Interface,
      detail: containerBindingDetail(binding),
      data: { filePath: binding.filePath, concrete: binding.concrete },
    }));
  }

  const mockMethods = phpunitMockMethodTargetsAtOffset(document.getText(), offset, index);
  if (mockMethods.length > 0) {
    return mockMethods.map((target) => ({
      label: target.method.name,
      kind: CompletionItemKind.Method,
      detail: `PHPUnit mock method ${target.classFqcn}`,
      data: { filePath: target.filePath, range: target.method.range },
    }));
  }

  if (isInsideArtisanCommandString(line)) {
    return index.commands.map((command) => ({
      label: command.name,
      kind: CompletionItemKind.Function,
      detail: commandDetail(command),
      data: { filePath: command.filePath, signature: command.signature },
    }));
  }

  if (isInsideStorageDiskString(line)) {
    return storageDiskCompletionItems(index);
  }

  if (isInsideMiddlewareString(line)) {
    return index.middleware.map((entry) => ({
      label: entry.alias,
      kind: CompletionItemKind.Value,
      detail: middlewareDetail(entry),
      data: { filePath: entry.filePath, className: entry.className },
    }));
  }

  if (isInsideProviderClassArray(document, line)) {
    return index.providers
      .filter((provider) => provider.source === "class")
      .map((provider) => ({
        label: provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className,
        kind: CompletionItemKind.Class,
        detail: "Laravel service provider",
        data: { filePath: provider.classFilePath ?? provider.filePath, source: provider.source },
      }));
  }

  if (isContainerClassArgumentPrefix(line)) {
    return phpClassCompletionItems(index);
  }

  const propertyModel = modelPropertyContext(document, line, index);
  if (propertyModel) {
    return modelPropertyCompletions(propertyModel, index);
  }

  const resolvedPhpClass = containerResolvedMemberClass(document.getText().slice(0, offset), line, index);
  if (resolvedPhpClass) {
    return phpClassMethodCompletionItems(resolvedPhpClass, index);
  }

  const writeArrayModel = modelWriteArrayContext(document, position, offset, index);
  if (writeArrayModel) {
    return modelWritableColumnCompletions(writeArrayModel, index);
  }

  const relationModel = eloquentRelationContext(document, line, offset, index);
  if (relationModel) {
    const relationCompletions = relationModel.relations.map((relation) => ({
      label: relation.name,
      kind: CompletionItemKind.Property,
      detail: eloquentRelationDetail(relationModel, relation),
      data: { filePath: relationModel.filePath, model: relationModel.className, relation: relation.name },
    }));
    if (relationCompletions.length > 0) {
      return relationCompletions;
    }
  }

  const macroClass = macroStaticCallClass(line);
  if (macroClass) {
    const macroCompletions = index.macros
      .filter((macro) => macro.className.split("\\").at(-1) === macroClass || macro.className === macroClass)
      .map((macro) => ({
        label: macro.method,
        kind: CompletionItemKind.Method,
        detail: `Laravel macro ${macro.className}`,
        data: { filePath: macro.filePath, className: macro.className },
      }));
    if (macroCompletions.length > 0) {
      return macroCompletions;
    }
  }

  const factoryModel = factoryStateModel(line);
  if (factoryModel) {
    return index.factories
      .filter((factory) => factory.model?.split("\\").at(-1) === factoryModel || factory.model === factoryModel)
      .flatMap((factory) =>
        factory.states.map((state) => ({
          label: state,
          kind: CompletionItemKind.Method,
          detail: `Factory state ${factory.className}`,
          data: { filePath: factory.filePath, model: factory.model },
        })),
      );
  }

  const dbTableName = dbColumnContextTable(line);
  if (dbTableName) {
    return schemaColumnCompletionItems(index, dbTableName);
  }

  if (isInsideDbTableNameString(line)) {
    return schemaTableCompletionItems(index);
  }

  const columnReceiver = eloquentColumnReceiverPrefix(line);
  if (columnReceiver) {
    const model = builderReceiverModel(document.getText(), columnReceiver, offset, index);
    const table = model ? index.schemaTables.find((candidate) => candidate.name === model.tableName) : null;
    if (table) {
      return table.columns.map((column) => ({
        label: column.name,
        kind: CompletionItemKind.Field,
        detail: schemaColumnDetail(column),
        data: { filePath: column.filePath, tableName: column.tableName },
      }));
    }
  }

  const scopeModel = eloquentScopeModel(line) ?? eloquentBuilderChainModel(line);
  if (scopeModel) {
    const modelCompletions = index.models
      .filter((model) => model.className === scopeModel || `${model.namespace}\\${model.className}` === scopeModel)
      .flatMap((model) => builderChainCompletions(model, index));
    if (modelCompletions.length > 0) {
      return modelCompletions;
    }
  }

  if (isInsideSeederCallArray(line)) {
    return index.seeders.map((seeder) => ({
      label: seeder.namespace ? `${seeder.namespace}\\${seeder.className}` : seeder.className,
      kind: CompletionItemKind.Class,
      detail: seeder.calls.length > 0 ? `Seeder calls ${seeder.calls.join(", ")}` : "Laravel seeder",
      data: { filePath: seeder.filePath },
    }));
  }

  const controllerActionClass = routeControllerActionClass(line) ?? routeControllerGroupActionClass(document, position.line, line);
  if (controllerActionClass) {
    const resolvedControllerActionClass = resolvePhpClassReference(document.getText(), controllerActionClass);
    return index.controllers
      .filter((controller) => controllerMatches(controller, resolvedControllerActionClass))
      .flatMap((controller) =>
        controller.actions.map((action) => ({
          label: action,
          kind: CompletionItemKind.Method,
          detail: `Laravel controller action ${controller.className}`,
          data: { filePath: controller.filePath },
        })),
      );
  }

  if (isInsideRouteControllerClassContext(line)) {
    return index.controllers.map((controller) => ({
      label: controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className,
      kind: CompletionItemKind.Class,
      detail: "Laravel controller",
      data: { filePath: controller.filePath },
    }));
  }

  const artifactKinds = artifactContextKinds(line);
  if (artifactKinds) {
    return index.artifacts
      .filter((artifact) => artifactKinds.includes(artifact.kind))
      .map((artifact) => ({
        label: artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className,
        kind: CompletionItemKind.Class,
        detail: laravelArtifactDetail(artifact),
        data: { filePath: artifact.filePath, kind: artifact.kind },
      }));
  }

  if (isInsideBladeViewDirectiveString(line)) {
    return index.bladeViews.map((view) => ({
      label: view.name,
      kind: CompletionItemKind.File,
      detail: bladeViewDetail(view),
      data: { filePath: view.filePath },
    }));
  }

  const sectionLayout = bladeSectionLayoutForDocument(document, line, index);
  if (sectionLayout) {
    return sectionLayout.yields.map((section) => ({
      label: section,
      kind: CompletionItemKind.Property,
      detail: `Blade section ${sectionLayout.name}`,
      data: { filePath: sectionLayout.filePath, layout: sectionLayout.name },
    }));
  }

  const stackLayout = bladeStackLayoutForDocument(document, line, index);
  if (stackLayout) {
    return (stackLayout.stacks ?? []).map((stack) => ({
      label: stack,
      kind: CompletionItemKind.Property,
      detail: `Blade stack ${stackLayout.name}`,
      data: { filePath: stackLayout.filePath, layout: stackLayout.name },
    }));
  }

  const componentTag = bladeComponentTagContext(line);
  if (componentTag === "tag") {
    return index.bladeComponents.map((component) => ({
      label: component.name,
      kind: CompletionItemKind.Class,
      detail: bladeComponentDetail(component),
      data: { filePath: component.filePath, viewName: component.viewName },
    }));
  }

  if (componentTag?.kind === "props") {
    const component = index.bladeComponents.find((candidate) => candidate.name === componentTag.name);
    return (
      component?.props.map((prop) => ({
        label: prop,
        kind: CompletionItemKind.Property,
        detail: `Blade ${component.source} component prop ${component.name}`,
        data: { filePath: component.filePath, viewName: component.viewName },
      })) ?? []
    );
  }

  const livewireTag = livewireComponentTagContext(line);
  if (livewireTag === "tag" || /@livewire\s*\(\s*['"][^'"]*$/.test(line)) {
    return index.livewireComponents.map((component) => ({
      label: component.name,
      kind: CompletionItemKind.Class,
      detail: livewireComponentDetail(component),
      data: { filePath: component.filePath },
    }));
  }

  if (typeof livewireTag === "object" && livewireTag?.kind === "props") {
    const component = index.livewireComponents.find((candidate) => candidate.name === livewireTag.name);
    return (
      component?.properties.map((property) => ({
        label: livewireKebabCase(property),
        kind: CompletionItemKind.Property,
        detail: `Livewire property ${component.className}::$${property}`,
        data: { filePath: component.filePath },
      })) ?? []
    );
  }

  const wireBinding = livewireWireBindingContext(document, line, index);
  if (wireBinding?.kind === "properties") {
    return wireBinding.component.properties.map((property) => ({
      label: property,
      kind: CompletionItemKind.Property,
      detail: `Livewire property ${wireBinding.component.className}::$${property}`,
      data: { filePath: wireBinding.component.filePath },
    }));
  }
  if (wireBinding?.kind === "methods") {
    return wireBinding.component.methods.map((method) => ({
      label: method,
      kind: CompletionItemKind.Method,
      detail: `Livewire action ${wireBinding.component.className}::${method}()`,
      data: { filePath: wireBinding.component.filePath },
    }));
  }

  const routeParameterName = routeParameterCompletionRouteName(line);
  if (routeParameterName) {
    const route = index.routes.find((candidate) => candidate.name === routeParameterName);
    return routeParameters(route).map((parameter) => ({
      label: parameter,
      kind: CompletionItemKind.Field,
      detail: routeParameterDetail(route),
      data: { filePath: route?.filePath, route: route?.name, uri: route?.uri },
    }));
  }

  if (isInsideRouteNameString(line)) {
    return index.routes
      .filter((route) => route.name)
      .map((route) => ({
        label: route.name ?? "",
        kind: CompletionItemKind.Value,
        detail: routeDetail(route.methods, route.uri),
        data: { filePath: route.filePath, range: route.range },
      }));
  }

  if (isInsideInertiaPageString(line)) {
    return index.inertiaPages.map((page) => ({
      label: page.name,
      kind: CompletionItemKind.File,
      detail: "Inertia page",
      data: { filePath: page.filePath },
    }));
  }

  if (isInsideStringCall(line, "view")) {
    return index.bladeViews.map((view) => ({
      label: view.name,
      kind: CompletionItemKind.File,
      detail: bladeViewDetail(view),
      data: { filePath: view.filePath },
    }));
  }

  if (isInsideStringCall(line, "config")) {
    return index.configKeys.map((key) => ({
      label: key,
      kind: CompletionItemKind.Property,
      detail: "Laravel config key",
    }));
  }

  if (isInsideStringCall(line, "env")) {
    return index.envKeys.map((key) => ({
      label: key,
      kind: CompletionItemKind.Constant,
      detail: "Environment key",
    }));
  }

  if (/\b(new|extends|implements)\s+[A-Za-z_\\]*$/.test(line)) {
    return [
      ...index.models.map((model) => ({
        label: model.namespace ? `${model.namespace}\\${model.className}` : model.className,
        kind: CompletionItemKind.Class,
        detail: "Eloquent model",
        data: { filePath: model.filePath },
      })),
      ...index.facades.map((facade) => ({
        label: facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className,
        kind: CompletionItemKind.Class,
        detail: facadeDetail(facade),
        data: { filePath: facade.filePath, accessor: facade.accessor, binding: facade.binding?.abstract },
      })),
      ...index.controllers.map((controller) => ({
        label: controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className,
        kind: CompletionItemKind.Class,
        detail: "Laravel controller",
        data: { filePath: controller.filePath },
      })),
      ...index.artifacts.map((artifact) => ({
        label: artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className,
        kind: CompletionItemKind.Class,
        detail: laravelArtifactDetail(artifact),
        data: { filePath: artifact.filePath, kind: artifact.kind },
      })),
      ...index.providers
        .filter((provider) => provider.source === "class")
        .map((provider) => ({
          label: provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className,
          kind: CompletionItemKind.Class,
          detail: "Laravel service provider",
          data: { filePath: provider.classFilePath ?? provider.filePath, source: provider.source },
        })),
    ];
  }

  return helperCompletions();
}

function routeDetail(methods: string[], uri: string | null): string {
  return ["Laravel route", methods.join("|"), uri].filter(Boolean).join(" ");
}

function routeParameterDetail(route: LaravelIndex["routes"][number] | undefined): string {
  return ["Route parameter", route?.name, route?.uri].filter(Boolean).join(" ");
}

function routeParameters(route: LaravelIndex["routes"][number] | undefined): string[] {
  if (!route?.uri) {
    return [];
  }

  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}

function schemaColumnDetail(column: SchemaColumnInfo): string {
  return [column.tableName, column.type, column.modifiers.join(", ")]
    .filter(Boolean)
    .join(" ");
}

function validationFieldDetail(field: ValidationFieldInfo): string {
  return ["Validation field", field.rules.join("|")].filter(Boolean).join(" ");
}

function translationDetail(locale: string, source: string): string {
  return `Laravel translation ${locale} ${source}`;
}

function authorizationDetail(entry: LaravelIndex["authorization"][number]): string {
  return ["Laravel ability", entry.source, entry.policy].filter(Boolean).join(" ");
}

function containerBindingDetail(binding: LaravelIndex["containerBindings"][number]): string {
  return ["Container binding", binding.lifetime, binding.concrete].filter(Boolean).join(" ");
}

function phpClassCompletionItems(index: LaravelIndex): CompletionItem[] {
  return index.phpClasses.map((phpClass) => ({
    label: phpClass.fqcn,
    kind: phpClassCompletionKind(phpClass),
    detail: `PHP ${phpClass.kind}`,
    data: { filePath: phpClass.filePath, kind: phpClass.kind },
  }));
}

function phpClassMethodCompletionItems(
  classReference: string,
  index: LaravelIndex,
): CompletionItem[] {
  const items = new Map<string, CompletionItem>();
  const classes = containerResolvedPhpClasses(classReference, index);

  for (const phpClass of classes) {
    for (const method of phpClass.methods ?? []) {
      // Container-resolved instances are accessed from the outside, so only
      // public members are callable at these completion sites.
      if (method.visibility !== "public" || items.has(method.name)) {
        continue;
      }

      items.set(method.name, {
        label: method.name,
        kind: CompletionItemKind.Method,
        detail: `PHP ${phpClass.kind} ${phpClass.fqcn}`,
        data: { filePath: phpClass.filePath, range: method.range },
      });
    }
  }

  return [...items.values()];
}

function phpClassCompletionKind(phpClass: PhpClassInfo): CompletionItemKind {
  switch (phpClass.kind) {
    case "interface":
      return CompletionItemKind.Interface;
    case "trait":
      return CompletionItemKind.Module;
    case "enum":
      return CompletionItemKind.Enum;
    case "class":
      return CompletionItemKind.Class;
  }
}

function facadeDetail(facade: LaravelIndex["facades"][number]): string {
  return [
    "Laravel facade",
    facade.accessor,
    facade.binding ? `${facade.binding.lifetime} binding` : "",
    facade.binding?.concrete,
    facade.target,
  ].filter(Boolean).join(" ");
}

function commandDetail(command: LaravelIndex["commands"][number]): string {
  return ["Artisan command", command.signature, command.description].filter(Boolean).join(" ");
}

function middlewareDetail(entry: LaravelIndex["middleware"][number]): string {
  return ["Laravel middleware", entry.source, entry.className].filter(Boolean).join(" ");
}

function bladeViewDetail(view: LaravelIndex["bladeViews"][number]): string {
  return ["Laravel view", view.extends ? `extends ${view.extends}` : ""].filter(Boolean).join(" ");
}

function bladeComponentDetail(component: LaravelIndex["bladeComponents"][number]): string {
  return `Blade ${component.source} component`;
}

function eloquentRelationDetail(
  model: LaravelIndex["models"][number],
  relation: LaravelIndex["models"][number]["relations"][number],
): string {
  return [`Eloquent relation ${model.className}`, relation.type, relation.relatedModel].filter(Boolean).join(" ");
}

function customBuilderMethodCompletions(model: LaravelIndex["models"][number]): CompletionItem[] {
  return model.customBuilder?.methods.map((method) => ({
    label: method.name,
    kind: CompletionItemKind.Method,
    detail: `Custom Eloquent builder ${model.customBuilder?.className}`,
    data: {
      filePath: model.customBuilder?.filePath,
      model: model.className,
      returnType: method.returnType,
    },
  })) ?? [];
}

function laravelArtifactDetail(artifact: LaravelIndex["artifacts"][number]): string {
  return [
    `Laravel ${artifact.kind}`,
    artifact.constructorSignature ? `__construct(${artifact.constructorSignature})` : "",
    artifact.related.length > 0 ? artifact.related.join(", ") : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// Curated from Laravel Idea's `_BaseBuilder`/`_IH_*_QB` stubs: the Eloquent
// builder surface worth completing in a `Model::query()->` chain.
const ELOQUENT_BUILDER_METHODS = [
  "addSelect", "avg", "chunk", "chunkById", "count", "create", "cursor", "dd",
  "delete", "distinct", "doesntExist", "doesntHave", "dump", "each", "exists",
  "find", "findMany", "findOrFail", "findOrNew", "first", "firstOr",
  "firstOrCreate", "firstOrFail", "firstOrNew", "firstWhere", "forceCreate",
  "forceDelete", "get", "groupBy", "has", "having", "inRandomOrder", "join",
  "latest", "lazy", "lazyById", "leftJoin", "limit", "lockForUpdate", "max",
  "min", "offset", "oldest", "orWhere", "orWhereHas", "orWhereIn", "orderBy",
  "orderByDesc", "paginate", "pluck", "select", "sharedLock", "simplePaginate",
  "skip", "sole", "sum", "take", "tap", "toSql", "unless", "update",
  "updateOrCreate", "value", "when", "where", "whereBetween", "whereDate",
  "whereDoesntHave", "whereHas", "whereIn", "whereKey", "whereKeyNot",
  "whereNot", "whereNotIn", "whereNotNull", "whereNull", "with",
  "withCount", "withSum",
];

const SOFT_DELETE_BUILDER_METHODS = ["onlyTrashed", "restore", "withTrashed", "withoutTrashed"];

const COLUMN_ARGUMENT_METHODS =
  "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";

// Column-string argument position in a query-builder chain. Returns the
// receiver chain up to (and ending with) the `->`/`::` before the column
// method, so the builder's model can be resolved for `User::where('<cursor>`,
// `User::query()->orderBy('<cursor>`, `$user->posts()->pluck('<cursor>`, and
// `$q->where('<cursor>` inside a relation closure alike.
function eloquentColumnReceiverPrefix(linePrefix: string): string | null {
  const match = new RegExp(
    `(?:->|::)\\s*${COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?['"][A-Za-z0-9_]*$`,
  ).exec(linePrefix);
  return match ? linePrefix.slice(0, match.index + 2) : null;
}

// Table-name argument position in a query builder entry point:
// `DB::table('<cursor>` or `DB::connection('x')->table('<cursor>`.
function isInsideDbTableNameString(linePrefix: string): boolean {
  return /\bDB::(?:connection\([^)]*\)\s*->\s*)?table\(\s*['"][A-Za-z0-9_]*$/.test(linePrefix);
}

// Column-string argument position in a `DB::table('users')->...` chain.
function dbColumnContextTable(linePrefix: string): string | null {
  return new RegExp(
    `\\bDB::(?:connection\\([^)]*\\)\\s*->\\s*)?table\\(\\s*['"]([A-Za-z0-9_]+)['"]\\s*\\)[^;\\n]*->\\s*${COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?['"][A-Za-z0-9_]*$`,
  ).exec(linePrefix)?.[1] ?? null;
}

// Method position in an Eloquent chain: `User::query()-><cursor>` or
// `User::where(...)->orderBy(...)-><cursor>`.
function eloquentBuilderChainModel(linePrefix: string): string | null {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->\s*[A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ?? null;
}

function findModelByReference(
  document: TextDocument,
  reference: string,
  index: LaravelIndex,
): LaravelIndex["models"][number] | null {
  const resolved = resolvePhpClassReference(document.getText(), reference);
  return index.models.find(
    (model) => model.className === resolved || `${model.namespace}\\${model.className}` === resolved,
  ) ?? null;
}

function builderChainCompletions(
  model: LaravelIndex["models"][number],
  index: LaravelIndex,
): CompletionItem[] {
  const items = new Map<string, CompletionItem>();

  for (const scope of model.scopes) {
    items.set(scope, {
      label: scope,
      kind: CompletionItemKind.Method,
      detail: `Eloquent scope ${model.className}`,
      data: { filePath: model.filePath },
    });
  }

  for (const method of model.customBuilder?.methods ?? []) {
    items.set(method.name, {
      label: method.name,
      kind: CompletionItemKind.Method,
      detail: `Custom Eloquent builder ${model.customBuilder?.className}`,
      data: { filePath: model.customBuilder?.filePath ?? model.filePath },
    });
  }

  for (const macro of index.macros) {
    if (/\bBuilder$/.test(macro.className)) {
      items.set(macro.method, {
        label: macro.method,
        kind: CompletionItemKind.Method,
        detail: `Macro on ${macro.className}`,
        data: { filePath: macro.filePath },
      });
    }
  }

  if (model.usesSoftDeletes) {
    for (const method of SOFT_DELETE_BUILDER_METHODS) {
      items.set(method, {
        label: method,
        kind: CompletionItemKind.Method,
        detail: "SoftDeletes builder method",
        data: { filePath: model.filePath },
      });
    }
  }

  for (const method of ELOQUENT_BUILDER_METHODS) {
    if (!items.has(method)) {
      items.set(method, {
        label: method,
        kind: CompletionItemKind.Method,
        detail: "Eloquent builder method",
      });
    }
  }

  return [...items.values()];
}

// Property access on a model instance (`$user-><cursor>`, `$this-><cursor>`
// inside a model). The variable's model class is inferred from a type hint or
// a `$var = Model::...` / `$var = new Model(...)` assignment in the document.
function modelPropertyContext(
  document: TextDocument,
  linePrefix: string,
  index: LaravelIndex,
): LaravelIndex["models"][number] | null {
  const access = /(\$[A-Za-z_][A-Za-z0-9_]*)->[A-Za-z0-9_]*$/.exec(linePrefix);
  if (!access) {
    return null;
  }

  if (access[1] === "$this") {
    const documentPath = documentPathFromUri(document.uri);
    return index.models.find((model) => model.filePath === documentPath) ?? null;
  }

  const documentText = document.getText();
  const className = modelClassForVariable(documentText, access[1]);
  if (!className) {
    return null;
  }

  const resolved = resolvePhpClassReference(documentText, className);
  return index.models.find(
    (model) => model.className === resolved || `${model.namespace}\\${model.className}` === resolved,
  ) ?? null;
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

function modelPropertyCompletions(
  model: LaravelIndex["models"][number],
  index: LaravelIndex,
): CompletionItem[] {
  const items = new Map<string, CompletionItem>();
  const table = index.schemaTables.find((candidate) => candidate.name === model.tableName);
  const casts = new Map((model.castDetails ?? []).map((cast) => [cast.name, cast.type]));
  const accessors = new Map((model.accessorDetails ?? []).map((accessor) => [accessor.name, accessor]));

  for (const column of table?.columns ?? []) {
    items.set(column.name, {
      label: column.name,
      kind: CompletionItemKind.Field,
      detail: modelColumnDetail(column, casts.get(column.name)),
      data: { filePath: column.filePath, tableName: column.tableName },
    });
  }

  for (const accessor of model.accessors ?? []) {
    const detail = accessors.get(accessor);
    items.set(accessor, {
      label: accessor,
      kind: CompletionItemKind.Property,
      detail: modelAccessorDetail(model.className, detail),
      data: { filePath: model.filePath },
    });
  }

  for (const append of model.appends ?? []) {
    if (!items.has(append)) {
      items.set(append, {
        label: append,
        kind: CompletionItemKind.Property,
        detail: `Appended Eloquent attribute on ${model.className}`,
        data: { filePath: model.filePath },
      });
    }
  }

  for (const relation of model.relations) {
    items.set(relation.name, {
      label: relation.name,
      kind: CompletionItemKind.Property,
      detail: relation.relatedModel
        ? `Eloquent ${relation.type} relation to ${relation.relatedModel}`
        : `Eloquent ${relation.type} relation`,
      data: { filePath: model.filePath },
    });
    items.set(`${relation.name}_count`, {
      label: `${relation.name}_count`,
      kind: CompletionItemKind.Property,
      detail: `Count of ${relation.name} (via withCount)`,
      data: { filePath: model.filePath },
    });
  }

  return [...items.values()];
}

function modelColumnDetail(column: SchemaColumnInfo, castType: string | undefined): string {
  const detail = schemaColumnDetail(column);
  return castType ? `${detail} cast: ${castType}` : detail;
}

function modelAccessorDetail(
  className: string,
  accessor: NonNullable<LaravelIndex["models"][number]["accessorDetails"]>[number] | undefined,
): string {
  if (!accessor) {
    return `Accessor on ${className}`;
  }

  const source = accessor.source === "attribute" ? "Attribute accessor" : "Accessor";
  return accessor.returnType
    ? `${source} on ${className}: ${accessor.returnType}`
    : `${source} on ${className}`;
}

function schemaColumnsForDocument(document: TextDocument, index: LaravelIndex): SchemaColumnInfo[] {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath) {
    return [];
  }

  const model = index.models.find((candidate) => candidate.filePath === documentPath);
  if (!model) {
    return [];
  }

  return index.schemaTables.find((table) => table.name === model.tableName)?.columns ?? [];
}

function validationFieldsForDocument(
  document: TextDocument,
  index: LaravelIndex,
): ValidationFieldInfo[] {
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

  if (fields.length === 0) {
    for (const ruleSet of index.validationRules) {
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

function documentPathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function isInsideModelAttributeArray(
  document: TextDocument,
  position: { line: number; character: number },
): boolean {
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position,
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  return Boolean(match && !/\]\s*;\s*$/.test(match[0]));
}

function isInsideInertiaPageString(linePrefix: string): boolean {
  return /\bInertia::render\(\s*['"][^'"]*$/.test(linePrefix) ||
    /(?<!::)\binertia\(\s*['"][^'"]*$/.test(linePrefix) ||
    /\bRoute::inertia\(\s*['"][^'"]*['"]\s*,\s*['"][^'"]*$/.test(linePrefix);
}

function isInsideBladeViewDirectiveString(linePrefix: string): boolean {
  return /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*['"][^'"]*$/.test(
    linePrefix,
  );
}

function bladeSectionLayoutForDocument(
  document: TextDocument,
  linePrefix: string,
  index: LaravelIndex,
): LaravelIndex["bladeViews"][number] | null {
  if (!/@section\s*\(\s*['"][^'"]*$/.test(linePrefix)) {
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
  linePrefix: string,
  index: LaravelIndex,
): LaravelIndex["bladeViews"][number] | null {
  if (!/@(?:push|prepend)\s*\(\s*['"][^'"]*$/.test(linePrefix)) {
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

function isInsideValidationFieldCall(linePrefix: string): boolean {
  return /->(validated|input)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /->safe\(\)->(only|except)\(\s*\[\s*['"][^'"]*$/.test(linePrefix) ||
    /->(only|except)\(\s*\[\s*['"][^'"]*$/.test(linePrefix);
}

type ValidationSchemaCompletionContext =
  | { kind: "table" }
  | { kind: "column"; tableName: string };

type ValidationRuleCompletionContext = ValidationSchemaCompletionContext | { kind: "rule" };

function validationSchemaContextForLine(linePrefix: string): ValidationSchemaCompletionContext | null {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]*$/.exec(linePrefix);
  if (columnMatch) {
    return { kind: "column", tableName: columnMatch[1] };
  }

  return /\bRule::(?:exists|unique)\(\s*['"][^'"]*$/.test(linePrefix) ? { kind: "table" } : null;
}

// Curated from the Laravel 11/12 validation docs: built-in string rule names.
const VALIDATION_RULE_NAMES = [
  "accepted", "accepted_if", "active_url", "after", "after_or_equal", "alpha",
  "alpha_dash", "alpha_num", "array", "ascii", "bail", "before",
  "before_or_equal", "between", "boolean", "confirmed", "contains",
  "current_password", "date", "date_equals", "date_format", "decimal",
  "declined", "declined_if", "different", "digits", "digits_between",
  "dimensions", "distinct", "doesnt_end_with", "doesnt_start_with", "email",
  "ends_with", "exclude", "exclude_if", "exclude_unless", "exclude_with",
  "exclude_without", "exists", "extensions", "file", "filled", "gt", "gte",
  "hex_color", "image", "in", "in_array", "integer", "ip", "ipv4", "ipv6",
  "json", "list", "lowercase", "lt", "lte", "mac_address", "max", "max_digits",
  "mimes", "mimetypes", "min", "min_digits", "missing", "missing_if",
  "missing_unless", "missing_with", "missing_with_all", "multiple_of",
  "not_in", "not_regex", "nullable", "numeric", "present", "present_if",
  "present_unless", "present_with", "present_with_all", "prohibited",
  "prohibited_if", "prohibited_unless", "prohibits", "regex", "required",
  "required_array_keys", "required_if", "required_if_accepted",
  "required_if_declined", "required_unless", "required_with",
  "required_with_all", "required_without", "required_without_all", "same",
  "size", "sometimes", "starts_with", "string", "timezone", "ulid", "unique",
  "uppercase", "url", "uuid",
];

// Rule-string cursor inside a validation rules container: completes rule
// names, and table/column parameters after `exists:`/`unique:`.
function validationRuleStringContext(
  document: TextDocument,
  position: { line: number; character: number },
  linePrefix: string,
): ValidationRuleCompletionContext | null {
  const segment = validationRuleSegment(linePrefix);
  if (segment === null || !isInsideValidationRulesContainer(document, position)) {
    return null;
  }

  const schemaMatch = /^(?:exists|unique):([A-Za-z0-9_.]*)(,[A-Za-z0-9_]*)?$/.exec(segment);
  if (schemaMatch) {
    return schemaMatch[2] === undefined ? { kind: "table" } : { kind: "column", tableName: schemaMatch[1] };
  }

  return { kind: "rule" };
}

// The rule segment being typed: the value string after `=>` (or a bare array
// element string), narrowed to the text after the last `|` separator.
function validationRuleSegment(linePrefix: string): string | null {
  const value =
    /=>\s*'([^']*)$/.exec(linePrefix)?.[1] ??
    /=>\s*"([^"]*)$/.exec(linePrefix)?.[1] ??
    /=>\s*\[[^\]]*['"]([^'"]*)$/.exec(linePrefix)?.[1] ??
    /^\s*['"]([^'"]*)$/.exec(linePrefix)?.[1] ??
    null;
  return value === null ? null : (value.split("|").at(-1) ?? "");
}

function isInsideValidationRulesContainer(
  document: TextDocument,
  position: { line: number; character: number },
): boolean {
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position,
  });

  const call = lastMatch(/(?:->validate|->validateWithBag|->sometimes|Validator::make)\s*\(/g, beforeCursor);
  if (call && parenDelta(beforeCursor.slice(call.index + call[0].length)) >= 0) {
    return true;
  }

  const rulesMethod = lastMatch(/function\s+rules\s*\([^)]*\)[^{]*\{/g, beforeCursor);
  return Boolean(rulesMethod && braceDelta(beforeCursor.slice(rulesMethod.index + rulesMethod[0].length)) >= 0);
}

function lastMatch(pattern: RegExp, text: string): RegExpExecArray | null {
  let match: RegExpExecArray | null = null;
  for (const candidate of text.matchAll(pattern)) {
    match = candidate as RegExpExecArray;
  }
  return match;
}

function parenDelta(text: string): number {
  return [...text].reduce((delta, char) => delta + (char === "(" ? 1 : char === ")" ? -1 : 0), 0);
}

function schemaTableCompletionItems(index: LaravelIndex): CompletionItem[] {
  return index.schemaTables.map((table) => ({
    label: table.name,
    kind: CompletionItemKind.Struct,
    detail: `Schema table ${table.columns.length} columns`,
    data: { filePath: table.filePath },
  }));
}

function schemaColumnCompletionItems(index: LaravelIndex, tableName: string): CompletionItem[] {
  return (
    index.schemaTables
      .find((table) => table.name === tableName)
      ?.columns.map((column) => ({
        label: column.name,
        kind: CompletionItemKind.Field,
        detail: schemaColumnDetail(column),
        data: { filePath: column.filePath, tableName: column.tableName },
      })) ?? []
  );
}

function isInsideTranslationKeyString(linePrefix: string): boolean {
  return /(__|trans|trans_choice)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /@(lang|choice)\s*\(\s*['"][^'"]*$/.test(linePrefix);
}

function isInsideAuthorizationAbilityString(linePrefix: string): boolean {
  return /->(can|cannot|authorize)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /Gate::(allows|denies|authorize|check|any|none)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /@(can|cannot|canany)\s*\(\s*['"][^'"]*$/.test(linePrefix);
}

function isInsideArtisanCommandString(linePrefix: string): boolean {
  return /\bArtisan::(?:call|queue)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /(?:\$this|static|self)->(?:call|callSilent)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /\bSchedule::command\(\s*['"][^'"]*$/.test(linePrefix) ||
    /->command\(\s*['"][^'"]*$/.test(linePrefix);
}

function isInsideStorageDiskString(linePrefix: string): boolean {
  return /\bStorage::(?:disk|drive|fake|persistentFake)\(\s*['"][^'"]*$/.test(linePrefix);
}

// Disk names come from the `filesystems.disks.<name>` config keys already in
// the index, so no dedicated filesystems parser is needed.
function storageDiskCompletionItems(index: LaravelIndex): CompletionItem[] {
  const disks = new Map<string, string>();
  for (const entry of index.configEntries) {
    const match = /^filesystems\.disks\.([A-Za-z0-9_-]+)/.exec(entry.key);
    if (match && !disks.has(match[1])) {
      disks.set(match[1], entry.filePath);
    }
  }

  return [...disks.entries()].map(([name, filePath]) => ({
    label: name,
    kind: CompletionItemKind.Value,
    detail: "Laravel filesystem disk",
    data: { filePath },
  }));
}

function isInsideMiddlewareString(linePrefix: string): boolean {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?['"][^'"]*$/.test(linePrefix);
}

function isInsideProviderClassArray(document: TextDocument, linePrefix: string): boolean {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath || !isProviderRegistrationFile(documentPath)) {
    return false;
  }

  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)[^\]\n]*[A-Za-z_\\]*$/.test(linePrefix) ||
    /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)[^\]\n]*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*[A-Za-z_\\]*$/.test(linePrefix);
}

function isProviderRegistrationFile(filePath: string): boolean {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}

function routeParameterCompletionRouteName(linePrefix: string): string | null {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(linePrefix);
  if (!match) {
    return null;
  }

  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (!/['"][^'"]*$/.test(currentEntry) || /=>/.test(currentEntry)) {
    return null;
  }

  return match[2];
}

function routeControllerActionClass(linePrefix: string): string | null {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*['"][^'"]*$/.exec(
    linePrefix,
  )?.[1] ?? null;
}

function routeControllerGroupActionClass(document: TextDocument, lineNumber: number, linePrefix: string): string | null {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*['"][^'"]*$/.test(linePrefix)) {
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

function isInsideRouteControllerClassContext(linePrefix: string): boolean {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*[A-Za-z_\\]*$/.test(linePrefix) ||
    /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*[A-Za-z_\\]*$/.test(linePrefix);
}

function controllerMatches(controller: LaravelIndex["controllers"][number], value: string): boolean {
  return controller.className === value ||
    controller.className === value.split("\\").at(-1) ||
    (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}

const RELATION_CONTEXT_METHODS =
  "with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax";

// Relation-name string in an eager-load/constraint call. Supports dotted nested
// paths (`with('author.profile.<cursor>')` completes the profile's relations)
// and resolves the receiver chain before the relation method, so completions
// work for `User::query()->whereHas('<cursor>')`, `$user->load('<cursor>')`,
// and `$q->whereHas('<cursor>')` inside relation closures alike.
function eloquentRelationContext(
  document: TextDocument,
  linePrefix: string,
  offset: number,
  index: LaravelIndex,
): ModelInfo | null {
  const context = eloquentRelationReceiverContext(linePrefix);
  if (!context) {
    return null;
  }

  const rootModel = builderReceiverModel(document.getText(), context.receiverPrefix, offset, index);
  if (!rootModel) {
    return null;
  }

  // The final dotted segment is the one being typed; the earlier segments form
  // the relation path to walk from the root model.
  const segments = context.pathPrefix.split(".");
  segments.pop();
  return resolveRelationPath(document.getText(), rootModel, segments, index);
}

function eloquentRelationReceiverContext(linePrefix: string): { pathPrefix: string; receiverPrefix: string } | null {
  const match = new RegExp(
    `(?:->|::)\\s*(?:${RELATION_CONTEXT_METHODS})\\s*\\(\\s*(?:\\[\\s*)?['"]([^'"]*)$`,
  ).exec(linePrefix);
  return match ? { pathPrefix: match[1], receiverPrefix: linePrefix.slice(0, match.index + 2) } : null;
}

// Eloquent write methods whose array argument is keyed by model attributes.
const WRITE_ARRAY_METHODS =
  "create|forceCreate|make|fill|forceFill|update|firstOrCreate|firstOrNew|updateOrCreate";

// Attribute-array key position in an Eloquent write call:
// `User::create(['<cursor>'])`, `$user->update(['name' => 'x', '<cursor>'])`.
function modelWriteArrayContext(
  document: TextDocument,
  position: { line: number; character: number },
  offset: number,
  index: LaravelIndex,
): ModelInfo | null {
  const beforeCursor = document.getText({ start: { line: 0, character: 0 }, end: position });
  if (!isArrayKeyStringOpen(beforeCursor)) {
    return null;
  }

  const call = lastMatch(
    new RegExp(
      `(\\$[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:->|::)\\s*(?:${WRITE_ARRAY_METHODS})\\s*\\(\\s*\\[`,
      "g",
    ),
    beforeCursor,
  );
  if (!call) {
    return null;
  }

  // Reject when the write array (or its call) already closed before the cursor.
  const arrayBody = beforeCursor.slice(call.index + call[0].length);
  if (bracketDelta(arrayBody) < 0 || parenDelta(arrayBody) < 0) {
    return null;
  }

  const receiver = call[1];
  return receiver.startsWith("$")
    ? builderVariableModel(document.getText(), receiver, offset, index)
    : findModelByReference(document, receiver, index);
}

// True when the cursor sits inside a string starting a new array element
// (preceded by `[` or `,`), i.e. an array key rather than a `=>` value.
function isArrayKeyStringOpen(beforeCursor: string): boolean {
  const openQuote = /(['"])[^'"]*$/.exec(beforeCursor);
  if (!openQuote) {
    return false;
  }

  let cursor = openQuote.index - 1;
  while (cursor >= 0 && /\s/.test(beforeCursor[cursor])) {
    cursor -= 1;
  }
  const preceding = beforeCursor[cursor];
  return preceding === "[" || preceding === ",";
}

function modelWritableColumnCompletions(model: ModelInfo, index: LaravelIndex): CompletionItem[] {
  const items = new Map<string, CompletionItem>();
  const table = index.schemaTables.find((candidate) => candidate.name === model.tableName);
  const casts = new Map((model.castDetails ?? []).map((cast) => [cast.name, cast.type]));

  for (const column of table?.columns ?? []) {
    items.set(column.name, {
      label: column.name,
      kind: CompletionItemKind.Field,
      detail: modelColumnDetail(column, casts.get(column.name)),
      data: { filePath: column.filePath, tableName: column.tableName },
    });
  }

  for (const fillable of model.fillable) {
    if (!items.has(fillable)) {
      items.set(fillable, {
        label: fillable,
        kind: CompletionItemKind.Field,
        detail: `Fillable attribute on ${model.className}`,
        data: { filePath: model.filePath },
      });
    }
  }

  return [...items.values()];
}

function bracketDelta(text: string): number {
  return [...text].reduce((delta, char) => delta + (char === "[" ? 1 : char === "]" ? -1 : 0), 0);
}

function macroStaticCallClass(linePrefix: string): string | null {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ?? null;
}

function factoryStateModel(linePrefix: string): string | null {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->[A-Za-z_][A-Za-z0-9_]*$/.exec(
    linePrefix,
  )?.[1] ?? null;
}

function eloquentScopeModel(linePrefix: string): string | null {
  return (
    /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ??
    /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*\([^)]*\)(?:->[A-Za-z_][A-Za-z0-9_]*\([^)]*\))*->[A-Za-z_][A-Za-z0-9_]*$/.exec(
      linePrefix,
    )?.[1] ??
    null
  );
}

function isInsideSeederCallArray(linePrefix: string): boolean {
  return /->call\(\s*\[\s*[A-Za-z_\\]*$/.test(linePrefix);
}

function artifactContextKinds(linePrefix: string): LaravelIndex["artifacts"][number]["kind"][] | null {
  if (/\bevent\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix)) {
    return ["event"];
  }
  if (
    /\bdispatch\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix) ||
    /::dispatch\s*\(\s*[A-Za-z_\\]*$/.test(linePrefix)
  ) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix)) {
    return ["mailable", "notification"];
  }

  return null;
}

function bladeComponentTagContext(
  linePrefix: string,
): "tag" | { kind: "props"; name: string } | null {
  if (/<x-[A-Za-z0-9_.:-]*$/.test(linePrefix)) {
    return "tag";
  }

  const propsMatch = /<x-([A-Za-z0-9_.:-]+)\s+[^>]*$/.exec(linePrefix);
  return propsMatch ? { kind: "props", name: propsMatch[1].replace(/:/g, ".") } : null;
}

function livewireComponentTagContext(
  linePrefix: string,
): "tag" | { kind: "props"; name: string } | null {
  if (/<livewire:[A-Za-z0-9_.-]*$/.test(linePrefix)) {
    return "tag";
  }

  const propsMatch = /<livewire:([A-Za-z0-9_.-]+)\s+[^>]*$/.exec(linePrefix);
  return propsMatch ? { kind: "props", name: propsMatch[1] } : null;
}

function livewireComponentDetail(component: LaravelIndex["livewireComponents"][number]): string {
  return component.namespace
    ? `Livewire component ${component.namespace}\\${component.className}`
    : `Livewire component ${component.className}`;
}

function livewireKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// `wire:model` binds public properties, other `wire:*` handlers bind public
// action methods. Only resolvable inside the component's own Blade view under
// `resources/views/livewire/**`.
function livewireWireBindingContext(
  document: TextDocument,
  linePrefix: string,
  index: LaravelIndex,
): { component: LaravelIndex["livewireComponents"][number]; kind: "methods" | "properties" } | null {
  const match = /\bwire:([a-zA-Z0-9.-]+)\s*=\s*['"][^'"]*$/.exec(linePrefix);
  if (!match) {
    return null;
  }

  const component = livewireComponentForDocument(document, index);
  if (!component) {
    return null;
  }

  return { component, kind: match[1].startsWith("model") ? "properties" : "methods" };
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

function isInsideStringCall(linePrefix: string, helper: string): boolean {
  return new RegExp(`\\b${helper}\\(\\s*['\"][^'\"]*$`).test(linePrefix);
}

function isInsideRouteNameString(linePrefix: string): boolean {
  return /(?:\b(?:route|to_route)|->route)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /\bRoute::(?:has|is)\(\s*['"][^'"]*$/.test(linePrefix) ||
    /->routeIs\(\s*['"][^'"]*$/.test(linePrefix);
}

function helperCompletions(): CompletionItem[] {
  return [
    helper("route", "route('$1')", "Generate a URL for a named route"),
    helper("view", "view('$1')", "Render a Blade view"),
    helper("config", "config('$1')", "Read a Laravel config value"),
    helper("env", "env('$1')", "Read an environment value"),
    helper("app", "app($1)", "Resolve from the service container"),
    helper("resolve", "resolve($1)", "Resolve a type from the service container"),
  ];
}

function helper(label: string, insertText: string, detail: string): CompletionItem {
  return {
    label,
    kind: CompletionItemKind.Function,
    detail,
    insertText,
    insertTextFormat: InsertTextFormat.Snippet,
  };
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
