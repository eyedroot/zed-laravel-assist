export function resolvePhpClassReference(source: string, classReference: string): string {
  const normalized = classReference.replace(/^\\/, "");
  if (normalized.includes("\\")) {
    return normalized;
  }

  return phpImports(source).get(normalized) ?? normalized;
}

function phpImports(source: string): Map<string, string> {
  const imports = new Map<string, string>();

  for (const match of source.matchAll(/\buse\s+([^;]+);/g)) {
    const statement = match[1].trim();
    if (/^function\s|^const\s/i.test(statement)) {
      continue;
    }

    const groupMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\\\s*\{([\s\S]+)\}$/.exec(statement);
    if (groupMatch) {
      for (const item of groupMatch[2].split(",")) {
        addPhpImport(imports, `${groupMatch[1]}\\${item.trim()}`);
      }
      continue;
    }

    for (const item of statement.split(",")) {
      addPhpImport(imports, item.trim());
    }
  }

  return imports;
}

function addPhpImport(imports: Map<string, string>, statement: string): void {
  const aliasMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/i.exec(statement);
  const className = aliasMatch ? aliasMatch[1] : statement;
  if (!/^[A-Za-z_\\][A-Za-z0-9_\\]*$/.test(className)) {
    return;
  }

  const alias = aliasMatch?.[2] ?? className.split("\\").at(-1);
  if (alias) {
    imports.set(alias, className);
  }
}
