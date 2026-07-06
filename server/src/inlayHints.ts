import { InlayHint } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { LaravelIndex } from "./projectIndex.js";

export function inlayHintsForDocument(document: TextDocument, index: LaravelIndex): InlayHint[] {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath) {
    return [];
  }

  const hints = new Map<string, InlayHint>();

  for (const [line, routes] of routesByStartLine(index, documentPath)) {
    const labels = uniqueStrings(routes.map(routeHintLabel));
    if (labels.length === 0) {
      continue;
    }

    const character = document.getText({
      start: { character: 0, line },
      end: { character: Number.MAX_SAFE_INTEGER, line },
    }).length;

    hints.set(`${line}:${character}`, {
      label: ` ${labels.join(" · ")}`,
      paddingLeft: true,
      position: { character, line },
    });
  }

  return [...hints.values()].sort((left, right) =>
    left.position.line - right.position.line || left.position.character - right.position.character
  );
}

function routesByStartLine(
  index: LaravelIndex,
  documentPath: string,
): Map<number, LaravelIndex["routes"]> {
  const byLine = new Map<number, LaravelIndex["routes"]>();

  for (const route of index.routes.filter((candidate) => candidate.filePath === documentPath && candidate.uri)) {
    const routes = byLine.get(route.range.start.line) ?? [];
    routes.push(route);
    byLine.set(route.range.start.line, routes);
  }

  return byLine;
}

function routeHintLabel(route: LaravelIndex["routes"][number]): string {
  const methods = route.methods.join("|");
  const uri = `/${route.uri?.replace(/^\/+/, "") ?? ""}`;
  const name = route.name ? ` (${route.name})` : "";

  return `${methods} ${uri}${name}`;
}

function documentPathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
