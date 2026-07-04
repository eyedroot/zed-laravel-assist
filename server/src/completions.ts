import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { LaravelIndex } from "./projectIndex.js";

export function completionsForDocument(
  document: TextDocument,
  position: { line: number; character: number },
  index: LaravelIndex,
): CompletionItem[] {
  const line = document.getText({
    start: { line: position.line, character: 0 },
    end: position,
  });

  if (isInsideStringCall(line, "route")) {
    return index.routes.map((route) => ({
      label: route.name,
      kind: CompletionItemKind.Value,
      detail: "Laravel route",
      data: { filePath: route.filePath },
    }));
  }

  if (isInsideStringCall(line, "view")) {
    return index.views.map((view) => ({
      label: view,
      kind: CompletionItemKind.File,
      detail: "Laravel view",
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
    return index.models.map((model) => ({
      label: model.namespace ? `${model.namespace}\\${model.className}` : model.className,
      kind: CompletionItemKind.Class,
      detail: "Eloquent model",
      data: { filePath: model.filePath },
    }));
  }

  return helperCompletions();
}

function isInsideStringCall(linePrefix: string, helper: string): boolean {
  return new RegExp(`\\b${helper}\\(\\s*['\"][^'\"]*$`).test(linePrefix);
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
