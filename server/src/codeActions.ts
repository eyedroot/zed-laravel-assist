import {
  CodeAction,
  CodeActionKind,
  CodeActionParams,
  CreateFile,
  Diagnostic,
  TextEdit,
  TextDocumentEdit,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { LaravelDiagnosticData } from "./diagnostics.js";
import { LaravelIndex } from "./projectIndex.js";

const MAX_QUICK_FIXES_PER_DIAGNOSTIC = 5;
const EMPTY_BLADE_FILE = "";

export function codeActionsForDiagnostics(
  params: CodeActionParams,
  index: LaravelIndex,
  workspaceRoot: string | null = null,
  document?: TextDocument,
): CodeAction[] {
  const actions: CodeAction[] = [];

  for (const diagnostic of params.context.diagnostics) {
    const authUserAction = authUserTypeNarrowingAction(params, diagnostic, document);
    if (authUserAction) {
      actions.push(authUserAction);
    }

    const data = laravelDiagnosticData(diagnostic);
    if (!data) {
      continue;
    }

    for (const replacement of replacementCandidates(data, index).slice(0, MAX_QUICK_FIXES_PER_DIAGNOSTIC)) {
      actions.push({
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [params.textDocument.uri]: [TextEdit.replace(diagnostic.range, replacement)],
          },
        },
        kind: CodeActionKind.QuickFix,
        title: `Replace with '${replacement}'`,
      });
    }

    const createAction = createMissingArtifactAction(data, diagnostic, workspaceRoot);
    if (createAction) {
      actions.push(createAction);
    }
  }

  actions.push(...modelGenerationActions(params, index, workspaceRoot));

  return actions;
}

function authUserTypeNarrowingAction(
  params: CodeActionParams,
  diagnostic: Diagnostic,
  document?: TextDocument,
): CodeAction | null {
  if (!document || diagnostic.source !== "intelephense" || String(diagnostic.code ?? "") !== "P1006") {
    return null;
  }

  const expectedType = /Expected type '([^']+)'/.exec(diagnostic.message)?.[1];
  if (!expectedType || !/Found 'Illuminate\\Contracts\\Auth\\Authenticatable\|null'/.test(diagnostic.message)) {
    return null;
  }

  const line = document.getText({
    start: { character: 0, line: diagnostic.range.start.line },
    end: { character: Number.MAX_SAFE_INTEGER, line: diagnostic.range.start.line },
  });
  const authCall = authUserCallRange(line, diagnostic.range.start.character);
  if (!authCall) {
    return null;
  }

  const indent = /^\s*/.exec(line)?.[0] ?? "";
  const variable = "$authenticatedUser";
  const type = expectedType.startsWith("\\") ? expectedType : `\\${expectedType}`;

  return {
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [params.textDocument.uri]: [
          TextEdit.insert(
            { character: 0, line: diagnostic.range.start.line },
            `${indent}/** @var ${type} ${variable} */\n${indent}${variable} = Auth::user();\n`,
          ),
          TextEdit.replace(
            {
              end: { character: authCall.end, line: diagnostic.range.start.line },
              start: { character: authCall.start, line: diagnostic.range.start.line },
            },
            variable,
          ),
        ],
      },
    },
    kind: CodeActionKind.QuickFix,
    title: `Type-narrow Auth::user() as ${expectedType}`,
  };
}

function authUserCallRange(line: string, preferredCharacter: number): { end: number; start: number } | null {
  const ranges = [...line.matchAll(/\bAuth::user\(\)/g)].map((match) => ({
    end: (match.index ?? 0) + match[0].length,
    start: match.index ?? 0,
  }));
  if (ranges.length === 0) {
    return null;
  }

  return ranges.find((range) => preferredCharacter >= range.start && preferredCharacter <= range.end) ?? ranges[0];
}

function laravelDiagnosticData(diagnostic: Diagnostic): LaravelDiagnosticData | null {
  const data = diagnostic.data as Partial<LaravelDiagnosticData> | undefined;
  if (
    data &&
    typeof data.value === "string" &&
    (data.kind === "route" ||
      data.kind === "view" ||
      data.kind === "component" ||
      data.kind === "componentProp" ||
      data.kind === "bladeSection" ||
      data.kind === "bladeStack" ||
      data.kind === "config" ||
      data.kind === "env" ||
      data.kind === "factoryState" ||
      data.kind === "translation" ||
      data.kind === "authorization" ||
      data.kind === "container" ||
      data.kind === "controller" ||
      data.kind === "controllerAction" ||
      data.kind === "command" ||
      data.kind === "middleware" ||
      data.kind === "relation" ||
      data.kind === "seeder" ||
      data.kind === "serviceProvider" ||
      data.kind === "scope" ||
      data.kind === "schemaColumn" ||
      data.kind === "schemaTable" ||
      data.kind === "routeParameter" ||
      data.kind === "validationField" ||
      data.kind === "modelAttribute")
  ) {
    return {
      kind: data.kind,
      model: typeof data.model === "string" ? data.model : undefined,
      tableName: typeof data.tableName === "string" ? data.tableName : undefined,
      value: data.value,
    };
  }

  return null;
}

function replacementCandidates(data: LaravelDiagnosticData, index: LaravelIndex): string[] {
  const candidates = allCandidates(data, index);
  if (data.kind === "routeParameter") {
    return candidates;
  }

  const normalizedValue = data.value.toLowerCase();

  return candidates
    .map((candidate) => ({
      candidate,
      score: candidateScore(candidate.toLowerCase(), normalizedValue),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.candidate.localeCompare(right.candidate))
    .map((entry) => entry.candidate);
}

function allCandidates(data: LaravelDiagnosticData, index: LaravelIndex): string[] {
  switch (data.kind) {
    case "authorization":
      return index.authorization.map((entry) => entry.ability);
    case "command":
      return index.commands.map((command) => command.name);
    case "component":
      return index.bladeComponents.map((component) => component.name);
    case "componentProp":
      return data.model ? (index.bladeComponents.find((component) => component.name === data.model)?.props ?? []) : [];
    case "bladeSection":
      return data.model ? (index.bladeViews.find((view) => view.name === data.model)?.yields ?? []) : [];
    case "bladeStack":
      return data.model ? (index.bladeViews.find((view) => view.name === data.model)?.stacks ?? []) : [];
    case "config":
      return index.configKeys;
    case "container":
      return index.containerBindings.map((binding) => binding.abstract);
    case "controller":
      return index.controllers.map((controller) =>
        controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className
      );
    case "controllerAction":
      return data.model ? (findController(index, data.model)?.actions ?? []) : [];
    case "env":
      return index.envKeys;
    case "factoryState":
      return data.model
        ? index.factories
          .filter((factory) => factory.model === data.model || factory.model?.split("\\").at(-1) === data.model)
          .flatMap((factory) => factory.states)
        : [];
    case "middleware":
      return index.middleware.map((middleware) => middleware.alias);
    case "modelAttribute":
      return data.tableName
        ? (index.schemaTables.find((table) => table.name === data.tableName)?.columns.map((column) => column.name) ?? [])
        : [];
    case "relation":
      return data.model ? (findModel(index, data.model)?.relations.map((relation) => relation.name) ?? []) : [];
    case "route":
      return index.routes.map((route) => route.name).filter((name): name is string => Boolean(name));
    case "routeParameter":
      return routeParameters(index.routes.find((route) => route.name === data.model));
    case "schemaColumn":
      return data.tableName
        ? (index.schemaTables.find((table) => table.name === data.tableName)?.columns.map((column) => column.name) ?? [])
        : [];
    case "schemaTable":
      return index.schemaTables.map((table) => table.name);
    case "seeder":
      return index.seeders.map((seeder) => seeder.className);
    case "serviceProvider":
      return index.providers
        .filter((provider) => provider.source === "class")
        .map((provider) => provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className);
    case "scope":
      return data.model ? (findModel(index, data.model)?.scopes ?? []) : [];
    case "translation":
      return index.translationKeys.map((translation) => translation.key);
    case "validationField":
      return uniqueSorted(index.validationRules.flatMap((ruleSet) => ruleSet.fields.map((field) => field.field)));
    case "view":
      return index.bladeViews.map((view) => view.name);
    case "policyConvention":
    case "requestConvention":
    case "resourceConvention":
      return [];
  }
}

function findModel(index: LaravelIndex, modelName: string): LaravelIndex["models"][number] | null {
  return index.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName,
  ) ?? null;
}

function findController(index: LaravelIndex, controllerName: string): LaravelIndex["controllers"][number] | null {
  return index.controllers.find(
    (controller) => controller.className === controllerName || `${controller.namespace}\\${controller.className}` === controllerName,
  ) ?? null;
}

function routeParameters(route: LaravelIndex["routes"][number] | undefined): string[] {
  if (!route?.uri) {
    return [];
  }

  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}

function createMissingArtifactAction(
  data: LaravelDiagnosticData,
  diagnostic: Diagnostic,
  workspaceRoot: string | null,
): CodeAction | null {
  if (!workspaceRoot || (data.kind !== "view" && data.kind !== "component")) {
    return null;
  }

  const filePath = data.kind === "view"
    ? bladeViewFilePath(workspaceRoot, data.value)
    : bladeComponentFilePath(workspaceRoot, data.value);
  if (!filePath) {
    return null;
  }

  const uri = pathToFileURL(filePath).toString();
  return {
    diagnostics: [diagnostic],
    edit: {
      documentChanges: [
        CreateFile.create(uri, { ignoreIfExists: true }),
        TextDocumentEdit.create(
          {
            uri,
            version: null,
          },
          [TextEdit.insert({ character: 0, line: 0 }, EMPTY_BLADE_FILE)],
        ),
      ],
    },
    kind: CodeActionKind.QuickFix,
    title: data.kind === "view"
      ? `Create Blade view '${data.value}'`
      : `Create Blade component '${data.value}'`,
  };
}

function bladeViewFilePath(workspaceRoot: string, viewName: string): string | null {
  const segments = safeLaravelNameSegments(viewName);
  if (!segments) {
    return null;
  }

  return path.join(workspaceRoot, "resources", "views", `${path.join(...segments)}.blade.php`);
}

function bladeComponentFilePath(workspaceRoot: string, componentName: string): string | null {
  const segments = safeLaravelNameSegments(componentName.replace(/:/g, "."));
  if (!segments) {
    return null;
  }

  return path.join(workspaceRoot, "resources", "views", "components", `${path.join(...segments)}.blade.php`);
}

function safeLaravelNameSegments(name: string): string[] | null {
  const segments = name.split(".").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  return segments.every((segment) => /^[A-Za-z0-9_-]+$/.test(segment)) ? segments : null;
}

function modelGenerationActions(
  params: CodeActionParams,
  index: LaravelIndex,
  workspaceRoot: string | null,
): CodeAction[] {
  if (!workspaceRoot) {
    return [];
  }

  const filePath = pathFromUri(params.textDocument.uri);
  const model = index.models.find((candidate) => candidate.filePath === filePath);
  if (!model) {
    return [];
  }

  const actions: CodeAction[] = [];
  if (!hasFactory(model, index)) {
    const filePath = path.join(workspaceRoot, "database", "factories", `${model.className}Factory.php`);
    actions.push(createFileAction(
      `Create factory for ${model.className}`,
      filePath,
      factoryStub(model, index),
    ));
  }

  if (!hasJsonResource(model, index)) {
    const filePath = path.join(workspaceRoot, "app", "Http", "Resources", `${model.className}Resource.php`);
    actions.push(createFileAction(
      `Create JSON resource for ${model.className}`,
      filePath,
      resourceStub(model, index),
    ));
  }

  if (!hasPolicy(model, index)) {
    const filePath = path.join(workspaceRoot, "app", "Policies", `${model.className}Policy.php`);
    actions.push(createFileAction(
      `Create policy for ${model.className}`,
      filePath,
      policyStub(model),
    ));
  }

  if (!hasSeeder(model, index)) {
    const filePath = path.join(workspaceRoot, "database", "seeders", `${model.className}Seeder.php`);
    actions.push(createFileAction(
      `Create seeder for ${model.className}`,
      filePath,
      seederStub(model),
    ));
  }

  if (!hasFormRequest(model, index, "Store")) {
    const filePath = path.join(workspaceRoot, "app", "Http", "Requests", `Store${model.className}Request.php`);
    actions.push(createFileAction(
      `Create store request for ${model.className}`,
      filePath,
      formRequestStub(model, index, "Store"),
    ));
  }

  if (!hasFormRequest(model, index, "Update")) {
    const filePath = path.join(workspaceRoot, "app", "Http", "Requests", `Update${model.className}Request.php`);
    actions.push(createFileAction(
      `Create update request for ${model.className}`,
      filePath,
      formRequestStub(model, index, "Update"),
    ));
  }

  return actions;
}

function createFileAction(title: string, filePath: string, contents: string): CodeAction {
  const uri = pathToFileURL(filePath).toString();

  return {
    edit: {
      documentChanges: [
        CreateFile.create(uri, { ignoreIfExists: true }),
        TextDocumentEdit.create(
          {
            uri,
            version: null,
          },
          [TextEdit.insert({ character: 0, line: 0 }, contents)],
        ),
      ],
    },
    kind: CodeActionKind.Refactor,
    title,
  };
}

function hasFactory(model: LaravelIndex["models"][number], index: LaravelIndex): boolean {
  return index.factories.some(
    (factory) =>
      factory.className === `${model.className}Factory` ||
      factory.model === model.className ||
      factory.model === `${model.namespace}\\${model.className}` ||
      factory.model?.split("\\").at(-1) === model.className,
  );
}

function hasJsonResource(model: LaravelIndex["models"][number], index: LaravelIndex): boolean {
  return index.artifacts.some(
    (artifact) => artifact.kind === "resource" && artifact.className === `${model.className}Resource`,
  );
}

function hasPolicy(model: LaravelIndex["models"][number], index: LaravelIndex): boolean {
  return index.authorization.some(
    (entry) =>
      entry.policy === `${model.className}Policy` ||
      entry.policy === `${model.namespace}\\Policies\\${model.className}Policy` ||
      entry.policy?.split("\\").at(-1) === `${model.className}Policy` ||
      entry.model === model.className ||
      entry.model === `${model.namespace}\\${model.className}` ||
      entry.model?.split("\\").at(-1) === model.className,
  );
}

function hasSeeder(model: LaravelIndex["models"][number], index: LaravelIndex): boolean {
  return index.seeders.some((seeder) => seeder.className === `${model.className}Seeder`);
}

function hasFormRequest(model: LaravelIndex["models"][number], index: LaravelIndex, action: "Store" | "Update"): boolean {
  return index.validationRules.some(
    (ruleSet) =>
      ruleSet.source === "formRequest" &&
      (ruleSet.className === `${action}${model.className}Request` ||
        ruleSet.className === `${model.className}${action}Request`),
  );
}

function factoryStub(model: LaravelIndex["models"][number], index: LaravelIndex): string {
  const namespace = model.namespace ?? "App\\Models";
  const fields = modelFieldNames(model, index);
  const fieldLines = fields.length > 0
    ? fields.map((field) => `            '${field}' => ${fakeValueForField(field)},`).join("\n")
    : "            //";

  return `<?php

namespace Database\\Factories;

use ${namespace}\\${model.className};
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

/**
 * @extends Factory<${model.className}>
 */
class ${model.className}Factory extends Factory
{
    protected $model = ${model.className}::class;

    public function definition(): array
    {
        return [
${fieldLines}
        ];
    }
}
`;
}

function resourceStub(model: LaravelIndex["models"][number], index: LaravelIndex): string {
  const fields = modelFieldNames(model, index);
  const fieldLines = fields.length > 0
    ? fields.map((field) => `            '${field}' => $this->${field},`).join("\n")
    : "            //";

  return `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class ${model.className}Resource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
${fieldLines}
        ];
    }
}
`;
}

function policyStub(model: LaravelIndex["models"][number]): string {
  const namespace = model.namespace ?? "App\\Models";
  const useLines = uniqueSorted([`${namespace}\\${model.className}`, "App\\Models\\User"])
    .map((className) => `use ${className};`)
    .join("\n");
  const subjectVariable = model.className === "User" ? "model" : lowerFirst(model.className);

  return `<?php

namespace App\\Policies;

${useLines}

class ${model.className}Policy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function delete(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function restore(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function forceDelete(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }
}
`;
}

function seederStub(model: LaravelIndex["models"][number]): string {
  const namespace = model.namespace ?? "App\\Models";

  return `<?php

namespace Database\\Seeders;

use ${namespace}\\${model.className};
use Illuminate\\Database\\Seeder;

class ${model.className}Seeder extends Seeder
{
    public function run(): void
    {
        ${model.className}::factory()->count(10)->create();
    }
}
`;
}

function formRequestStub(
  model: LaravelIndex["models"][number],
  index: LaravelIndex,
  action: "Store" | "Update",
): string {
  const rules = validationRuleLines(model, index, action);

  return `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ${action}${model.className}Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
${rules}
        ];
    }
}
`;
}

function validationRuleLines(
  model: LaravelIndex["models"][number],
  index: LaravelIndex,
  action: "Store" | "Update",
): string {
  const schemaColumns = schemaColumnsForModel(model, index);
  const fields = modelFieldNames(model, index);
  if (fields.length === 0) {
    return "            //";
  }

  return fields
    .map((field) => {
      const column = schemaColumns.find((candidate) => candidate.name === field);
      return `            '${field}' => ['${validationRulesForField(field, column, action).join("', '")}'],`;
    })
    .join("\n");
}

function validationRulesForField(
  field: string,
  column: LaravelIndex["schemaTables"][number]["columns"][number] | undefined,
  action: "Store" | "Update",
): string[] {
  const rules = action === "Update" ? ["sometimes"] : [];
  rules.push(column?.modifiers.includes("nullable") ? "nullable" : "required");

  if (field === "email" || field.endsWith("_email")) {
    rules.push("email");
  }

  switch (column?.type) {
    case "boolean":
      rules.push("boolean");
      break;
    case "date":
    case "dateTime":
    case "timestamp":
    case "timestamps":
      rules.push("date");
      break;
    case "decimal":
    case "double":
    case "float":
      rules.push("numeric");
      break;
    case "foreignId":
    case "id":
    case "integer":
    case "tinyInteger":
    case "smallInteger":
    case "mediumInteger":
    case "bigInteger":
    case "unsignedInteger":
    case "unsignedBigInteger":
      rules.push("integer");
      break;
    case "json":
      rules.push("array");
      break;
    case "string":
    case "char":
      rules.push("string", "max:255");
      break;
    case "text":
    case "longText":
    case "mediumText":
      rules.push("string");
      break;
    default:
      rules.push("string");
      break;
  }

  if (column?.modifiers.includes("unique")) {
    rules.push(`unique:${column.tableName},${column.name}`);
  }

  return rules;
}

function modelFieldNames(model: LaravelIndex["models"][number], index: LaravelIndex): string[] {
  const explicitFields = [...model.fillable, ...model.casts].filter((field) => field !== "password");
  if (explicitFields.length > 0) {
    return uniqueSorted(explicitFields);
  }

  const skipped = new Set(["created_at", "deleted_at", "email_verified_at", "id", "password", "remember_token", "updated_at"]);
  return index.schemaTables
    .find((table) => table.name === model.tableName)
    ?.columns.map((column) => column.name)
    .filter((field) => !skipped.has(field)) ?? [];
}

function schemaColumnsForModel(model: LaravelIndex["models"][number], index: LaravelIndex): LaravelIndex["schemaTables"][number]["columns"] {
  return index.schemaTables.find((table) => table.name === model.tableName)?.columns ?? [];
}

function fakeValueForField(field: string): string {
  if (field === "email" || field.endsWith("_email")) {
    return "fake()->safeEmail()";
  }
  if (field === "name" || field.endsWith("_name")) {
    return "fake()->name()";
  }
  if (field === "title") {
    return "fake()->sentence()";
  }
  if (field === "body" || field === "description" || field === "content") {
    return "fake()->paragraph()";
  }
  if (field.endsWith("_at") || field.endsWith("_date")) {
    return "fake()->dateTime()";
  }
  if (field.startsWith("is_") || field.startsWith("has_")) {
    return "fake()->boolean()";
  }
  if (field.endsWith("_id")) {
    return "1";
  }

  return "fake()->word()";
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function lowerFirst(value: string): string {
  return value.replace(/^./, (match) => match.toLowerCase());
}

function pathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function candidateScore(candidate: string, value: string): number {
  if (candidate === value) {
    return 100;
  }
  if (candidate.includes(value) || value.includes(candidate)) {
    return 80;
  }

  const distance = levenshteinDistance(candidate, value);
  if (distance <= 3) {
    return 50 - distance;
  }

  const candidateParts = new Set(candidate.split(/[._:-]+/).filter(Boolean));
  const valueParts = value.split(/[._:-]+/).filter(Boolean);
  return valueParts.filter((part) => candidateParts.has(part)).length;
}

function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}
