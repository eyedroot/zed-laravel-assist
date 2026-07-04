import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface LaravelIndex {
  configKeys: string[];
  envKeys: string[];
  models: ModelInfo[];
  routes: RouteInfo[];
  views: string[];
}

export interface ModelInfo {
  className: string;
  namespace: string | null;
  filePath: string;
  relationships: string[];
}

export interface RouteInfo {
  name: string;
  filePath: string;
}

export function emptyIndex(): LaravelIndex {
  return {
    configKeys: [],
    envKeys: [],
    models: [],
    routes: [],
    views: [],
  };
}

export async function buildLaravelIndex(rootPath: string): Promise<LaravelIndex> {
  const [routes, views, configKeys, envKeys, models] = await Promise.all([
    indexRoutes(rootPath),
    indexViews(rootPath),
    indexConfig(rootPath),
    indexEnv(rootPath),
    indexModels(rootPath),
  ]);

  return {
    routes: sortBy(routes, (route) => route.name),
    views: uniqueSorted(views),
    configKeys: uniqueSorted(configKeys),
    envKeys: uniqueSorted(envKeys),
    models: sortBy(models, (model) => model.className),
  };
}

export function extractRouteNames(source: string): string[] {
  const names = new Set<string>();

  for (const match of source.matchAll(/->name\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    names.add(match[1]);
  }

  for (const match of source.matchAll(/Route::name\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    names.add(match[1]);
  }

  return uniqueSorted([...names]);
}

export function extractConfigKeys(fileName: string, source: string): string[] {
  const baseName = path.basename(fileName, ".php");
  const keys = new Set<string>();
  const keyRegex = /['"]([A-Za-z0-9_.-]+)['"]\s*=>/g;

  for (const match of source.matchAll(keyRegex)) {
    keys.add(`${baseName}.${match[1]}`);
  }

  return [...keys];
}

export function extractEnvKeys(source: string): string[] {
  const keys = new Set<string>();

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = /^([A-Z0-9_]+)\s*=/.exec(trimmed);
    if (match) {
      keys.add(match[1]);
    }
  }

  return [...keys];
}

export function extractModelInfo(filePath: string, source: string): ModelInfo | null {
  const classMatch = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/.exec(source);
  if (!classMatch) {
    return null;
  }

  const namespaceMatch = /\bnamespace\s+([^;]+);/.exec(source);
  const relationships = new Set<string>();
  const relationshipRegex =
    /public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{[^}]*\$this->(hasOne|hasMany|belongsTo|belongsToMany|morphOne|morphMany|morphTo|morphToMany)\s*\(/gs;

  for (const match of source.matchAll(relationshipRegex)) {
    relationships.add(match[1]);
  }

  return {
    className: classMatch[1],
    namespace: namespaceMatch?.[1].trim() ?? null,
    filePath,
    relationships: uniqueSorted([...relationships]),
  };
}

async function indexRoutes(rootPath: string): Promise<RouteInfo[]> {
  const routeDir = path.join(rootPath, "routes");
  const files = await walk(routeDir, (filePath) => filePath.endsWith(".php"));
  const routes: RouteInfo[] = [];

  for (const filePath of files) {
    const source = await safeRead(filePath);
    for (const name of extractRouteNames(source)) {
      routes.push({ name, filePath });
    }
  }

  return routes;
}

async function indexViews(rootPath: string): Promise<string[]> {
  const viewsDir = path.join(rootPath, "resources", "views");
  const files = await walk(viewsDir, (filePath) => filePath.endsWith(".blade.php"));

  return files.map((filePath) =>
    path
      .relative(viewsDir, filePath)
      .replace(/\.blade\.php$/, "")
      .split(path.sep)
      .join("."),
  );
}

async function indexConfig(rootPath: string): Promise<string[]> {
  const configDir = path.join(rootPath, "config");
  const files = await walk(configDir, (filePath) => filePath.endsWith(".php"));
  const keys: string[] = [];

  for (const filePath of files) {
    keys.push(...extractConfigKeys(filePath, await safeRead(filePath)));
  }

  return keys;
}

async function indexEnv(rootPath: string): Promise<string[]> {
  const keys: string[] = [];

  for (const fileName of [".env", ".env.example"]) {
    keys.push(...extractEnvKeys(await safeRead(path.join(rootPath, fileName))));
  }

  return keys;
}

async function indexModels(rootPath: string): Promise<ModelInfo[]> {
  const modelDirs = [path.join(rootPath, "app", "Models"), path.join(rootPath, "app")];
  const seen = new Set<string>();
  const models: ModelInfo[] = [];

  for (const modelDir of modelDirs) {
    for (const filePath of await walk(modelDir, (candidate) => candidate.endsWith(".php"))) {
      if (seen.has(filePath)) {
        continue;
      }
      seen.add(filePath);

      const info = extractModelInfo(filePath, await safeRead(filePath));
      if (info) {
        models.push(info);
      }
    }
  }

  return models;
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

function sortBy<T>(values: T[], select: (value: T) => string): T[] {
  return [...values].sort((left, right) => select(left).localeCompare(select(right)));
}
