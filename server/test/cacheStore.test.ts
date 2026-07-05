import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadLaravelIndexCache,
  saveLaravelIndexCache,
} from "../src/cacheStore.js";
import { emptyIndexCache } from "../src/projectIndex.js";

const originalCacheHome = process.env.XDG_CACHE_HOME;

describe("Laravel index cache store", () => {
  afterEach(() => {
    process.env.XDG_CACHE_HOME = originalCacheHome;
  });

  it("persists and reloads a workspace cache", async () => {
    const cacheHome = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-cache-"));
    process.env.XDG_CACHE_HOME = cacheHome;

    try {
      const rootPath = "/tmp/example-laravel-app";
      const cache = emptyIndexCache(rootPath);
      cache.files["/tmp/example-laravel-app/routes/web.php"] = {
        entries: [
          {
            action: "DashboardController::class",
            domain: null,
            filePath: "/tmp/example-laravel-app/routes/web.php",
            methods: ["GET"],
            middleware: [],
            name: "dashboard",
            namePrefix: "",
            range: {
              end: { character: 10, line: 0 },
              start: { character: 0, line: 0 },
            },
            uri: "dashboard",
            uriPrefix: "",
          },
        ],
        filePath: "/tmp/example-laravel-app/routes/web.php",
        kind: "route",
        signature: { mtimeMs: 1, size: 10 },
      };

      await saveLaravelIndexCache(cache);

      expect(await loadLaravelIndexCache(rootPath)).toEqual(cache);
    } finally {
      await rm(cacheHome, { force: true, recursive: true });
    }
  });
});
