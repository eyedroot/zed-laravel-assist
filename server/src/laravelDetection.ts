import { access, readFile } from "node:fs/promises";
import path from "node:path";

export async function isLaravelProject(rootPath: string): Promise<boolean> {
  const artisanPath = path.join(rootPath, "artisan");
  const composerPath = path.join(rootPath, "composer.json");

  if (await fileExists(artisanPath)) {
    return true;
  }

  if (!(await fileExists(composerPath))) {
    return false;
  }

  try {
    const composer = JSON.parse(await readFile(composerPath, "utf8")) as {
      require?: Record<string, unknown>;
      "require-dev"?: Record<string, unknown>;
    };

    return Boolean(
      composer.require?.["laravel/framework"] ??
        composer.require?.["illuminate/support"] ??
        composer["require-dev"]?.["orchestra/testbench"],
    );
  } catch {
    return false;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

