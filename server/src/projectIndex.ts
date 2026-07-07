import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolvePhpClassReference } from "./phpResolver.js";

export const LARAVEL_INDEX_CACHE_VERSION = 34;

export interface LaravelIndex {
  // FQN configured at `auth.providers.users.model`, when the project sets one.
  authUserModel: string | null;
  authorization: AuthorizationInfo[];
  bladeComponents: BladeComponentInfo[];
  bladeViews: BladeViewInfo[];
  commands: CommandInfo[];
  configEntries: ConfigKeyInfo[];
  configKeys: string[];
  containerBindings: ContainerBindingInfo[];
  controllers: ControllerInfo[];
  envEntries: EnvKeyInfo[];
  envKeys: string[];
  artifacts: LaravelArtifactInfo[];
  factories: FactoryInfo[];
  facades: FacadeInfo[];
  inertiaPages: InertiaPageInfo[];
  macros: MacroInfo[];
  middleware: MiddlewareInfo[];
  models: ModelInfo[];
  providers: ServiceProviderInfo[];
  routes: RouteInfo[];
  schemaTables: SchemaTableInfo[];
  seeders: SeederInfo[];
  translationKeys: TranslationKeyInfo[];
  validationRules: ValidationRuleInfo[];
  views: string[];
}

export interface ModelInfo {
  accessors?: string[];
  accessorDetails?: ModelAccessorInfo[];
  appends?: string[];
  castDetails?: ModelCastInfo[];
  builderMethods?: ModelBuilderMethodInfo[];
  className: string;
  customBuilder?: ModelCustomBuilderInfo;
  casts: string[];
  isTrait?: boolean;
  namespace: string | null;
  filePath: string;
  fillable: string[];
  guarded: string[];
  methodDetails?: ModelMethodInfo[];
  relations: ModelRelationInfo[];
  relationships: string[];
  scopeDetails?: ModelScopeInfo[];
  scopes: string[];
  staticMethods?: string[];
  tableName: string;
  usedTraits?: string[];
  usesSoftDeletes?: boolean;
}

// Scopes merged in from traits keep their declaring file so navigation and
// hovers can point at the trait instead of the model class.
export interface ModelScopeInfo {
  filePath: string;
  name: string;
}

export interface ModelMethodInfo {
  name: string;
  range: SourceRange;
}

export interface ModelAccessorInfo {
  name: string;
  range?: SourceRange;
  returnType: string | null;
  source: "attribute" | "classic";
}

export interface ModelCastInfo {
  name: string;
  type: string;
}

export interface ModelBuilderMethodInfo {
  name: string;
  returnType: string | null;
}

export interface ModelCustomBuilderInfo {
  className: string;
  filePath: string | null;
  methods: ModelBuilderMethodInfo[];
  namespace: string | null;
}

export interface ModelRelationInfo {
  name: string;
  relatedModel: string | null;
  type: ModelRelationType;
}

export type ModelRelationType =
  | "belongsTo"
  | "belongsToMany"
  | "hasMany"
  | "hasManyThrough"
  | "hasOne"
  | "hasOneThrough"
  | "morphMany"
  | "morphOne"
  | "morphTo"
  | "morphToMany"
  | "morphedByMany";

export interface RouteInfo {
  action: string | null;
  domain: string | null;
  filePath: string;
  methods: string[];
  middleware: string[];
  name: string | null;
  namePrefix: string;
  range: SourceRange;
  uri: string | null;
  uriPrefix: string;
}

export interface SourceRange {
  end: SourcePosition;
  start: SourcePosition;
}

export interface SourcePosition {
  character: number;
  line: number;
}

export interface BladeComponentInfo {
  filePath: string;
  name: string;
  props: string[];
  source: "anonymous" | "class";
  viewName: string;
}

export interface BladeViewInfo {
  components: string[];
  extends: string | null;
  filePath: string;
  includes: string[];
  name: string;
  props: string[];
  pushes?: string[];
  sections: string[];
  stacks?: string[];
  yields: string[];
}

export interface SchemaColumnInfo {
  filePath: string;
  modifiers: string[];
  name: string;
  tableName: string;
  type: string;
}

export interface SchemaTableInfo {
  columns: SchemaColumnInfo[];
  filePath: string;
  name: string;
}

export interface ValidationFieldInfo {
  field: string;
  rules: string[];
}

export interface ValidationRuleInfo {
  className: string | null;
  fields: ValidationFieldInfo[];
  filePath: string;
  namespace: string | null;
  source: "formRequest" | "inline";
}

export interface TranslationKeyInfo {
  filePath: string;
  key: string;
  locale: string;
  namespace: string | null;
  source: "json" | "php";
}

// Inertia page component under `resources/js/Pages` (or lowercase `pages`),
// addressed by its `Inertia::render('Users/Index')` name.
export interface InertiaPageInfo {
  filePath: string;
  name: string;
}

export interface ConfigKeyInfo {
  filePath: string;
  key: string;
  range: SourceRange;
  // Class referenced by the entry value (`Foo::class`), when present. Lets the
  // index answer questions like which model backs `auth.providers.users.model`.
  value?: string;
}

export interface EnvKeyInfo {
  filePath: string;
  key: string;
  range: SourceRange;
}

export interface AuthorizationInfo {
  ability: string;
  filePath: string;
  model: string | null;
  policy: string | null;
  source: "gate" | "policy" | "policyMap";
}

export interface ContainerBindingInfo {
  abstract: string;
  concrete: string | null;
  filePath: string;
  lifetime: "bind" | "instance" | "scoped" | "singleton";
}

export interface ControllerInfo {
  actionDetails?: ControllerActionInfo[];
  actions: string[];
  className: string;
  filePath: string;
  namespace: string | null;
}

export interface ControllerActionInfo {
  name: string;
  range: SourceRange;
}

export interface CommandInfo {
  className: string | null;
  description: string | null;
  filePath: string;
  name: string;
  namespace: string | null;
  signature: string;
  source: "closure" | "class";
}

export interface FacadeInfo {
  accessor: string | null;
  binding?: ContainerBindingInfo | null;
  className: string;
  filePath: string;
  namespace: string | null;
  source?: "alias" | "builtIn" | "custom";
  target?: string | null;
}

export interface MacroInfo {
  className: string;
  filePath: string;
  method: string;
}

export interface MiddlewareInfo {
  alias: string;
  className: string | null;
  filePath: string;
  range: SourceRange;
  source: "bootstrap" | "kernel";
}

export interface FactoryInfo {
  className: string;
  definitionFields: string[];
  filePath: string;
  model: string | null;
  namespace: string | null;
  states: string[];
}

export interface SeederInfo {
  calls: string[];
  className: string;
  filePath: string;
  namespace: string | null;
}

export interface LaravelArtifactInfo {
  className: string;
  constructorSignature?: string | null;
  filePath: string;
  kind: LaravelArtifactKind;
  namespace: string | null;
  related: string[];
}

export type LaravelArtifactKind =
  | "event"
  | "job"
  | "listener"
  | "mailable"
  | "notification"
  | "resource";

export interface ServiceProviderInfo {
  classFilePath: string | null;
  className: string;
  filePath: string;
  namespace: string | null;
  source: "bootstrap" | "class" | "composer" | "config";
}

const defaultLaravelFacadeAliases = new Map<string, string>([
  ["App", "Illuminate\\Support\\Facades\\App"],
  ["Arr", "Illuminate\\Support\\Arr"],
  ["Artisan", "Illuminate\\Support\\Facades\\Artisan"],
  ["Auth", "Illuminate\\Support\\Facades\\Auth"],
  ["Blade", "Illuminate\\Support\\Facades\\Blade"],
  ["Broadcast", "Illuminate\\Support\\Facades\\Broadcast"],
  ["Bus", "Illuminate\\Support\\Facades\\Bus"],
  ["Cache", "Illuminate\\Support\\Facades\\Cache"],
  ["Config", "Illuminate\\Support\\Facades\\Config"],
  ["Context", "Illuminate\\Support\\Facades\\Context"],
  ["Cookie", "Illuminate\\Support\\Facades\\Cookie"],
  ["Crypt", "Illuminate\\Support\\Facades\\Crypt"],
  ["Date", "Illuminate\\Support\\Facades\\Date"],
  ["DB", "Illuminate\\Support\\Facades\\DB"],
  ["Eloquent", "Illuminate\\Database\\Eloquent\\Model"],
  ["Event", "Illuminate\\Support\\Facades\\Event"],
  ["File", "Illuminate\\Support\\Facades\\File"],
  ["Gate", "Illuminate\\Support\\Facades\\Gate"],
  ["Hash", "Illuminate\\Support\\Facades\\Hash"],
  ["Http", "Illuminate\\Support\\Facades\\Http"],
  ["Lang", "Illuminate\\Support\\Facades\\Lang"],
  ["Log", "Illuminate\\Support\\Facades\\Log"],
  ["Mail", "Illuminate\\Support\\Facades\\Mail"],
  ["Notification", "Illuminate\\Support\\Facades\\Notification"],
  ["Password", "Illuminate\\Support\\Facades\\Password"],
  ["Process", "Illuminate\\Support\\Facades\\Process"],
  ["Queue", "Illuminate\\Support\\Facades\\Queue"],
  ["RateLimiter", "Illuminate\\Support\\Facades\\RateLimiter"],
  ["Redirect", "Illuminate\\Support\\Facades\\Redirect"],
  ["Request", "Illuminate\\Support\\Facades\\Request"],
  ["Response", "Illuminate\\Support\\Facades\\Response"],
  ["Route", "Illuminate\\Support\\Facades\\Route"],
  ["Schedule", "Illuminate\\Support\\Facades\\Schedule"],
  ["Schema", "Illuminate\\Support\\Facades\\Schema"],
  ["Session", "Illuminate\\Support\\Facades\\Session"],
  ["Storage", "Illuminate\\Support\\Facades\\Storage"],
  ["Str", "Illuminate\\Support\\Str"],
  ["URL", "Illuminate\\Support\\Facades\\URL"],
  ["Validator", "Illuminate\\Support\\Facades\\Validator"],
  ["View", "Illuminate\\Support\\Facades\\View"],
  ["Vite", "Illuminate\\Support\\Facades\\Vite"],
]);

const defaultFacadeAccessors = new Map<string, string>([
  ["App", "app"],
  ["Artisan", "artisan"],
  ["Auth", "auth"],
  ["Blade", "blade.compiler"],
  ["Cache", "cache"],
  ["Config", "config"],
  ["Cookie", "cookie"],
  ["Crypt", "encrypter"],
  ["DB", "db"],
  ["Event", "events"],
  ["File", "files"],
  ["Gate", "gate"],
  ["Hash", "hash"],
  ["Lang", "translator"],
  ["Log", "log"],
  ["Mail", "mailer"],
  ["Queue", "queue"],
  ["Redirect", "redirect"],
  ["Request", "request"],
  ["Response", "ResponseFactory"],
  ["Route", "router"],
  ["Schema", "db.schema"],
  ["Session", "session"],
  ["Storage", "filesystem"],
  ["URL", "url"],
  ["Validator", "validator"],
  ["View", "view"],
]);

export type LaravelIndexFileKind =
  | "authorization"
  | "artifact"
  | "bladeComponent"
  | "command"
  | "config"
  | "container"
  | "controller"
  | "env"
  | "factory"
  | "facade"
  | "inertiaPage"
  | "macro"
  | "middleware"
  | "model"
  | "provider"
  | "route"
  | "schema"
  | "seeder"
  | "translation"
  | "validation"
  | "view";

export interface FileSignature {
  mtimeMs: number;
  size: number;
}

export interface CachedIndexFile {
  entries:
    | BladeViewInfo[]
    | BladeComponentInfo[]
    | AuthorizationInfo[]
    | LaravelArtifactInfo[]
    | CommandInfo[]
    | ConfigKeyInfo[]
    | ContainerBindingInfo[]
    | ControllerInfo[]
    | EnvKeyInfo[]
    | FactoryInfo[]
    | FacadeInfo[]
    | InertiaPageInfo[]
    | MacroInfo[]
    | MiddlewareInfo[]
    | ServiceProviderInfo[]
    | string[]
    | ModelInfo[]
    | RouteInfo[]
    | SchemaTableInfo[]
    | SeederInfo[]
    | TranslationKeyInfo[]
    | ValidationRuleInfo[];
  filePath: string;
  kind: LaravelIndexFileKind;
  signature: FileSignature;
}

export interface LaravelIndexCache {
  files: Record<string, CachedIndexFile>;
  rootPath: string;
  version: number;
}

export interface LaravelIndexBuildStats {
  discoveredFiles: number;
  indexedFiles: number;
  removedFiles: number;
  reusedFiles: number;
}

export interface LaravelIndexBuildResult {
  cache: LaravelIndexCache;
  index: LaravelIndex;
  stats: LaravelIndexBuildStats;
}

export interface LaravelIndexBuildOptions {
  changedFilePaths?: string[];
}

export function emptyIndex(): LaravelIndex {
  return {
    authUserModel: null,
    authorization: [],
    artifacts: [],
    bladeComponents: [],
    bladeViews: [],
    commands: [],
    configEntries: [],
    configKeys: [],
    containerBindings: [],
    controllers: [],
    envEntries: [],
    envKeys: [],
    factories: [],
    facades: [],
    inertiaPages: [],
    macros: [],
    middleware: [],
    models: [],
    providers: [],
    routes: [],
    schemaTables: [],
    seeders: [],
    translationKeys: [],
    validationRules: [],
    views: [],
  };
}

export function emptyIndexCache(rootPath: string): LaravelIndexCache {
  return {
    files: {},
    rootPath,
    version: LARAVEL_INDEX_CACHE_VERSION,
  };
}

export async function buildLaravelIndex(
  rootPath: string,
  previousCache: LaravelIndexCache | null = null,
  options: LaravelIndexBuildOptions = {},
): Promise<LaravelIndexBuildResult> {
  const cache =
    previousCache?.rootPath === rootPath && previousCache.version === LARAVEL_INDEX_CACHE_VERSION
      ? previousCache
      : emptyIndexCache(rootPath);

  const partialRefresh = Boolean(options.changedFilePaths?.length && cache === previousCache);
  const candidates = partialRefresh
    ? collectChangedIndexFileCandidates(rootPath, options.changedFilePaths ?? [])
    : await collectIndexFileCandidates(rootPath);
  const nextFiles: Record<string, CachedIndexFile> = partialRefresh ? { ...cache.files } : {};
  const stats: LaravelIndexBuildStats = {
    discoveredFiles: candidates.length,
    indexedFiles: 0,
    removedFiles: 0,
    reusedFiles: 0,
  };

  for (const candidate of candidates) {
    const cacheKey = indexFileCacheKey(candidate);
    const signature = await fileSignature(candidate.filePath);
    if (!signature) {
      if (nextFiles[cacheKey]) {
        delete nextFiles[cacheKey];
        stats.removedFiles += 1;
      }
      continue;
    }

    const cached = cache.files[cacheKey];
    if (
      cached &&
      cached.kind === candidate.kind &&
      cached.signature.mtimeMs === signature.mtimeMs &&
      cached.signature.size === signature.size
    ) {
      nextFiles[cacheKey] = cached;
      stats.reusedFiles += 1;
      continue;
    }

    nextFiles[cacheKey] = {
      entries: await indexFile(rootPath, candidate.filePath, candidate.kind),
      filePath: candidate.filePath,
      kind: candidate.kind,
      signature,
    };
    stats.indexedFiles += 1;
  }

  if (!partialRefresh) {
    stats.removedFiles = Object.keys(cache.files).filter((filePath) => !nextFiles[filePath]).length;
  }

  const nextCache: LaravelIndexCache = {
    files: nextFiles,
    rootPath,
    version: LARAVEL_INDEX_CACHE_VERSION,
  };

  return {
    cache: nextCache,
    index: indexFromCache(nextCache),
    stats,
  };
}

export function indexFromCache(cache: LaravelIndexCache): LaravelIndex {
  const authorization: AuthorizationInfo[] = [];
  const artifacts: LaravelArtifactInfo[] = [];
  const routes: RouteInfo[] = [];
  const bladeComponents: BladeComponentInfo[] = [];
  const bladeViews: BladeViewInfo[] = [];
  const commands: CommandInfo[] = [];
  const configEntries: ConfigKeyInfo[] = [];
  const containerBindings: ContainerBindingInfo[] = [];
  const controllers: ControllerInfo[] = [];
  const envEntries: EnvKeyInfo[] = [];
  const factories: FactoryInfo[] = [];
  const facades: FacadeInfo[] = [];
  const inertiaPages: InertiaPageInfo[] = [];
  const macros: MacroInfo[] = [];
  const middleware: MiddlewareInfo[] = [];
  const models: ModelInfo[] = [];
  const providers: ServiceProviderInfo[] = [];
  const schemaTables: SchemaTableInfo[] = [];
  const seeders: SeederInfo[] = [];
  const translationKeys: TranslationKeyInfo[] = [];
  const validationRules: ValidationRuleInfo[] = [];

  for (const file of Object.values(cache.files)) {
    switch (file.kind) {
      case "authorization":
        authorization.push(...(file.entries as AuthorizationInfo[]));
        break;
      case "artifact":
        artifacts.push(...(file.entries as LaravelArtifactInfo[]));
        break;
      case "bladeComponent":
        bladeComponents.push(...(file.entries as BladeComponentInfo[]));
        break;
      case "command":
        commands.push(...(file.entries as CommandInfo[]));
        break;
      case "container":
        containerBindings.push(...(file.entries as ContainerBindingInfo[]));
        break;
      case "controller":
        controllers.push(...(file.entries as ControllerInfo[]));
        break;
      case "route":
        routes.push(...(file.entries as RouteInfo[]));
        break;
      case "view":
        bladeViews.push(...(file.entries as BladeViewInfo[]));
        break;
      case "config":
        configEntries.push(...normalizeConfigEntries(file.filePath, file.entries));
        break;
      case "env":
        envEntries.push(...normalizeEnvEntries(file.filePath, file.entries));
        break;
      case "factory":
        factories.push(...(file.entries as FactoryInfo[]));
        break;
      case "facade":
        facades.push(...(file.entries as FacadeInfo[]));
        break;
      case "inertiaPage":
        inertiaPages.push(...(file.entries as InertiaPageInfo[]));
        break;
      case "macro":
        macros.push(...(file.entries as MacroInfo[]));
        break;
      case "middleware":
        middleware.push(...(file.entries as MiddlewareInfo[]));
        break;
      case "model":
        models.push(...(file.entries as ModelInfo[]));
        break;
      case "provider":
        providers.push(...(file.entries as ServiceProviderInfo[]));
        break;
      case "schema":
        schemaTables.push(...(file.entries as SchemaTableInfo[]));
        break;
      case "seeder":
        seeders.push(...(file.entries as SeederInfo[]));
        break;
      case "translation":
        translationKeys.push(...(file.entries as TranslationKeyInfo[]));
        break;
      case "validation":
        validationRules.push(...(file.entries as ValidationRuleInfo[]));
        break;
    }
  }

  const uniqueBindings = sortBy(uniqueContainerBindings(containerBindings), (binding) => binding.abstract);

  return {
    authUserModel: configEntries.find((entry) => entry.key === "auth.providers.users.model")?.value ?? null,
    authorization: sortBy(uniqueAuthorization(authorization), (auth) => auth.ability),
    artifacts: sortBy(uniqueArtifacts(artifacts), (artifact) => `${artifact.kind}:${artifact.className}`),
    bladeComponents: mergeBladeComponents([...bladeComponentsFromViews(bladeViews), ...bladeComponents]),
    bladeViews: sortBy(bladeViews, (view) => view.name),
    commands: sortBy(uniqueCommands(commands), (command) => command.name),
    containerBindings: uniqueBindings,
    controllers: sortBy(uniqueControllers(controllers), (controller) => controller.className),
    routes: sortBy(routes, (route) => route.name ?? route.uri ?? ""),
    views: uniqueSorted(bladeViews.map((view) => view.name)),
    configEntries: sortBy(uniqueConfigEntries(configEntries), (entry) => entry.key),
    configKeys: uniqueSorted(configEntries.map((entry) => entry.key)),
    envEntries: sortBy(uniqueEnvEntries(envEntries), (entry) => entry.key),
    envKeys: uniqueSorted(envEntries.map((entry) => entry.key)),
    factories: sortBy(uniqueFactories(factories), (factory) => factory.className),
    facades: sortBy(
      resolveFacadeBindings(uniqueFacades([...builtInLaravelFacadeAliases(cache.rootPath), ...facades]), uniqueBindings),
      (facade) => facade.className,
    ),
    inertiaPages: sortBy(inertiaPages, (page) => page.name),
    macros: sortBy(uniqueMacros(macros), (macro) => `${macro.className}:${macro.method}`),
    middleware: sortBy(uniqueMiddleware(middleware), (entry) => entry.alias),
    models: sortBy(resolveCustomModelBuilders(applyModelTraits(models)), (model) => model.className),
    providers: sortBy(resolveServiceProviderClasses(providers), (provider) => provider.className),
    schemaTables: mergeSchemaTables(schemaTables),
    seeders: sortBy(uniqueSeeders(seeders), (seeder) => seeder.className),
    translationKeys: sortBy(uniqueTranslationKeys(translationKeys), (key) => key.key),
    validationRules: sortBy(validationRules, (rule) => `${rule.filePath}:${rule.className ?? ""}`),
  };
}

export function extractRouteNames(source: string): string[] {
  return uniqueSorted(
    extractRouteInfo("", source)
      .map((route) => route.name)
      .filter((name): name is string => Boolean(name)),
  );
}

export function extractRouteInfo(
  filePath: string,
  source: string,
  baseContext: Partial<RouteContext> = {},
): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const groupStack: ActiveRouteGroup[] = [];
  const initialContext = {
    ...emptyRouteContext,
    ...baseContext,
  };
  let braceDepth = 0;
  let offset = 0;

  for (const line of source.split(/\r?\n/)) {
    const inheritedContext = combineRouteContexts([initialContext, ...groupStack.map((group) => group.context)]);
    const groupContext = parseRouteGroupContext(line);
    const nextBraceDepth = braceDepth + braceDelta(line);

    if (groupContext) {
      groupStack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        context: groupContext,
      });
    }

    routes.push(...extractRoutesFromLine(filePath, source, line, offset, inheritedContext));

    braceDepth = nextBraceDepth;
    while (groupStack.length > 0 && braceDepth < groupStack[groupStack.length - 1].closeDepth) {
      groupStack.pop();
    }

    offset += line.length + 1;
  }

  return sortBy(routes, (route) => route.name ?? route.uri ?? "");
}

export function extractBladeViewInfo(
  rootPath: string,
  filePath: string,
  source: string,
): BladeViewInfo {
  return {
    components: extractBladeComponents(source),
    extends: firstBladeDirectiveString(source, "extends"),
    filePath,
    includes: extractBladeDirectiveStrings(source, [
      "each",
      "include",
      "includeFirst",
      "includeIf",
      "includeUnless",
      "includeWhen",
    ]),
    name: bladeViewName(rootPath, filePath),
    props: extractBladeProps(source),
    pushes: extractBladeDirectiveStrings(source, ["prepend", "push"]),
    sections: extractBladeDirectiveStrings(source, ["section"]),
    stacks: extractBladeDirectiveStrings(source, ["stack"]),
    yields: extractBladeDirectiveStrings(source, ["yield"]),
  };
}

export function extractBladeClassComponentInfo(
  rootPath: string,
  filePath: string,
  source: string,
): BladeComponentInfo[] {
  const className = phpClassName(source);
  if (!className || !isBladeClassComponentPath(rootPath, filePath)) {
    return [];
  }

  return [
    {
      filePath,
      name: bladeClassComponentName(rootPath, filePath),
      props: extractBladeClassProps(source),
      source: "class",
      viewName: componentViewNameFromRender(source) ?? `components.${bladeClassComponentName(rootPath, filePath)}`,
    },
  ];
}

function isBladeClassComponentPath(rootPath: string, filePath: string): boolean {
  return path.relative(rootPath, filePath).startsWith(path.join("app", "View", "Components") + path.sep);
}

function bladeClassComponentName(rootPath: string, filePath: string): string {
  return path
    .relative(path.join(rootPath, "app", "View", "Components"), filePath)
    .replace(/\.php$/, "")
    .split(path.sep)
    .map((part) => kebabCase(part))
    .join(".");
}

function componentViewNameFromRender(source: string): string | null {
  const renderMethod = /function\s+render\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/.exec(source);
  if (!renderMethod) {
    return null;
  }

  return /view\(\s*['"]([^'"]+)['"]/.exec(renderMethod[1])?.[1] ?? null;
}

function extractConstructorProps(source: string): string[] {
  const constructor = /function\s+__construct\s*\(([\s\S]*?)\)\s*(?::\s*[^{]+)?\{/.exec(source);
  if (!constructor) {
    return [];
  }

  return uniqueSorted(
    [...constructor[1].matchAll(/\$([A-Za-z_][A-Za-z0-9_]*)/g)]
      .map((match) => kebabCase(match[1]))
      .filter((prop) => !["attributes", "slot"].includes(prop)),
  );
}

function extractBladeClassProps(source: string): string[] {
  return uniqueSorted([...extractConstructorProps(source), ...extractPublicProperties(source)]);
}

function extractPublicProperties(source: string): string[] {
  return uniqueSorted(
    [...source.matchAll(/\bpublic\s+(?:readonly\s+)?(?:static\s+)?(?:[?\\A-Za-z_][\\A-Za-z0-9_|?<>[\]\s]*\s+)?\$([A-Za-z_][A-Za-z0-9_]*)/g)]
      .map((match) => kebabCase(match[1]))
      .filter((prop) => !["attributes", "component-name", "except", "slot"].includes(prop)),
  );
}

function bladeViewName(rootPath: string, filePath: string): string {
  return path
    .relative(path.join(rootPath, "resources", "views"), filePath)
    .replace(/\.blade\.php$/, "")
    .split(path.sep)
    .join(".");
}

function firstBladeDirectiveString(source: string, directive: string): string | null {
  return extractBladeDirectiveStrings(source, [directive])[0] ?? null;
}

function extractBladeDirectiveStrings(source: string, directives: string[]): string[] {
  const directivePattern = directives.map(escapeRegExp).join("|");
  const matches = [
    ...source.matchAll(new RegExp(`@(?:${directivePattern})\\s*\\(\\s*['"]([^'"]+)['"]`, "g")),
  ];

  return uniqueSorted(matches.map((match) => match[1]));
}

function extractBladeComponents(source: string): string[] {
  const components = new Set<string>();

  for (const match of source.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const name = match[1];
    if (!name.startsWith("slot")) {
      components.add(name.replace(/:/g, "."));
    }
  }

  for (const component of extractBladeDirectiveStrings(source, ["component"])) {
    components.add(component.replace(/^components\./, ""));
  }

  return uniqueSorted([...components]);
}

function extractBladeProps(source: string): string[] {
  return uniqueSorted([...extractBladeArrayDirectiveEntries(source, "props"), ...extractBladeArrayDirectiveEntries(source, "aware")]);
}

function extractBladeArrayDirectiveEntries(source: string, directive: string): string[] {
  const propsMatch = new RegExp(`@${directive}\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)`).exec(source);
  if (!propsMatch) {
    return [];
  }

  const props: string[] = [];
  for (const propEntry of splitTopLevelArgs(propsMatch[1])) {
    const keyMatch = /^\s*['"]([^'"]+)['"]\s*=>/.exec(propEntry);
    const valueMatch = /^\s*['"]([^'"]+)['"]\s*$/.exec(propEntry);
    if (keyMatch) {
      props.push(keyMatch[1]);
    } else if (valueMatch) {
      props.push(valueMatch[1]);
    }
  }

  return props;
}

interface ActiveRouteGroup {
  closeDepth: number;
  context: RouteContext;
}

interface RouteContext {
  controller: string | null;
  domain: string | null;
  middleware: string[];
  namePrefix: string;
  uriPrefix: string;
}

const emptyRouteContext: RouteContext = {
  controller: null,
  domain: null,
  middleware: [],
  namePrefix: "",
  uriPrefix: "",
};

function extractRoutesFromLine(
  filePath: string,
  source: string,
  line: string,
  lineOffset: number,
  context: RouteContext,
): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const routeRegex =
    /Route::(get|post|put|patch|delete|options|any|match|resource|apiResource)\s*\(([^)]*)\)([^;]*)/g;

  for (const match of line.matchAll(routeRegex)) {
    const method = match[1];
    const args = splitTopLevelArgs(match[2]);
    const chain = match[3] ?? "";
    const range = sourceRangeForOffset(source, lineOffset + (match.index ?? 0), match[0].length);

    if (method === "resource" || method === "apiResource") {
      routes.push(...resourceRoutes(filePath, args, chain, context, range, method === "apiResource"));
      continue;
    }

    routes.push(routeFromCall(filePath, method, args, chain, context, range));
  }

  return routes;
}

function routeFromCall(
  filePath: string,
  method: string,
  args: string[],
  chain: string,
  context: RouteContext,
  range: SourceRange,
): RouteInfo {
  const chainContext = parseRouteChainContext(chain);
  const combinedContext = combineRouteContexts([context, chainContext]);
  const routeName = stringArgForChainCall(chain, "name");
  const uri = method === "match" ? stringLiteral(args[1]) : stringLiteral(args[0]);
  const methodNames =
    method === "match" ? stringsInSource(args[0]).map((value) => value.toUpperCase()) : routeMethods(method);
  const actionArg = method === "match" ? args[2]?.trim() ?? null : args[1]?.trim() ?? null;
  const controllerAction = actionArg ? stringLiteral(actionArg) : null;

  return {
    action: combinedContext.controller && controllerAction ? `${combinedContext.controller}@${controllerAction}` : actionArg,
    domain: combinedContext.domain,
    filePath,
    methods: methodNames,
    middleware: uniqueSorted(combinedContext.middleware),
    name: routeName ? `${context.namePrefix}${routeName}` : null,
    namePrefix: context.namePrefix,
    range,
    uri: combineUri(context.uriPrefix, uri),
    uriPrefix: context.uriPrefix,
  };
}

function resourceRoutes(
  filePath: string,
  args: string[],
  chain: string,
  context: RouteContext,
  range: SourceRange,
  apiOnly: boolean,
): RouteInfo[] {
  const resourceName = stringLiteral(args[0]);
  if (!resourceName) {
    return [];
  }

  const controller = args[1]?.trim() ?? null;
  const chainContext = parseRouteChainContext(chain);
  const combinedContext = combineRouteContexts([context, chainContext]);
  const only = listArgForChainCall(chain, "only");
  const except = new Set(listArgForChainCall(chain, "except"));
  const allActions: ResourceRouteAction[] = apiOnly
    ? ["index", "store", "show", "update", "destroy"]
    : ["index", "create", "store", "show", "edit", "update", "destroy"];
  const allowedActions = only.length > 0 ? only : allActions;

  return allActions
    .filter((action) => allowedActions.includes(action))
    .filter((action) => !except.has(action))
    .map((action) => ({
      action: controller ? `${controller}@${action}` : null,
      domain: combinedContext.domain,
      filePath,
      methods: resourceMethods(action),
      middleware: uniqueSorted(combinedContext.middleware),
      name: `${combinedContext.namePrefix}${resourceName}.${action}`,
      namePrefix: combinedContext.namePrefix,
      range,
      uri: combineUri(combinedContext.uriPrefix, resourceUri(resourceName, action)),
      uriPrefix: combinedContext.uriPrefix,
    }));
}

type ResourceRouteAction =
  | "create"
  | "destroy"
  | "edit"
  | "index"
  | "show"
  | "store"
  | "update";

function parseRouteGroupContext(line: string): RouteContext | null {
  if (!/Route::/.test(line) || !/->group\s*\(/.test(line)) {
    return null;
  }

  const groupChain = line.slice(0, line.indexOf("->group"));
  return parseRouteChainContext(groupChain);
}

function parseRouteChainContext(chain: string): RouteContext {
  return {
    controller: serviceReference(firstArgForChainCall(chain, "controller")),
    domain: stringArgForChainCall(chain, "domain"),
    middleware: listArgForChainCall(chain, "middleware"),
    namePrefix: stringArgForChainCall(chain, "name") ?? "",
    uriPrefix: stringArgForChainCall(chain, "prefix") ?? "",
  };
}

function combineRouteContexts(contexts: RouteContext[]): RouteContext {
  return contexts.reduce<RouteContext>(
    (combined, context) => ({
      controller: context.controller ?? combined.controller,
      domain: context.domain ?? combined.domain,
      middleware: [...combined.middleware, ...context.middleware],
      namePrefix: `${combined.namePrefix}${context.namePrefix}`,
      uriPrefix: combineUri(combined.uriPrefix, context.uriPrefix) ?? "",
    }),
    emptyRouteContext,
  );
}

function stringArgForChainCall(source: string, callName: string): string | null {
  return stringLiteral(firstArgForChainCall(source, callName));
}

function firstArgForChainCall(source: string, callName: string): string | undefined {
  const match = new RegExp(`(?:->|Route::)${callName}\\s*\\(([^)]*)\\)`).exec(source);
  return match ? splitTopLevelArgs(match[1])[0] : undefined;
}

function listArgForChainCall(source: string, callName: string): string[] {
  const match = new RegExp(`(?:->|Route::)${callName}\\s*\\(([^)]*)\\)`).exec(source);
  if (!match) {
    return [];
  }

  return stringsInSource(match[1]);
}

function splitTopLevelArgs(source: string): string[] {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const previousChar = source[index - 1];

    if (quote) {
      current += char;
      if (char === quote && previousChar !== "\\") {
        quote = null;
      }
      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "[" || char === "(") {
      depth += 1;
    } else if (char === "]" || char === ")") {
      depth = Math.max(0, depth - 1);
    }

    if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

function stringLiteral(source: string | undefined): string | null {
  if (!source) {
    return null;
  }

  return stringsInSource(source)[0] ?? null;
}

function stringsInSource(source: string): string[] {
  return [...source.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function routeMethods(method: string): string[] {
  if (method === "any") {
    return ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
  }

  return [method.toUpperCase()];
}

function resourceMethods(action: ResourceRouteAction): string[] {
  switch (action) {
    case "index":
    case "create":
    case "show":
    case "edit":
      return ["GET"];
    case "store":
      return ["POST"];
    case "update":
      return ["PUT", "PATCH"];
    case "destroy":
      return ["DELETE"];
  }
}

function resourceUri(resourceName: string, action: ResourceRouteAction): string {
  const parameter = resourceName.split(".").at(-1)?.replace(/s$/, "") ?? resourceName;

  switch (action) {
    case "index":
    case "store":
      return resourceName;
    case "create":
      return `${resourceName}/create`;
    case "show":
    case "update":
    case "destroy":
      return `${resourceName}/{${parameter}}`;
    case "edit":
      return `${resourceName}/{${parameter}}/edit`;
  }
}

function combineUri(prefix: string | null, uri: string | null): string | null {
  const parts = [prefix, uri]
    .filter((part): part is string => Boolean(part))
    .map((part) => part.replace(/^\/+|\/+$/g, ""));
  const nonEmptyParts = parts.filter((part) => part.length > 0);

  if (nonEmptyParts.length === 0) {
    return uri;
  }

  return nonEmptyParts.join("/");
}

function sourceRangeForOffset(source: string, startOffset: number, length: number): SourceRange {
  return {
    end: sourcePositionForOffset(source, startOffset + length),
    start: sourcePositionForOffset(source, startOffset),
  };
}

function sourcePositionForOffset(source: string, offset: number): SourcePosition {
  const beforeOffset = source.slice(0, offset);
  const lines = beforeOffset.split(/\r?\n/);

  return {
    character: lines[lines.length - 1].length,
    line: lines.length - 1,
  };
}

function braceDelta(source: string): number {
  let delta = 0;
  let quote: string | null = null;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const previousChar = source[index - 1];

    if (quote) {
      if (char === quote && previousChar !== "\\") {
        quote = null;
      }
      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }

    if (char === "{") {
      delta += 1;
    } else if (char === "}") {
      delta -= 1;
    }
  }

  return delta;
}

export function extractConfigKeys(fileName: string, source: string): string[] {
  return extractConfigKeyInfo(fileName, source).map((entry) => entry.key);
}

export function extractConfigKeyInfo(fileName: string, source: string): ConfigKeyInfo[] {
  const baseName = path.basename(fileName, ".php");
  const entries: ConfigKeyInfo[] = [];
  const arrayStart = configRootArrayStart(source);

  if (arrayStart >= 0) {
    collectConfigArrayKeys(source, arrayStart + 1, [baseName], entries, fileName);
  }

  return sortBy(uniqueConfigEntries(entries), (entry) => entry.key).map((entry) =>
    entry.value ? { ...entry, value: resolvePhpClassReference(source, entry.value) } : entry,
  );
}

function configRootArrayStart(source: string): number {
  const returnMatch = /\breturn\b/.exec(source);
  if (returnMatch) {
    const arrayStart = skipConfigInsignificant(source, returnMatch.index + returnMatch[0].length);
    if (source[arrayStart] === "[") {
      return arrayStart;
    }
  }

  return source.indexOf("[");
}

function collectConfigArrayKeys(
  source: string,
  startIndex: number,
  prefix: string[],
  entries: ConfigKeyInfo[],
  filePath: string,
): number {
  let index = startIndex;

  while (index < source.length) {
    index = skipConfigInsignificant(source, index);
    if (source[index] === "]") {
      return index + 1;
    }
    if (source[index] === ",") {
      index += 1;
      continue;
    }

    const parsedKey = parseConfigString(source, index);
    if (!parsedKey) {
      index = skipConfigValue(source, index);
      continue;
    }

    index = skipConfigInsignificant(source, parsedKey.end);
    if (!source.startsWith("=>", index)) {
      index = parsedKey.end;
      continue;
    }

    index = skipConfigInsignificant(source, index + 2);
    const nextPrefix = [...prefix, parsedKey.value];
    const entry: ConfigKeyInfo = {
      filePath,
      key: nextPrefix.join("."),
      range: sourceRangeForOffset(source, parsedKey.end - parsedKey.value.length - 1, parsedKey.value.length),
    };
    entries.push(entry);

    if (source[index] === "[") {
      index = collectConfigArrayKeys(source, index + 1, nextPrefix, entries, filePath);
      continue;
    }

    const valueEnd = skipConfigValue(source, index);
    const classValue = /\\?([A-Za-z_][A-Za-z0-9_\\]*)::class/.exec(source.slice(index, valueEnd))?.[1];
    if (classValue) {
      entry.value = classValue;
    }
    index = valueEnd;
  }

  return index;
}

function parseConfigString(source: string, startIndex: number): { end: number; value: string } | null {
  const quote = source[startIndex];
  if (quote !== "'" && quote !== '"') {
    return null;
  }

  let value = "";
  for (let index = startIndex + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\\") {
      value += source[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (char === quote) {
      return { end: index + 1, value };
    }
    value += char;
  }

  return null;
}

// Skips whitespace and PHP comments so comment bodies (which routinely contain
// quotes, commas, and brackets) never influence key or value parsing.
function skipConfigInsignificant(source: string, startIndex: number): number {
  let index = startIndex;

  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (char === "/" && source[index + 1] === "*") {
      const commentEnd = source.indexOf("*/", index + 2);
      index = commentEnd === -1 ? source.length : commentEnd + 2;
      continue;
    }
    if ((char === "/" && source[index + 1] === "/") || char === "#") {
      const lineEnd = source.indexOf("\n", index);
      index = lineEnd === -1 ? source.length : lineEnd + 1;
      continue;
    }
    return index;
  }

  return index;
}

function skipConfigValue(source: string, startIndex: number): number {
  let index = startIndex;
  let bracketDepth = 0;
  let parenDepth = 0;

  while (index < source.length) {
    const insignificantEnd = skipConfigInsignificant(source, index);
    if (insignificantEnd !== index) {
      index = insignificantEnd;
      continue;
    }

    const parsedString = parseConfigString(source, index);
    if (parsedString) {
      index = parsedString.end;
      continue;
    }

    const char = source[index];
    if (char === "[") {
      bracketDepth += 1;
    } else if (char === "]") {
      if (bracketDepth === 0) {
        return index;
      }
      bracketDepth -= 1;
    } else if (char === "(") {
      parenDepth += 1;
    } else if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    } else if (char === "," && bracketDepth === 0 && parenDepth === 0) {
      return index + 1;
    }

    index += 1;
  }

  return index;
}

export function extractEnvKeys(source: string): string[] {
  return extractEnvKeyInfo("", source).map((entry) => entry.key);
}

export function extractEnvKeyInfo(filePath: string, source: string): EnvKeyInfo[] {
  const entries: EnvKeyInfo[] = [];
  let offset = 0;

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      offset += line.length + 1;
      continue;
    }

    const match = /^([A-Z0-9_]+)\s*=/.exec(trimmed);
    if (match) {
      const indentation = line.indexOf(trimmed);
      entries.push({
        filePath,
        key: match[1],
        range: sourceRangeForOffset(source, offset + indentation, match[1].length),
      });
    }
    offset += line.length + 1;
  }

  return sortBy(uniqueEnvEntries(entries), (entry) => entry.key);
}

export function extractModelInfo(filePath: string, source: string): ModelInfo | null {
  const className = phpClassName(source);
  if (!className) {
    return extractTraitInfo(filePath, source);
  }

  const relations = extractModelRelations(source);
  const customBuilderClass = extractCustomBuilderClass(source);
  const builderMethods = extractModelBuilderMethods(source);
  const staticMethods = extractStaticMethods(source);
  const usedTraits = extractClassBodyTraits(source);
  const methodDetails = extractMethodDetails(source);

  const accessorDetails = extractModelAccessors(source);
  const castDetails = extractModelCasts(source);
  const appends = extractStringArrayProperty(source, "appends");

  return {
    ...(accessorDetails.length > 0 ? { accessors: accessorDetails.map((accessor) => accessor.name), accessorDetails } : {}),
    ...(appends.length > 0 ? { appends } : {}),
    ...(builderMethods.length > 0 ? { builderMethods } : {}),
    ...(castDetails.length > 0 ? { castDetails } : {}),
    casts: castDetails.map((cast) => cast.name),
    className,
    ...(customBuilderClass
      ? {
          customBuilder: {
            className: customBuilderClass.split("\\").at(-1) ?? customBuilderClass,
            filePath: null,
            methods: [],
            namespace: namespaceFromClassReference(customBuilderClass),
          },
        }
      : {}),
    namespace: phpNamespace(source),
    filePath,
    fillable: extractStringArrayProperty(source, "fillable"),
    guarded: extractStringArrayProperty(source, "guarded"),
    ...(methodDetails.length > 0 ? { methodDetails } : {}),
    relations,
    relationships: relations.map((relation) => relation.name),
    scopes: extractModelScopes(source),
    ...(staticMethods.length > 0 ? { staticMethods } : {}),
    tableName: extractModelTableName(className, source),
    ...(usedTraits.length > 0 ? { usedTraits } : {}),
    ...(modelUsesSoftDeletes(source) ? { usesSoftDeletes: true } : {}),
  };
}

// Traits share the model scan so `scope*` helpers and static methods declared
// in `use`d traits can be merged into their consuming models later.
function extractTraitInfo(filePath: string, source: string): ModelInfo | null {
  const traitName = /\btrait\s+([A-Za-z_][A-Za-z0-9_]*)\b/.exec(source)?.[1] ?? null;
  if (!traitName) {
    return null;
  }

  const scopes = extractModelScopes(source);
  const staticMethods = extractStaticMethods(source);
  const usedTraits = extractClassBodyTraits(source);
  if (scopes.length === 0 && staticMethods.length === 0 && usedTraits.length === 0) {
    return null;
  }

  const methodDetails = extractMethodDetails(source);

  return {
    casts: [],
    className: traitName,
    filePath,
    fillable: [],
    guarded: [],
    isTrait: true,
    ...(methodDetails.length > 0 ? { methodDetails } : {}),
    namespace: phpNamespace(source),
    relations: [],
    relationships: [],
    scopes,
    ...(staticMethods.length > 0 ? { staticMethods } : {}),
    tableName: "",
    ...(usedTraits.length > 0 ? { usedTraits } : {}),
  };
}

// Collects virtual attributes: classic `getFooBarAttribute()` accessors and
// Laravel 9+ `fooBar(): Attribute` accessor methods, exposed as `foo_bar`.
function extractModelAccessors(source: string): ModelAccessorInfo[] {
  const accessors = new Map<string, ModelAccessorInfo>();
  const docProperties = modelDocPropertyTypes(source);

  for (const match of source.matchAll(/(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+get([A-Z][A-Za-z0-9]*)Attribute\s*\([^)]*\)\s*(?::\s*([?\\A-Za-z_][\\A-Za-z0-9_]*))?/g)) {
    const name = attributeNameFromStudly(match[2]);
    const methodName = `get${match[2]}Attribute`;
    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(methodName);
    accessors.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, methodName.length),
      returnType: normalizePhpType(match[3] ?? phpDocReturnType(match[1]) ?? docProperties.get(name)),
      source: "classic",
    });
  }

  for (const match of source.matchAll(
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+([a-z][A-Za-z0-9_]*)\s*\(\s*\)\s*:\s*\\?(?:Illuminate\\Database\\Eloquent\\Casts\\)?Attribute\b/g,
  )) {
    const name = attributeNameFromStudly(match[2]);
    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    accessors.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, match[2].length),
      returnType: normalizePhpType(phpDocReturnType(match[1]) ?? docProperties.get(name)),
      source: "attribute",
    });
  }

  return sortBy([...accessors.values()], (accessor) => accessor.name);
}

function attributeNameFromStudly(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function extractModelCasts(source: string): ModelCastInfo[] {
  const casts = new Map<string, string>();

  for (const entry of extractStringMapProperty(source, "casts")) {
    casts.set(entry.key, entry.value);
  }

  for (const block of methodReturnArrayBlocks(source, "casts")) {
    for (const entry of stringMapEntries(block)) {
      casts.set(entry.key, entry.value);
    }
  }

  return sortBy([...casts.entries()].map(([name, type]) => ({ name, type })), (cast) => cast.name);
}

function extractStringMapProperty(source: string, propertyName: string): Array<{ key: string; value: string }> {
  const propertyMatch = new RegExp(`\\bprotected\\s+\\$${propertyName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`).exec(
    source,
  );
  return propertyMatch ? stringMapEntries(propertyMatch[1]) : [];
}

function methodReturnArrayBlocks(source: string, methodName: string): string[] {
  const blocks: string[] = [];
  const regex = new RegExp(`function\\s+${methodName}\\s*\\([^)]*\\)\\s*(?::\\s*array)?\\s*\\{([\\s\\S]*?)\\}`, "g");

  for (const match of source.matchAll(regex)) {
    const returnMatch = /return\s*\[([\s\S]*?)\]\s*;/.exec(match[1]);
    if (returnMatch) {
      blocks.push(returnMatch[1]);
    }
  }

  return blocks;
}

function stringMapEntries(source: string): Array<{ key: string; value: string }> {
  return [...source.matchAll(/['"]([^'"]+)['"]\s*=>\s*['"]([^'"]+)['"]/g)]
    .map((match) => ({ key: match[1], value: match[2] }));
}

function phpDocReturnType(docblock: string | undefined): string | null {
  return docblock ? /@return\s+([^\s*]+)/.exec(docblock)?.[1] ?? null : null;
}

function modelDocPropertyTypes(source: string): Map<string, string> {
  const properties = new Map<string, string>();
  const classDocblock = /\/\*\*([\s\S]*?)\*\/\s*(?:(?:abstract|final)\s+)?class\s+[A-Za-z_][A-Za-z0-9_]*/.exec(source)?.[1];
  if (!classDocblock) {
    return properties;
  }

  for (const match of classDocblock.matchAll(/@property(?:-read|-write)?\s+([^\s*]+)\s+\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
    properties.set(match[2], match[1]);
  }

  return properties;
}

function normalizePhpType(type: string | null | undefined): string | null {
  return type?.replace(/^\?/, "").replace(/^\\/, "") ?? null;
}

function modelUsesSoftDeletes(source: string): boolean {
  return /\buse\s+[^;(]*\bSoftDeletes\b/.test(source);
}

function extractCustomBuilderClass(source: string): string | null {
  const methodMatch =
    /function\s+newEloquentBuilder\s*\([^)]*\)\s*(?::\s*([?\\A-Za-z_][\\A-Za-z0-9_]*))?\s*\{([\s\S]*?)\}/.exec(
      source,
    );
  if (!methodMatch) {
    return null;
  }

  const returnType = methodMatch[1]?.replace(/^\?/, "");
  if (returnType) {
    return resolveClassReference(source, returnType);
  }

  const bodyClass = /return\s+new\s+([\\A-Za-z_][\\A-Za-z0-9_]*)\s*\(/.exec(methodMatch[2])?.[1];
  return bodyClass ? resolveClassReference(source, bodyClass) : null;
}

function extractModelBuilderMethods(source: string): ModelBuilderMethodInfo[] {
  if (!/\bextends\s+(?:Builder|\\?Illuminate\\Database\\Eloquent\\Builder)\b/.test(source)) {
    return [];
  }

  const methods: ModelBuilderMethodInfo[] = [];
  for (const match of source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*([^{\n]+))?\s*\{/g)) {
    const name = match[1];
    if (name.startsWith("__")) {
      continue;
    }

    methods.push({
      name,
      returnType: match[2]?.trim() ?? null,
    });
  }

  return sortBy(uniqueModelBuilderMethods(methods), (method) => method.name);
}

function extractModelRelations(source: string): ModelRelationInfo[] {
  const relations: ModelRelationInfo[] = [];
  const methodRegex =
    /public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/g;

  for (const methodMatch of source.matchAll(methodRegex)) {
    const relationMatch =
      /\$this->(hasOne|hasMany|hasOneThrough|hasManyThrough|belongsTo|belongsToMany|morphOne|morphMany|morphTo|morphToMany|morphedByMany)\s*\(([^)]*)\)/.exec(
        methodMatch[2],
      );
    if (!relationMatch) {
      continue;
    }

    relations.push({
      name: methodMatch[1],
      relatedModel: relationClassFromArguments(relationMatch[2]),
      type: relationMatch[1] as ModelRelationType,
    });
  }

  return sortBy(uniqueModelRelations(relations), (relation) => relation.name);
}

function relationClassFromArguments(argumentsSource: string): string | null {
  return /([A-Za-z_\\][A-Za-z0-9_\\]*)::class/.exec(argumentsSource)?.[1] ?? null;
}

function extractModelScopes(source: string): string[] {
  const scopes = new Set<string>();

  for (const match of source.matchAll(/\bfunction\s+scope([A-Z][A-Za-z0-9_]*)\s*\(/g)) {
    scopes.add(uncapitalize(match[1]));
  }

  const attributeScopeRegex =
    /#\[\s*(?:\\?Illuminate\\Database\\Eloquent\\Attributes\\)?Scope\s*\]\s*(?:public|protected)\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  for (const match of source.matchAll(attributeScopeRegex)) {
    scopes.add(match[1]);
  }

  return uniqueSorted([...scopes]);
}

// Static methods declared on a model are called with the same `Model::name()`
// syntax as dynamic scope forwarding, so they must be indexed to avoid
// misreporting them as unknown scopes.
function extractStaticMethods(source: string): string[] {
  const methods = new Set<string>();

  for (const match of source.matchAll(/((?:\b(?:abstract|final|private|protected|public|static)\s+)+)function\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    if (/\bstatic\b/.test(match[1]) && !match[2].startsWith("__")) {
      methods.add(match[2]);
    }
  }

  return uniqueSorted([...methods]);
}

// Records every named method declaration with its position so navigation can
// jump to the method instead of the top of the file.
function extractMethodDetails(source: string): ModelMethodInfo[] {
  const methods = new Map<string, ModelMethodInfo>();

  for (const match of source.matchAll(/\bfunction\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const name = match[1];
    if (name.startsWith("__") || methods.has(name)) {
      continue;
    }

    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(name);
    methods.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, name.length),
    });
  }

  return sortBy([...methods.values()], (method) => method.name);
}

// Collects `use TraitName;` statements inside a class or trait body, resolved
// against the file's imports. Closure `function () use ($x)` captures never
// match because they follow `)` and reference `$`-prefixed variables.
function extractClassBodyTraits(source: string): string[] {
  const declaration = /\b(?:class|trait)\s+[A-Za-z_][A-Za-z0-9_]*[^{]*\{/.exec(source);
  if (!declaration) {
    return [];
  }

  // Only the header before the declaration feeds import resolution; class-body
  // `use Trait;` statements would otherwise shadow the file's imports.
  const header = source.slice(0, declaration.index);
  const body = source.slice(declaration.index + declaration[0].length);
  const traits = new Set<string>();
  for (const match of body.matchAll(/(?:^|[;{}\n])\s*use\s+([A-Za-z_\\][A-Za-z0-9_\\]*(?:\s*,\s*[A-Za-z_\\][A-Za-z0-9_\\]*)*)\s*(?:;|\{)/g)) {
    for (const name of match[1].split(",")) {
      traits.add(resolvePhpClassReference(header, name.trim()));
    }
  }

  return uniqueSorted([...traits]);
}

function phpClassName(source: string): string | null {
  return /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/.exec(source)?.[1] ?? null;
}

function phpNamespace(source: string): string | null {
  return /\bnamespace\s+([^;]+);/.exec(source)?.[1].trim() ?? null;
}

function phpImports(source: string): Map<string, string> {
  const imports = new Map<string, string>();

  for (const match of source.matchAll(/\buse\s+([^;]+);/g)) {
    const statement = match[1].trim();
    if (statement.includes("{") || /^function\s|^const\s/.test(statement)) {
      continue;
    }

    const aliasMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/i.exec(statement);
    const className = aliasMatch ? aliasMatch[1] : statement;
    const alias = aliasMatch?.[2] ?? className.split("\\").at(-1);
    if (alias) {
      imports.set(alias, className);
    }
  }

  return imports;
}

function resolveClassReference(source: string, classReference: string): string {
  const normalized = classReference.replace(/^\\/, "");
  if (normalized.includes("\\")) {
    return normalized;
  }

  return phpImports(source).get(normalized) ?? normalized;
}

function namespaceFromClassReference(classReference: string): string | null {
  const normalized = classReference.replace(/^\\/, "");
  const segments = normalized.split("\\");
  if (segments.length <= 1) {
    return null;
  }

  return segments.slice(0, -1).join("\\");
}

// Merges `scope*` methods and static methods declared in `use`d traits into
// their consuming models, so trait-provided scopes behave like ones declared
// on the model class itself. Trait entries are consumed here and do not stay
// in the final model list.
function applyModelTraits(models: ModelInfo[]): ModelInfo[] {
  const classModels = models.filter((model) => !model.isTrait);
  const traitByName = new Map<string, ModelInfo>();

  for (const trait of models) {
    if (!trait.isTrait) {
      continue;
    }

    traitByName.set(trait.className, trait);
    if (trait.namespace) {
      traitByName.set(`${trait.namespace}\\${trait.className}`, trait);
    }
  }

  if (traitByName.size === 0) {
    return classModels;
  }

  return classModels.map((model) => {
    const members = collectTraitMembers(model.usedTraits, traitByName);
    if (members.scopes.length === 0 && members.staticMethods.length === 0) {
      return model;
    }

    const scopeDetails = members.scopes.filter((scope) => !model.scopes.includes(scope.name));
    const staticMethods = uniqueSorted([...(model.staticMethods ?? []), ...members.staticMethods]);

    return {
      ...model,
      ...(scopeDetails.length > 0 ? { scopeDetails } : {}),
      scopes: uniqueSorted([...model.scopes, ...members.scopes.map((scope) => scope.name)]),
      ...(staticMethods.length > 0 ? { staticMethods } : {}),
    };
  });
}

function collectTraitMembers(
  usedTraits: string[] | undefined,
  traitByName: Map<string, ModelInfo>,
  visited: Set<string> = new Set(),
): { scopes: ModelScopeInfo[]; staticMethods: string[] } {
  const scopes: ModelScopeInfo[] = [];
  const staticMethods: string[] = [];

  for (const reference of usedTraits ?? []) {
    const trait = traitByName.get(reference) ?? traitByName.get(reference.split("\\").at(-1) ?? reference);
    if (!trait || visited.has(trait.filePath)) {
      continue;
    }

    visited.add(trait.filePath);
    scopes.push(...trait.scopes.map((name) => ({ filePath: trait.filePath, name })));
    staticMethods.push(...(trait.staticMethods ?? []));

    const nested = collectTraitMembers(trait.usedTraits, traitByName, visited);
    scopes.push(...nested.scopes);
    staticMethods.push(...nested.staticMethods);
  }

  return { scopes, staticMethods };
}

function resolveCustomModelBuilders(models: ModelInfo[]): ModelInfo[] {
  const builderByName = new Map<string, ModelInfo>();

  for (const model of models) {
    if (!model.builderMethods?.length) {
      continue;
    }

    builderByName.set(model.className, model);
    if (model.namespace) {
      builderByName.set(`${model.namespace}\\${model.className}`, model);
    }
  }

  return models.map((model) => {
    if (!model.customBuilder) {
      return model;
    }

    const fullBuilderName = model.customBuilder.namespace
      ? `${model.customBuilder.namespace}\\${model.customBuilder.className}`
      : model.customBuilder.className;
    const builder = builderByName.get(fullBuilderName) ?? builderByName.get(model.customBuilder.className);

    return {
      ...model,
      customBuilder: {
        ...model.customBuilder,
        filePath: builder?.filePath ?? model.customBuilder.filePath,
        methods: builder?.builderMethods ?? model.customBuilder.methods,
        namespace: builder?.namespace ?? model.customBuilder.namespace,
      },
    };
  });
}

function resolveServiceProviderClasses(providers: ServiceProviderInfo[]): ServiceProviderInfo[] {
  const classProviders = new Map<string, ServiceProviderInfo>();

  for (const provider of providers) {
    if (provider.source !== "class" || !provider.classFilePath) {
      continue;
    }

    classProviders.set(provider.className, provider);
    if (provider.namespace) {
      classProviders.set(`${provider.namespace}\\${provider.className}`, provider);
    }
  }

  return uniqueServiceProviders(
    providers.map((provider) => {
      const fullClassName = provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
      const classProvider = classProviders.get(fullClassName) ?? classProviders.get(provider.className);
      return {
        ...provider,
        classFilePath: provider.classFilePath ?? classProvider?.classFilePath ?? null,
      };
    }),
  );
}

export function extractValidationRules(filePath: string, source: string): ValidationRuleInfo[] {
  const className = phpClassName(source);
  const namespace = phpNamespace(source);
  const rules: ValidationRuleInfo[] = [];

  if (/extends\s+FormRequest\b/.test(source)) {
    const formRequestFields = extractFormRequestRuleFields(source);
    if (formRequestFields.length > 0) {
      rules.push({
        className,
        fields: formRequestFields,
        filePath,
        namespace,
        source: "formRequest",
      });
    }
  }

  for (const fields of extractInlineValidationRuleFields(source)) {
    if (fields.length > 0) {
      rules.push({
        className,
        fields,
        filePath,
        namespace,
        source: "inline",
      });
    }
  }

  return rules;
}

export function extractTranslationKeys(rootPath: string, filePath: string, source: string): TranslationKeyInfo[] {
  const context = translationFileContext(rootPath, filePath);
  if (!context) {
    return [];
  }

  if (filePath.endsWith(".json")) {
    return extractJsonTranslationKeys(filePath, source, context.locale);
  }

  return extractPhpTranslationKeys(filePath, source, context.locale, context.group);
}

export function extractContainerBindings(filePath: string, source: string): ContainerBindingInfo[] {
  const bindings: ContainerBindingInfo[] = [];
  const bindingRegex =
    /(?:\$this->app|app\(\)|App::getFacadeRoot\(\))->(bind|singleton|scoped|instance)\(\s*([^,\)]+)(?:,\s*([^\)]+))?\)/g;

  for (const match of source.matchAll(bindingRegex)) {
    const abstract = serviceReference(match[2]);
    if (!abstract) {
      continue;
    }

    bindings.push({
      abstract,
      concrete: serviceReference(match[3]),
      filePath,
      lifetime: match[1] as ContainerBindingInfo["lifetime"],
    });
  }

  return sortBy(bindings, (binding) => binding.abstract);
}

export function extractControllerInfo(filePath: string, source: string): ControllerInfo[] {
  const className = phpClassName(source);
  if (!className) {
    return [];
  }

  const actionDetails = extractControllerActions(source);

  return [
    {
      actionDetails,
      actions: actionDetails.map((action) => action.name),
      className,
      filePath,
      namespace: phpNamespace(source),
    },
  ];
}

function extractControllerActions(source: string): ControllerActionInfo[] {
  const ignored = new Set(["__construct", "authorize", "middleware", "validate", "validateWithBag"]);

  return sortBy(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)]
      .map((match) => {
        const name = match[1];
        const matchStart = match.index ?? 0;
        const nameStart = matchStart + match[0].lastIndexOf(name);
        return {
          name,
          range: sourceRangeForOffset(source, nameStart, name.length),
        };
      })
      .filter((action) => !ignored.has(action.name)),
    (action) => action.name,
  );
}

export function extractAuthorizationInfo(filePath: string, source: string): AuthorizationInfo[] {
  const entries: AuthorizationInfo[] = [];

  for (const match of source.matchAll(/Gate::define\(\s*['"]([^'"]+)['"]/g)) {
    entries.push({
      ability: match[1],
      filePath,
      model: null,
      policy: null,
      source: "gate",
    });
  }

  for (const match of source.matchAll(/Gate::policy\(\s*([^,]+),\s*([^\)]+)\)/g)) {
    entries.push({
      ability: policyAbilityName(serviceReference(match[2]) ?? match[2].trim()),
      filePath,
      model: serviceReference(match[1]),
      policy: serviceReference(match[2]),
      source: "policyMap",
    });
  }

  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*=>\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    entries.push({
      ability: policyAbilityName(match[2]),
      filePath,
      model: match[1],
      policy: match[2],
      source: "policyMap",
    });
  }

  const className = phpClassName(source);
  if (className?.endsWith("Policy")) {
    for (const method of extractPolicyMethods(source)) {
      entries.push({
        ability: method,
        filePath,
        model: null,
        policy: className,
        source: "policy",
      });
    }
  }

  return sortBy(entries, (entry) => entry.ability);
}

export function extractFacadeInfo(filePath: string, source: string): FacadeInfo[] {
  if (filePath.endsWith(path.join("config", "app.php"))) {
    return extractFacadeAliasInfo(filePath, source);
  }

  const className = phpClassName(source);
  if (!className || !/extends\s+Facade\b/.test(source)) {
    return [];
  }

  return [
    {
      accessor: extractFacadeAccessor(source),
      binding: null,
      className,
      filePath,
      namespace: phpNamespace(source),
    },
  ];
}

function extractFacadeAliasInfo(filePath: string, source: string): FacadeInfo[] {
  const facades: FacadeInfo[] = [];

  for (const block of facadeAliasBlocks(source)) {
    for (const match of block.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*=>\s*([^,\]\n]+)/g)) {
      const target = serviceReference(match[2]) ?? match[2].trim();
      if (!/^[A-Za-z_\\][A-Za-z0-9_\\]*$/.test(target)) {
        continue;
      }

      facades.push({
        accessor: defaultFacadeAccessors.get(match[1]) ?? null,
        binding: null,
        className: match[1],
        filePath,
        namespace: null,
        source: "alias",
        target,
      });
    }
  }

  return sortBy(facades, (facade) => facade.className);
}

function facadeAliasBlocks(source: string): string[] {
  return [...source.matchAll(/['"]aliases['"]\s*=>\s*(?:[^[]*?\(\s*)?\[([\s\S]*?)\]/g)].map(
    (match) => match[1],
  );
}

function builtInLaravelFacadeAliases(rootPath: string): FacadeInfo[] {
  return [...defaultLaravelFacadeAliases.entries()].map(([className, target]) => ({
    accessor: defaultFacadeAccessors.get(className) ?? null,
    binding: null,
    className,
    filePath: facadeTargetFilePath(rootPath, target),
    namespace: null,
    source: "builtIn" as const,
    target,
  }));
}

function facadeTargetFilePath(rootPath: string, target: string): string {
  if (target.startsWith("Illuminate\\")) {
    return path.join(rootPath, "vendor", "laravel", "framework", "src", `${target.replace(/\\/g, path.sep)}.php`);
  }

  return path.join(rootPath, `${target.replace(/\\/g, path.sep)}.php`);
}

export function extractMacroInfo(filePath: string, source: string): MacroInfo[] {
  const macros: MacroInfo[] = [];

  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::macro\(\s*['"]([^'"]+)['"]/g)) {
    macros.push({
      className: match[1],
      filePath,
      method: match[2],
    });
  }

  return sortBy(macros, (macro) => `${macro.className}:${macro.method}`);
}

export function extractMiddlewareInfo(filePath: string, source: string): MiddlewareInfo[] {
  const entries: MiddlewareInfo[] = [];
  const sourceKind: MiddlewareInfo["source"] = filePath.endsWith(path.join("bootstrap", "app.php"))
    ? "bootstrap"
    : "kernel";

  for (const block of middlewareAliasBlocks(source)) {
    for (const match of block.content.matchAll(/['"]([^'"]+)['"]\s*=>\s*([^,\]\n]+)/g)) {
      entries.push({
        alias: match[1],
        className: serviceReference(match[2]) ?? match[2].trim(),
        filePath,
        range: sourceRangeForOffset(source, block.offset + (match.index ?? 0) + 1, match[1].length),
        source: sourceKind,
      });
    }
  }

  for (const group of middlewareGroupEntries(source)) {
    entries.push({
      alias: group.name,
      className: null,
      filePath,
      range: sourceRangeForOffset(source, group.offset, group.name.length),
      source: sourceKind,
    });
  }

  return sortBy(uniqueMiddleware(entries), (entry) => entry.alias);
}

export function extractServiceProviderInfo(filePath: string, source: string): ServiceProviderInfo[] {
  if (filePath.endsWith("composer.json")) {
    return extractComposerServiceProviders(filePath, source);
  }

  const providers: ServiceProviderInfo[] = [];
  const className = phpClassName(source);
  if (className && /\bextends\s+(?:ServiceProvider|\\?Illuminate\\Support\\ServiceProvider)\b/.test(source)) {
    providers.push({
      classFilePath: filePath,
      className,
      filePath,
      namespace: phpNamespace(source),
      source: "class",
    });
  }

  const sourceKind = serviceProviderRegistrationSource(filePath);
  if (sourceKind) {
    const registrationSource = sourceKind === "config" ? configProvidersSource(source) : source;
    for (const classReference of classConstantsInSource(registrationSource)) {
      providers.push({
        classFilePath: null,
        className: classReference.split("\\").at(-1) ?? classReference,
        filePath,
        namespace: namespaceFromClassReference(classReference),
        source: sourceKind,
      });
    }
  }

  return sortBy(uniqueServiceProviders(providers), (provider) => `${provider.source}:${provider.className}`);
}

function extractComposerServiceProviders(filePath: string, source: string): ServiceProviderInfo[] {
  try {
    const composer = JSON.parse(source) as {
      extra?: {
        laravel?: {
          providers?: unknown;
        };
      };
    };
    const providers = composer.extra?.laravel?.providers;
    if (!Array.isArray(providers)) {
      return [];
    }

    return providers
      .filter((provider): provider is string => typeof provider === "string")
      .map((provider) => ({
        classFilePath: null,
        className: provider.split("\\").at(-1) ?? provider,
        filePath,
        namespace: namespaceFromClassReference(provider),
        source: "composer" as const,
      }));
  } catch {
    return [];
  }
}

function serviceProviderRegistrationSource(filePath: string): ServiceProviderInfo["source"] | null {
  if (filePath.endsWith(path.join("bootstrap", "providers.php"))) {
    return "bootstrap";
  }
  if (filePath.endsWith(path.join("config", "app.php"))) {
    return "config";
  }

  return null;
}

function configProvidersSource(source: string): string {
  return /\b['"]providers['"]\s*=>\s*\[([\s\S]*?)\]\s*,?/m.exec(source)?.[1] ?? "";
}

function classConstantsInSource(source: string): string[] {
  return uniqueSorted([...source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)].map((match) => match[1]));
}

function middlewareAliasBlocks(source: string): Array<{ content: string; offset: number }> {
  const blocks: Array<{ content: string; offset: number }> = [];

  for (const match of source.matchAll(/->alias\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    blocks.push({ content: match[1], offset: (match.index ?? 0) + match[0].indexOf(match[1]) });
  }
  for (const match of source.matchAll(/\$(?:middlewareAliases|routeMiddleware)\s*=\s*\[([\s\S]*?)\]\s*;/g)) {
    blocks.push({ content: match[1], offset: (match.index ?? 0) + match[0].indexOf(match[1]) });
  }

  return blocks;
}

// Middleware group names are navigable and diagnosable just like aliases:
// `$middlewareGroups` keys in HTTP kernels and `$middleware->(append|prepend)?
// group(...)` registrations in Laravel 11+ bootstrap files.
function middlewareGroupEntries(source: string): Array<{ name: string; offset: number }> {
  const groups: Array<{ name: string; offset: number }> = [];

  for (const block of source.matchAll(/\$middlewareGroups\s*=\s*\[([\s\S]*?)\]\s*;/g)) {
    const content = block[1];
    const contentOffset = (block.index ?? 0) + block[0].indexOf(content);
    for (const match of content.matchAll(/['"]([^'"]+)['"]\s*=>\s*\[/g)) {
      groups.push({ name: match[1], offset: contentOffset + (match.index ?? 0) + 1 });
    }
  }

  for (const match of source.matchAll(/\$middleware\s*->\s*(?:group|appendToGroup|prependToGroup)\(\s*['"]([^'"]+)['"]/g)) {
    groups.push({ name: match[1], offset: (match.index ?? 0) + match[0].lastIndexOf(match[1]) });
  }

  return groups;
}

export function extractFactoryInfo(filePath: string, source: string): FactoryInfo[] {
  const className = phpClassName(source);
  if (!className || !/extends\s+Factory\b/.test(source)) {
    return [];
  }

  return [
    {
      className,
      definitionFields: extractFactoryDefinitionFields(source),
      filePath,
      model: extractFactoryModel(source),
      namespace: phpNamespace(source),
      states: extractFactoryStates(source),
    },
  ];
}

export function extractSeederInfo(filePath: string, source: string): SeederInfo[] {
  const className = phpClassName(source);
  if (!className || !/extends\s+Seeder\b/.test(source)) {
    return [];
  }

  return [
    {
      calls: extractSeederCalls(source),
      className,
      filePath,
      namespace: phpNamespace(source),
    },
  ];
}

export function extractCommandInfo(filePath: string, source: string): CommandInfo[] {
  const commands: CommandInfo[] = [];
  const className = phpClassName(source);
  const namespace = phpNamespace(source);
  const signature = classCommandSignature(source);

  if (signature) {
    commands.push({
      className,
      description: classCommandDescription(source),
      filePath,
      name: commandNameFromSignature(signature),
      namespace,
      signature,
      source: "class",
    });
  }

  for (const match of source.matchAll(/(?:Artisan|Schedule)::command\(\s*['"]([^'"]+)['"]/g)) {
    const closureSignature = match[1].trim();
    commands.push({
      className: null,
      description: null,
      filePath,
      name: commandNameFromSignature(closureSignature),
      namespace: null,
      signature: closureSignature,
      source: "closure",
    });
  }

  return sortBy(uniqueCommands(commands), (command) => command.name);
}

function classCommandSignature(source: string): string | null {
  return /\bprotected\s+\$signature\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source)?.[1].trim() ?? null;
}

function classCommandDescription(source: string): string | null {
  return /\bprotected\s+\$description\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source)?.[1].trim() ?? null;
}

function commandNameFromSignature(signature: string): string {
  return signature.split(/\s+/)[0] ?? signature;
}

export function extractLaravelArtifacts(
  rootPath: string,
  filePath: string,
  source: string,
): LaravelArtifactInfo[] {
  const className = phpClassName(source);
  const kind = artifactKindForPath(rootPath, filePath, source);
  if (!className || !kind) {
    return [];
  }

  const constructorSignature = extractConstructorSignature(source);

  return [
    {
      className,
      ...(constructorSignature ? { constructorSignature } : {}),
      filePath,
      kind,
      namespace: phpNamespace(source),
      related: extractArtifactRelatedClasses(source),
    },
  ];
}

function extractConstructorSignature(source: string): string | null {
  const match = /\bfunction\s+__construct\s*\(([\s\S]*?)\)/.exec(source);
  if (!match) {
    return null;
  }

  return match[1].replace(/\s+/g, " ").trim();
}

function artifactKindForPath(
  rootPath: string,
  filePath: string,
  source: string,
): LaravelArtifactKind | null {
  const relativePath = path.relative(rootPath, filePath);

  if (relativePath.startsWith(path.join("app", "Http", "Resources") + path.sep)) {
    return "resource";
  }
  if (relativePath.startsWith(path.join("app", "Events") + path.sep)) {
    return "event";
  }
  if (relativePath.startsWith(path.join("app", "Listeners") + path.sep)) {
    return "listener";
  }
  if (relativePath.startsWith(path.join("app", "Jobs") + path.sep)) {
    return "job";
  }
  if (relativePath.startsWith(path.join("app", "Mail") + path.sep)) {
    return "mailable";
  }
  if (relativePath.startsWith(path.join("app", "Notifications") + path.sep)) {
    return "notification";
  }
  if (/extends\s+JsonResource\b|extends\s+ResourceCollection\b/.test(source)) {
    return "resource";
  }
  if (/extends\s+Mailable\b/.test(source)) {
    return "mailable";
  }
  if (/extends\s+Notification\b/.test(source)) {
    return "notification";
  }
  if (/implements\s+ShouldQueue\b/.test(source)) {
    return "job";
  }

  return null;
}

function extractArtifactRelatedClasses(source: string): string[] {
  const related = new Set<string>();

  for (const match of source.matchAll(/function\s+handle\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)\s+\$/g)) {
    related.add(match[1]);
  }
  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::dispatch\(/g)) {
    related.add(match[1]);
  }
  for (const match of source.matchAll(/new\s+([A-Za-z_\\][A-Za-z0-9_\\]*)\s*\(/g)) {
    related.add(match[1]);
  }

  return uniqueSorted([...related]);
}

function extractFactoryModel(source: string): string | null {
  const modelProperty = /\bprotected\s+\$model\s*=\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*;/.exec(
    source,
  );
  if (modelProperty) {
    return modelProperty[1];
  }

  const generic = /@extends\s+Factory<([A-Za-z_\\][A-Za-z0-9_\\]*)>/.exec(source);
  return generic?.[1] ?? null;
}

function extractFactoryDefinitionFields(source: string): string[] {
  const definitionMethod =
    /function\s+definition\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/.exec(source);
  if (!definitionMethod) {
    return [];
  }

  const returnArray = /return\s*\[([\s\S]*?)\]\s*;/.exec(definitionMethod[1]);
  return returnArray ? extractArrayKeys(returnArray[1]) : [];
}

function extractFactoryStates(source: string): string[] {
  const ignored = new Set(["configure", "definition"]);
  return uniqueSorted(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{/g)]
      .map((match) => match[1])
      .filter((method) => !ignored.has(method)),
  );
}

function extractSeederCalls(source: string): string[] {
  const calls = new Set<string>();

  for (const match of source.matchAll(/->call\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)/g)) {
    calls.add(match[1]);
  }

  for (const match of source.matchAll(/->call\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    for (const classMatch of match[1].matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
      calls.add(classMatch[1]);
    }
  }

  return uniqueSorted([...calls]);
}

function extractFacadeAccessor(source: string): string | null {
  const methodMatch = /function\s+getFacadeAccessor\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\}/.exec(
    source,
  );
  if (!methodMatch) {
    return null;
  }

  const returnMatch = /return\s+([^;]+);/.exec(methodMatch[1]);
  return returnMatch ? serviceReference(returnMatch[1]) : null;
}

function extractPolicyMethods(source: string): string[] {
  const ignored = new Set(["before", "after"]);
  return uniqueSorted(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)]
      .map((match) => match[1])
      .filter((method) => !ignored.has(method)),
  );
}

function policyAbilityName(policy: string): string {
  return policy
    .split("\\")
    .at(-1)
    ?.replace(/Policy$/, "")
    .replace(/^([A-Z])/, (match) => match.toLowerCase()) ?? policy;
}

function serviceReference(source: string | undefined): string | null {
  if (!source) {
    return null;
  }

  const classMatch = /([A-Za-z_\\][A-Za-z0-9_\\]*)::class/.exec(source);
  if (classMatch) {
    return classMatch[1];
  }

  return stringLiteral(source);
}

function extractJsonTranslationKeys(
  filePath: string,
  source: string,
  locale: string,
): TranslationKeyInfo[] {
  try {
    const parsed = JSON.parse(source) as Record<string, unknown>;
    return Object.keys(parsed).map((key) => ({
      filePath,
      key,
      locale,
      namespace: null,
      source: "json",
    }));
  } catch {
    return [];
  }
}

function extractPhpTranslationKeys(
  filePath: string,
  source: string,
  locale: string,
  group: string | null,
): TranslationKeyInfo[] {
  if (!group) {
    return [];
  }

  return extractPhpArrayKeys(source).map((key) => ({
    filePath,
    key: `${group}.${key}`,
    locale,
    namespace: null,
    source: "php",
  }));
}

function extractPhpArrayKeys(source: string): string[] {
  const keys: string[] = [];
  const stack: string[] = [];
  const keyRegex = /(['"])([^'"]+)\1\s*=>\s*(\[|array\s*\(|[^,\]\n]+)/g;
  let previousOffset = 0;

  for (const match of source.matchAll(keyRegex)) {
    const matchOffset = match.index ?? 0;
    const betweenMatches = source.slice(previousOffset, matchOffset);
    const closeCount =
      (betweenMatches.match(/\]/g) ?? []).length + (betweenMatches.match(/\)/g) ?? []).length;
    for (let index = 0; index < closeCount && stack.length > 0; index += 1) {
      stack.pop();
    }

    const key = match[2];
    const valueStart = match[3].trim();
    const pathParts = [...stack, key];
    if (valueStart === "[" || valueStart.startsWith("array")) {
      stack.push(key);
    } else {
      keys.push(pathParts.join("."));
    }
    previousOffset = matchOffset + match[0].length;
  }

  return uniqueSorted(keys);
}

function translationFileContext(
  rootPath: string,
  filePath: string,
): { group: string | null; locale: string } | null {
  for (const basePath of [path.join(rootPath, "lang"), path.join(rootPath, "resources", "lang")]) {
    const relativePath = path.relative(basePath, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      continue;
    }

    if (filePath.endsWith(".json")) {
      return {
        group: null,
        locale: path.basename(filePath, ".json"),
      };
    }

    const segments = relativePath.split(path.sep);
    if (segments.length < 2) {
      return null;
    }

    return {
      group: segments.slice(1).join(".").replace(/\.php$/, ""),
      locale: segments[0],
    };
  }

  return null;
}

function extractFormRequestRuleFields(source: string): ValidationFieldInfo[] {
  const rulesMethod = /function\s+rules\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\}/.exec(
    source,
  );
  if (!rulesMethod) {
    return [];
  }

  const returnArray = /return\s*\[([\s\S]*?)\]\s*;/.exec(rulesMethod[1]);
  return returnArray ? extractValidationFieldsFromArray(returnArray[1]) : [];
}

function extractInlineValidationRuleFields(source: string): ValidationFieldInfo[][] {
  const fieldSets: ValidationFieldInfo[][] = [];

  for (const match of source.matchAll(/\$request->validate\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    fieldSets.push(extractValidationFieldsFromArray(match[1]));
  }

  for (const match of source.matchAll(/Validator::make\([^,]+,\s*\[([\s\S]*?)\]\s*\)/g)) {
    fieldSets.push(extractValidationFieldsFromArray(match[1]));
  }

  return fieldSets;
}

function extractValidationFieldsFromArray(source: string): ValidationFieldInfo[] {
  const fields: ValidationFieldInfo[] = [];
  const fieldRegex = /['"]([^'"]+)['"]\s*=>\s*(\[[\s\S]*?\]|['"][^'"]*['"])/g;

  for (const match of source.matchAll(fieldRegex)) {
    fields.push({
      field: match[1],
      rules: validationRulesFromValue(match[2]),
    });
  }

  return sortBy(fields, (field) => field.field);
}

function validationRulesFromValue(source: string): string[] {
  const trimmed = source.trim();
  if (trimmed.startsWith("[")) {
    return uniqueSorted(stringsInSource(trimmed).flatMap((rule) => rule.split("|")));
  }

  return uniqueSorted(stringsInSource(trimmed).flatMap((rule) => rule.split("|")));
}

export function extractSchemaTables(filePath: string, source: string): SchemaTableInfo[] {
  const tables: SchemaTableInfo[] = [];
  const schemaRegex =
    /Schema::(?:create|table)\(\s*['"]([^'"]+)['"]\s*,\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}\s*\);/g;

  for (const match of source.matchAll(schemaRegex)) {
    const tableName = match[1];
    tables.push({
      columns: extractSchemaColumns(filePath, tableName, match[2]),
      filePath,
      name: tableName,
    });
  }

  return tables;
}

function extractSchemaColumns(
  filePath: string,
  tableName: string,
  source: string,
): SchemaColumnInfo[] {
  const columns: SchemaColumnInfo[] = [];
  const columnRegex = /\$table->([A-Za-z_][A-Za-z0-9_]*)\(([^)]*)\)((?:->[A-Za-z_][A-Za-z0-9_]*\([^)]*\))*)\s*;/g;

  for (const match of source.matchAll(columnRegex)) {
    const type = match[1];
    const columnNames = schemaColumnNames(type, match[2]);
    if (columnNames.length === 0) {
      continue;
    }

    const modifiers = [...match[3].matchAll(/->([A-Za-z_][A-Za-z0-9_]*)\(/g)].map(
      (modifier) => modifier[1],
    );
    for (const columnName of columnNames) {
      columns.push({
        filePath,
        modifiers,
        name: columnName,
        tableName,
        type,
      });
    }
  }

  return columns;
}

function schemaColumnNames(type: string, argsSource: string): string[] {
  switch (type) {
    case "id":
      return [stringLiteral(argsSource) ?? "id"];
    case "timestamps":
      return ["created_at", "updated_at"];
    case "softDeletes":
      return ["deleted_at"];
    case "rememberToken":
      return ["remember_token"];
    default:
      return stringLiteral(argsSource) ? [stringLiteral(argsSource) ?? ""] : [];
  }
}

function extractModelTableName(className: string, source: string): string {
  const explicitTable = /\bprotected\s+\$table\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source);
  return explicitTable?.[1] ?? pluralize(snakeCase(className));
}

function extractStringArrayProperty(source: string, propertyName: string): string[] {
  const propertyMatch = new RegExp(`\\bprotected\\s+\\$${propertyName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`).exec(
    source,
  );
  return propertyMatch ? uniqueSorted(stringsInSource(propertyMatch[1])) : [];
}

function extractArrayPropertyKeys(source: string, propertyName: string): string[] {
  const propertyMatch = new RegExp(`\\bprotected\\s+\\$${propertyName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`).exec(
    source,
  );
  if (!propertyMatch) {
    return [];
  }

  const keys = [...propertyMatch[1].matchAll(/['"]([^'"]+)['"]\s*=>/g)].map((match) => match[1]);
  return uniqueSorted(keys);
}

function extractArrayKeys(source: string): string[] {
  return uniqueSorted([...source.matchAll(/['"]([^'"]+)['"]\s*=>/g)].map((match) => match[1]));
}

interface IndexFileCandidate {
  filePath: string;
  kind: LaravelIndexFileKind;
}

function indexFileCacheKey(candidate: IndexFileCandidate): string {
  return `${candidate.kind}:${candidate.filePath}`;
}

async function collectIndexFileCandidates(rootPath: string): Promise<IndexFileCandidate[]> {
  const candidates: IndexFileCandidate[] = [];
  const seen = new Set<string>();
  const moduleRoots = await moduleDirectoryRoots(rootPath);

  const addFiles = async (
    kind: LaravelIndexFileKind,
    startPath: string,
    include: (filePath: string) => boolean,
  ) => {
    for (const filePath of await walk(startPath, include)) {
      const seenKey = `${kind}:${filePath}`;
      if (!seen.has(seenKey)) {
        seen.add(seenKey);
        candidates.push({ filePath, kind });
      }
    }
  };

  await Promise.all([
    addFiles("authorization", path.join(rootPath, "app", "Providers"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("authorization", path.join(rootPath, "app", "Policies"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Events"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Http", "Resources"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Jobs"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Listeners"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Mail"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("artifact", path.join(rootPath, "app", "Notifications"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("bladeComponent", path.join(rootPath, "app", "View", "Components"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("command", path.join(rootPath, "app", "Console", "Commands"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("command", path.join(rootPath, "routes"), (filePath) =>
      filePath.endsWith(".php") && path.basename(filePath) === "console.php",
    ),
    addFiles("container", path.join(rootPath, "app", "Providers"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("controller", path.join(rootPath, "app", "Http", "Controllers"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    ...moduleRoots.map((moduleRoot) =>
      addFiles("controller", moduleRoot, (filePath) => filePath.endsWith("Controller.php")),
    ),
    addFiles("facade", path.join(rootPath, "app", "Facades"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("facade", path.join(rootPath, "config"), (filePath) =>
      path.basename(filePath) === "app.php",
    ),
    addFiles("factory", path.join(rootPath, "database", "factories"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("macro", path.join(rootPath, "app"), (filePath) => filePath.endsWith(".php")),
    addFiles("middleware", path.join(rootPath, "app", "Http"), (filePath) =>
      filePath.endsWith("Kernel.php"),
    ),
    addFiles("middleware", path.join(rootPath, "bootstrap"), (filePath) =>
      path.basename(filePath) === "app.php",
    ),
    addFiles("provider", path.join(rootPath, "app", "Providers"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("route", path.join(rootPath, "routes"), (filePath) => filePath.endsWith(".php")),
    addFiles("route", rootPath, (filePath) => path.basename(filePath) === "router.php"),
    addFiles("view", path.join(rootPath, "resources", "views"), (filePath) =>
      filePath.endsWith(".blade.php"),
    ),
    ...(await inertiaPageDirectoryRoots(rootPath)).map((pagesRoot) =>
      addFiles("inertiaPage", pagesRoot, isInertiaPageFile),
    ),
    addFiles("config", path.join(rootPath, "config"), (filePath) => filePath.endsWith(".php")),
    addFiles("model", path.join(rootPath, "app", "Models"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("model", path.join(rootPath, "app"), (filePath) => filePath.endsWith(".php")),
    addFiles("schema", path.join(rootPath, "database", "migrations"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("seeder", path.join(rootPath, "database", "seeders"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("translation", path.join(rootPath, "lang"), isTranslationFile),
    addFiles("translation", path.join(rootPath, "resources", "lang"), isTranslationFile),
    addFiles("validation", path.join(rootPath, "app", "Http", "Requests"), (filePath) =>
      filePath.endsWith(".php"),
    ),
    addFiles("validation", path.join(rootPath, "app", "Http", "Controllers"), (filePath) =>
      filePath.endsWith(".php"),
    ),
  ]);

  for (const fileName of [".env", ".env.example"]) {
    const filePath = path.join(rootPath, fileName);
    const seenKey = `env:${filePath}`;
    if (!seen.has(seenKey) && (await fileSignature(filePath))) {
      seen.add(seenKey);
      candidates.push({ filePath, kind: "env" });
    }
  }

  for (const providerFilePath of [
    path.join(rootPath, "bootstrap", "providers.php"),
    path.join(rootPath, "config", "app.php"),
    path.join(rootPath, "composer.json"),
  ]) {
    const seenKey = `provider:${providerFilePath}`;
    if (!seen.has(seenKey) && (await fileSignature(providerFilePath))) {
      seen.add(seenKey);
      candidates.push({ filePath: providerFilePath, kind: "provider" });
    }
  }

  return sortBy(candidates, (candidate) => `${candidate.kind}:${candidate.filePath}`);
}

function collectChangedIndexFileCandidates(
  rootPath: string,
  changedFilePaths: string[],
): IndexFileCandidate[] {
  const candidates: IndexFileCandidate[] = [];
  const seen = new Set<string>();

  for (const changedFilePath of changedFilePaths) {
    const filePath = path.resolve(changedFilePath);
    for (const kind of indexFileKindsForPath(rootPath, filePath)) {
      const seenKey = `${kind}:${filePath}`;
      if (!seen.has(seenKey)) {
        seen.add(seenKey);
        candidates.push({ filePath, kind });
      }
    }
  }

  return sortBy(candidates, (candidate) => `${candidate.kind}:${candidate.filePath}`);
}

export function indexFileKindForPath(
  rootPath: string,
  filePath: string,
): LaravelIndexFileKind | null {
  return indexFileKindsForPath(rootPath, filePath)[0] ?? null;
}

function indexFileKindsForPath(rootPath: string, filePath: string): LaravelIndexFileKind[] {
  const relativePath = path.relative(rootPath, filePath);

  if (relativePath === ".env" || relativePath === ".env.example") {
    return ["env"];
  }

  if (relativePath === "composer.json") {
    return ["provider"];
  }

  if (relativePath.startsWith(`routes${path.sep}`) && filePath.endsWith(".php")) {
    if (path.basename(filePath) === "console.php") {
      return ["route", "command"];
    }
    return ["route"];
  }

  if (
    relativePath.startsWith(path.join("resources", "views") + path.sep) &&
    filePath.endsWith(".blade.php")
  ) {
    return ["view"];
  }

  if (
    new RegExp(`^resources\\${path.sep}js\\${path.sep}[Pp]ages\\${path.sep}`).test(relativePath) &&
    isInertiaPageFile(filePath)
  ) {
    return ["inertiaPage"];
  }

  if (relativePath.startsWith(`config${path.sep}`) && filePath.endsWith(".php")) {
    if (relativePath === path.join("config", "app.php")) {
      return ["config", "facade", "provider"];
    }
    return ["config"];
  }

  if (relativePath === path.join("bootstrap", "providers.php")) {
    return ["provider"];
  }

  if (relativePath === path.join("bootstrap", "app.php")) {
    return ["middleware"];
  }

  if (
    relativePath.startsWith(path.join("database", "migrations") + path.sep) &&
    filePath.endsWith(".php")
  ) {
    return ["schema"];
  }

  if (
    relativePath.startsWith(path.join("database", "factories") + path.sep) &&
    filePath.endsWith(".php")
  ) {
    return ["factory"];
  }

  if (
    relativePath.startsWith(path.join("database", "seeders") + path.sep) &&
    filePath.endsWith(".php")
  ) {
    return ["seeder"];
  }

  if (
    (relativePath.startsWith(`lang${path.sep}`) ||
      relativePath.startsWith(path.join("resources", "lang") + path.sep)) &&
    isTranslationFile(filePath)
  ) {
    return ["translation"];
  }

  if (path.basename(filePath) === "router.php") {
    return ["route"];
  }

  if (/^modules$/i.test(relativePath.split(path.sep)[0] ?? "") && filePath.endsWith("Controller.php")) {
    return ["controller"];
  }

  if (
    relativePath.startsWith(`app${path.sep}`) &&
    filePath.endsWith(".php")
  ) {
    const kinds: LaravelIndexFileKind[] = ["model", "macro"];
    if (relativePath.startsWith(path.join("app", "Facades") + path.sep)) {
      kinds.push("facade");
    }
    if (relativePath.startsWith(path.join("app", "View", "Components") + path.sep)) {
      kinds.push("bladeComponent");
    }
    if (relativePath.startsWith(path.join("app", "Console", "Commands") + path.sep)) {
      kinds.push("command");
    }
    if (relativePath.startsWith(path.join("app", "Providers") + path.sep)) {
      kinds.push("authorization", "container", "provider");
    }
    if (relativePath.startsWith(path.join("app", "Policies") + path.sep)) {
      kinds.push("authorization");
    }
    if (
      relativePath.startsWith(path.join("app", "Http", "Requests") + path.sep) ||
      relativePath.startsWith(path.join("app", "Http", "Controllers") + path.sep)
    ) {
      kinds.push("validation");
    }
    if (relativePath.startsWith(path.join("app", "Http", "Controllers") + path.sep)) {
      kinds.push("controller");
    }
    if (relativePath === path.join("app", "Http", "Kernel.php")) {
      kinds.push("middleware");
    }
    if (
      relativePath.startsWith(path.join("app", "Events") + path.sep) ||
      relativePath.startsWith(path.join("app", "Http", "Resources") + path.sep) ||
      relativePath.startsWith(path.join("app", "Jobs") + path.sep) ||
      relativePath.startsWith(path.join("app", "Listeners") + path.sep) ||
      relativePath.startsWith(path.join("app", "Mail") + path.sep) ||
      relativePath.startsWith(path.join("app", "Notifications") + path.sep)
    ) {
      kinds.push("artifact");
    }
    return kinds;
  }

  return [];
}

async function indexFile(
  rootPath: string,
  filePath: string,
  kind: LaravelIndexFileKind,
): Promise<
  | BladeViewInfo[]
  | BladeComponentInfo[]
  | AuthorizationInfo[]
  | LaravelArtifactInfo[]
  | CommandInfo[]
  | ConfigKeyInfo[]
  | ContainerBindingInfo[]
  | ControllerInfo[]
  | EnvKeyInfo[]
  | FactoryInfo[]
  | FacadeInfo[]
  | InertiaPageInfo[]
  | MacroInfo[]
  | MiddlewareInfo[]
  | ModelInfo[]
  | ServiceProviderInfo[]
  | RouteInfo[]
  | SchemaTableInfo[]
  | SeederInfo[]
  | TranslationKeyInfo[]
  | ValidationRuleInfo[]
> {
  switch (kind) {
    case "authorization":
      return extractAuthorizationInfo(filePath, await safeRead(filePath));
    case "artifact":
      return extractLaravelArtifacts(rootPath, filePath, await safeRead(filePath));
    case "bladeComponent":
      return extractBladeClassComponentInfo(rootPath, filePath, await safeRead(filePath));
    case "command":
      return extractCommandInfo(filePath, await safeRead(filePath));
    case "container":
      return extractContainerBindings(filePath, await safeRead(filePath));
    case "controller":
      return extractControllerInfo(filePath, await safeRead(filePath));
    case "route":
      return extractRouteInfo(filePath, await safeRead(filePath), await routeBaseContextForFile(rootPath, filePath));
    case "view":
      return [extractBladeViewInfo(rootPath, filePath, await safeRead(filePath))];
    case "config":
      return extractConfigKeyInfo(filePath, await safeRead(filePath));
    case "env":
      return extractEnvKeyInfo(filePath, await safeRead(filePath));
    case "factory":
      return extractFactoryInfo(filePath, await safeRead(filePath));
    case "facade":
      return extractFacadeInfo(filePath, await safeRead(filePath));
    case "inertiaPage":
      return [extractInertiaPageInfo(rootPath, filePath)];
    case "macro":
      return extractMacroInfo(filePath, await safeRead(filePath));
    case "middleware":
      return extractMiddlewareInfo(filePath, await safeRead(filePath));
    case "model": {
      const info = extractModelInfo(filePath, await safeRead(filePath));
      return info ? [info] : [];
    }
    case "provider":
      return extractServiceProviderInfo(filePath, await safeRead(filePath));
    case "schema":
      return extractSchemaTables(filePath, await safeRead(filePath));
    case "seeder":
      return extractSeederInfo(filePath, await safeRead(filePath));
    case "translation":
      return extractTranslationKeys(rootPath, filePath, await safeRead(filePath));
    case "validation":
      return extractValidationRules(filePath, await safeRead(filePath));
  }
}

async function routeBaseContextForFile(rootPath: string, filePath: string): Promise<Partial<RouteContext>> {
  const providerSource = await safeRead(path.join(rootPath, "app", "Providers", "RouteServiceProvider.php"));
  const relativePath = path.relative(rootPath, filePath).split(path.sep).join("/");
  const mountedContext = routeMountContext(providerSource, relativePath);

  if (mountedContext) {
    return mountedContext;
  }

  return {};
}

function routeMountContext(source: string, relativePath: string): Partial<RouteContext> | null {
  const normalizedRelativePath = relativePath.replace(/^\/+/, "");

  for (const match of source.matchAll(/Route::([\s\S]*?)->group\s*\(\s*base_path\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g)) {
    if (match[2].replace(/^\/+/, "") !== normalizedRelativePath) {
      continue;
    }

    return parseRouteChainContext(`Route::${match[1]}`);
  }

  return null;
}

function isTranslationFile(filePath: string): boolean {
  return filePath.endsWith(".php") || filePath.endsWith(".json");
}

const INERTIA_PAGE_EXTENSIONS = [".vue", ".jsx", ".tsx", ".svelte", ".js", ".ts"];

function isInertiaPageFile(filePath: string): boolean {
  return !filePath.endsWith(".d.ts") &&
    INERTIA_PAGE_EXTENSIONS.some((extension) => filePath.endsWith(extension));
}

// Resolves the Inertia page directory (`resources/js/Pages` or lowercase
// `pages`) by its exact on-disk name so case-insensitive filesystems do not
// yield the same tree twice.
async function inertiaPageDirectoryRoots(rootPath: string): Promise<string[]> {
  try {
    const jsRoot = path.join(rootPath, "resources", "js");
    const entries = await readdir(jsRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && /^pages$/i.test(entry.name))
      .map((entry) => path.join(jsRoot, entry.name));
  } catch {
    return [];
  }
}

export function extractInertiaPageInfo(rootPath: string, filePath: string): InertiaPageInfo {
  const relativePath = path.relative(path.join(rootPath, "resources", "js"), filePath);
  const segments = relativePath.split(path.sep);
  const withoutPagesRoot = /^pages$/i.test(segments[0] ?? "") ? segments.slice(1) : segments;
  return {
    filePath,
    name: withoutPagesRoot.join("/").replace(/\.[A-Za-z]+$/, ""),
  };
}

// Resolves module directories (`modules/`, `Modules/`) by their exact on-disk
// names so case-insensitive filesystems do not yield the same tree twice.
async function moduleDirectoryRoots(rootPath: string): Promise<string[]> {
  try {
    const entries = await readdir(rootPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && /^modules$/i.test(entry.name))
      .map((entry) => path.join(rootPath, entry.name));
  } catch {
    return [];
  }
}

async function walk(
  startPath: string,
  include: (filePath: string) => boolean,
): Promise<string[]> {
  const results: string[] = [];

  try {
    const entries = await readdir(startPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(startPath, entry.name);
      if (entry.isDirectory()) {
        if (!["vendor", "node_modules", "storage", "bootstrap/cache"].includes(entry.name)) {
          results.push(...(await walk(entryPath, include)));
        }
      } else if (entry.isFile() && include(entryPath)) {
        results.push(entryPath);
      }
    }
  } catch {
    return results;
  }

  return results;
}

async function fileSignature(filePath: string): Promise<FileSignature | null> {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return null;
    }

    return {
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
    };
  } catch {
    return null;
  }
}

async function safeRead(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function mergeSchemaTables(tables: SchemaTableInfo[]): SchemaTableInfo[] {
  const byName = new Map<string, SchemaTableInfo>();

  for (const table of sortBy(tables, (candidate) => candidate.filePath)) {
    const existing = byName.get(table.name);
    if (!existing) {
      byName.set(table.name, {
        columns: uniqueColumns(table.columns),
        filePath: table.filePath,
        name: table.name,
      });
      continue;
    }

    byName.set(table.name, {
      columns: uniqueColumns([...existing.columns, ...table.columns]),
      filePath: existing.filePath,
      name: table.name,
    });
  }

  return sortBy([...byName.values()], (table) => table.name);
}

function bladeComponentsFromViews(views: BladeViewInfo[]): BladeComponentInfo[] {
  return sortBy(
    views
      .filter((view) => view.name.startsWith("components."))
      .map((view) => ({
        filePath: view.filePath,
        name: view.name.replace(/^components\./, ""),
        props: view.props,
        source: "anonymous" as const,
        viewName: view.name,
      })),
    (component) => component.name,
  );
}

function mergeBladeComponents(components: BladeComponentInfo[]): BladeComponentInfo[] {
  const byName = new Map<string, BladeComponentInfo>();

  for (const component of components) {
    const existing = byName.get(component.name);
    byName.set(component.name, {
      filePath: existing?.filePath ?? component.filePath,
      name: component.name,
      props: uniqueSorted([...(existing?.props ?? []), ...component.props]),
      source: existing?.source === "class" ? "class" : component.source,
      viewName: existing?.viewName ?? component.viewName,
    });
  }

  return sortBy([...byName.values()], (component) => component.name);
}

function uniqueTranslationKeys(keys: TranslationKeyInfo[]): TranslationKeyInfo[] {
  const byKey = new Map<string, TranslationKeyInfo>();

  for (const key of keys) {
    if (!byKey.has(key.key)) {
      byKey.set(key.key, key);
    }
  }

  return [...byKey.values()];
}

function normalizeConfigEntries(filePath: string, entries: CachedIndexFile["entries"]): ConfigKeyInfo[] {
  return (entries as Array<ConfigKeyInfo | string>).map((entry) =>
    typeof entry === "string"
      ? { filePath, key: entry, range: emptySourceRange() }
      : entry
  );
}

function normalizeEnvEntries(filePath: string, entries: CachedIndexFile["entries"]): EnvKeyInfo[] {
  return (entries as Array<EnvKeyInfo | string>).map((entry) =>
    typeof entry === "string"
      ? { filePath, key: entry, range: emptySourceRange() }
      : entry
  );
}

function uniqueConfigEntries(entries: ConfigKeyInfo[]): ConfigKeyInfo[] {
  const byKey = new Map<string, ConfigKeyInfo>();

  for (const entry of entries) {
    if (!byKey.has(entry.key)) {
      byKey.set(entry.key, entry);
    }
  }

  return [...byKey.values()];
}

function uniqueEnvEntries(entries: EnvKeyInfo[]): EnvKeyInfo[] {
  const byKey = new Map<string, EnvKeyInfo>();

  for (const entry of entries) {
    if (!byKey.has(entry.key)) {
      byKey.set(entry.key, entry);
    }
  }

  return [...byKey.values()];
}

function emptySourceRange(): SourceRange {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 },
  };
}

function uniqueAuthorization(entries: AuthorizationInfo[]): AuthorizationInfo[] {
  const byAbility = new Map<string, AuthorizationInfo>();

  for (const entry of entries) {
    if (!byAbility.has(entry.ability)) {
      byAbility.set(entry.ability, entry);
    }
  }

  return [...byAbility.values()];
}

function uniqueArtifacts(artifacts: LaravelArtifactInfo[]): LaravelArtifactInfo[] {
  const byArtifact = new Map<string, LaravelArtifactInfo>();

  for (const artifact of artifacts) {
    byArtifact.set(`${artifact.kind}:${artifact.className}:${artifact.filePath}`, artifact);
  }

  return [...byArtifact.values()];
}

function uniqueContainerBindings(bindings: ContainerBindingInfo[]): ContainerBindingInfo[] {
  const byAbstract = new Map<string, ContainerBindingInfo>();

  for (const binding of bindings) {
    byAbstract.set(binding.abstract, binding);
  }

  return [...byAbstract.values()];
}

function uniqueCommands(commands: CommandInfo[]): CommandInfo[] {
  const byName = new Map<string, CommandInfo>();

  for (const command of commands) {
    byName.set(command.name, command);
  }

  return [...byName.values()];
}

function uniqueControllers(controllers: ControllerInfo[]): ControllerInfo[] {
  const byClass = new Map<string, ControllerInfo>();

  for (const controller of controllers) {
    const key = controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className;
    byClass.set(key, controller);
  }

  return [...byClass.values()];
}

function uniqueFacades(facades: FacadeInfo[]): FacadeInfo[] {
  const byClass = new Map<string, FacadeInfo>();

  for (const facade of facades) {
    byClass.set(facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className, facade);
  }

  return [...byClass.values()];
}

function resolveFacadeBindings(facades: FacadeInfo[], bindings: ContainerBindingInfo[]): FacadeInfo[] {
  const bindingsByAbstract = new Map(bindings.map((binding) => [binding.abstract, binding]));

  return facades.map((facade) => ({
    ...facade,
    binding: facade.accessor ? (bindingsByAbstract.get(facade.accessor) ?? null) : null,
  }));
}

function uniqueFactories(factories: FactoryInfo[]): FactoryInfo[] {
  const byClass = new Map<string, FactoryInfo>();

  for (const factory of factories) {
    byClass.set(factory.className, factory);
  }

  return [...byClass.values()];
}

function uniqueMacros(macros: MacroInfo[]): MacroInfo[] {
  const byMacro = new Map<string, MacroInfo>();

  for (const macro of macros) {
    byMacro.set(`${macro.className}:${macro.method}`, macro);
  }

  return [...byMacro.values()];
}

function uniqueModelRelations(relations: ModelRelationInfo[]): ModelRelationInfo[] {
  const byName = new Map<string, ModelRelationInfo>();

  for (const relation of relations) {
    byName.set(relation.name, relation);
  }

  return [...byName.values()];
}

function uniqueModelBuilderMethods(methods: ModelBuilderMethodInfo[]): ModelBuilderMethodInfo[] {
  const byName = new Map<string, ModelBuilderMethodInfo>();

  for (const method of methods) {
    byName.set(method.name, method);
  }

  return [...byName.values()];
}

function uniqueMiddleware(entries: MiddlewareInfo[]): MiddlewareInfo[] {
  const byAlias = new Map<string, MiddlewareInfo>();

  for (const entry of entries) {
    byAlias.set(entry.alias, entry);
  }

  return [...byAlias.values()];
}

function uniqueServiceProviders(providers: ServiceProviderInfo[]): ServiceProviderInfo[] {
  const byProvider = new Map<string, ServiceProviderInfo>();

  for (const provider of providers) {
    const fullClassName = provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
    byProvider.set(`${provider.source}:${provider.filePath}:${fullClassName}`, provider);
  }

  return [...byProvider.values()];
}

function uniqueSeeders(seeders: SeederInfo[]): SeederInfo[] {
  const byClass = new Map<string, SeederInfo>();

  for (const seeder of seeders) {
    byClass.set(seeder.className, seeder);
  }

  return [...byClass.values()];
}

function uniqueColumns(columns: SchemaColumnInfo[]): SchemaColumnInfo[] {
  const byName = new Map<string, SchemaColumnInfo>();

  for (const column of columns) {
    byName.set(column.name, column);
  }

  return sortBy([...byName.values()], (column) => column.name);
}

function uncapitalize(value: string): string {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

function snakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

function kebabCase(value: string): string {
  return snakeCase(value).replace(/_/g, "-");
}

function pluralize(value: string): string {
  if (value.endsWith("y") && !/[aeiou]y$/.test(value)) {
    return `${value.slice(0, -1)}ies`;
  }

  if (value.endsWith("s")) {
    return `${value}es`;
  }

  return `${value}s`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sortBy<T>(values: T[], select: (value: T) => string): T[] {
  return [...values].sort((left, right) => select(left).localeCompare(select(right)));
}
