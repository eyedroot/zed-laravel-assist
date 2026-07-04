#!/usr/bin/env node
import {
  CompletionItem,
  CompletionParams,
  createConnection,
  DidChangeWatchedFilesParams,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { TextDocuments } from "vscode-languageserver/node.js";
import { completionsForDocument } from "./completions.js";
import { isLaravelProject } from "./laravelDetection.js";
import { buildLaravelIndex, emptyIndex, LaravelIndex } from "./projectIndex.js";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let workspaceRoot: string | null = null;
let laravelProject = false;
let index: LaravelIndex = emptyIndex();
let indexInFlight: Promise<void> | null = null;

connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
  workspaceRoot = resolveWorkspaceRoot(params);

  if (workspaceRoot) {
    await refreshIndex(workspaceRoot);
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ["'", "\"", ".", "\\", ">", ":"],
      },
      workspace: {
        workspaceFolders: {
          supported: true,
        },
      },
    },
    serverInfo: {
      name: "Laravel Assist",
      version: "0.0.1",
    },
  };
});

connection.onCompletion((params: CompletionParams): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }

  return completionsForDocument(document, params.position, index);
});

connection.onDidChangeWatchedFiles(async (_params: DidChangeWatchedFilesParams) => {
  if (workspaceRoot) {
    await refreshIndex(workspaceRoot);
  }
});

documents.onDidSave(async () => {
  if (workspaceRoot) {
    await refreshIndex(workspaceRoot);
  }
});

documents.listen(connection);
connection.listen();

function resolveWorkspaceRoot(params: InitializeParams): string | null {
  if (params.rootUri) {
    return fileURLToPath(params.rootUri);
  }

  return params.rootPath ?? null;
}

async function refreshIndex(rootPath: string): Promise<void> {
  if (indexInFlight) {
    return indexInFlight;
  }

  indexInFlight = (async () => {
    laravelProject = await isLaravelProject(rootPath);
    index = laravelProject ? await buildLaravelIndex(rootPath) : emptyIndex();
    connection.console.info(
      laravelProject
        ? `Laravel Assist indexed ${index.routes.length} routes, ${index.views.length} views, ${index.configKeys.length} config keys, ${index.envKeys.length} env keys, and ${index.models.length} models.`
        : "Laravel Assist is idle because this workspace does not look like a Laravel project.",
    );
  })().finally(() => {
    indexInFlight = null;
  });

  return indexInFlight;
}
