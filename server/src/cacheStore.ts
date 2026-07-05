import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import {
  LARAVEL_INDEX_CACHE_VERSION,
  LaravelIndexCache,
  emptyIndexCache,
} from "./projectIndex.js";

const CACHE_FILE_NAME = "index.json";

export function cacheFilePathForWorkspace(rootPath: string): string {
  return path.join(cacheDirectoryForWorkspace(rootPath), CACHE_FILE_NAME);
}

export async function loadLaravelIndexCache(rootPath: string): Promise<LaravelIndexCache> {
  const cachePath = cacheFilePathForWorkspace(rootPath);

  try {
    const cache = JSON.parse(await readFile(cachePath, "utf8")) as Partial<LaravelIndexCache>;
    if (
      cache.version === LARAVEL_INDEX_CACHE_VERSION &&
      cache.rootPath === rootPath &&
      cache.files &&
      typeof cache.files === "object"
    ) {
      return cache as LaravelIndexCache;
    }
  } catch {
    // Missing or invalid cache files are expected during first run and after schema changes.
  }

  return emptyIndexCache(rootPath);
}

export async function saveLaravelIndexCache(cache: LaravelIndexCache): Promise<void> {
  const cachePath = cacheFilePathForWorkspace(cache.rootPath);
  const cacheDir = path.dirname(cachePath);
  const tempPath = `${cachePath}.${process.pid}.tmp`;

  await mkdir(cacheDir, { recursive: true });
  await writeFile(tempPath, `${JSON.stringify(cache)}\n`, "utf8");
  await rename(tempPath, cachePath);
}

function cacheDirectoryForWorkspace(rootPath: string): string {
  const rootHash = createHash("sha1").update(rootPath).digest("hex");
  const baseDirectory =
    process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache");

  return path.join(baseDirectory, "laravel-assist", rootHash);
}
