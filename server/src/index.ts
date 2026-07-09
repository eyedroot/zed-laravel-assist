#!/usr/bin/env node
import {
  CodeAction,
  CodeActionParams,
  CompletionItem,
  CompletionParams,
  createConnection,
  Definition,
  DefinitionParams,
  ExecuteCommandParams,
  DocumentSymbol,
  DocumentSymbolParams,
  DidChangeWatchedFilesParams,
  Hover,
  HoverParams,
  ImplementationParams,
  InlayHint,
  InlayHintParams,
  InitializeParams,
  InitializeResult,
  Location,
  ProposedFeatures,
  ReferenceParams,
  SymbolInformation,
  TextDocumentSyncKind,
  WorkspaceSymbolParams,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "node:url";
import { TextDocuments } from "vscode-languageserver/node.js";
import { loadLaravelIndexCache, saveLaravelIndexCache } from "./cacheStore.js";
import { codeActionsForDiagnostics, OPEN_CONCRETE_BINDING_COMMAND, OpenConcreteBindingCommandArgs } from "./codeActions.js";
import { completionsForDocument } from "./completions.js";
import { diagnosticsForDocument } from "./diagnostics.js";
import { definitionsForDocument } from "./definitions.js";
import { hoverForDocument } from "./hovers.js";
import { implementationsForDocument } from "./implementations.js";
import { inlayHintsForDocument } from "./inlayHints.js";
import { isLaravelProject } from "./laravelDetection.js";
import {
  buildLaravelIndex,
  emptyIndex,
  emptyIndexCache,
  LaravelIndex,
  LaravelIndexCache,
} from "./projectIndex.js";
import { referencesForDocument } from "./references.js";
import { readServerConfig } from "./serverConfig.js";
import { documentSymbolsForDocument, workspaceSymbolsForQuery } from "./symbols.js";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let workspaceRoot: string | null = null;
let laravelProject = false;
// "Go to Implementation" for arbitrary PHP types is on by default; users can
// turn it off through `lsp.laravel-assist.initialization_options` in Zed
// (`{ "implementations": { "enabled": false } }`) when a licensed PHP server
// already covers it. Read once at initialize time and used to gate both the
// advertised capability and the request handler.
let implementationsEnabled = true;
let index: LaravelIndex = emptyIndex();
let indexCache: LaravelIndexCache | null = null;
let indexInFlight: Promise<void> | null = null;
let indexRefreshQueued = false;
let queuedChangedFilePaths = new Set<string>();
let queuedFullRefresh = false;
let refreshTimer: NodeJS.Timeout | null = null;

connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
  workspaceRoot = resolveWorkspaceRoot(params);
  implementationsEnabled = readServerConfig(params.initializationOptions).implementationsEnabled;

  if (workspaceRoot) {
    indexCache = await loadLaravelIndexCache(workspaceRoot);
    await refreshIndex(workspaceRoot);
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ["'", "\"", ".", "\\", ">", ":"],
      },
      definitionProvider: true,
      implementationProvider: implementationsEnabled,
      referencesProvider: true,
      hoverProvider: true,
      inlayHintProvider: true,
      codeActionProvider: true,
      executeCommandProvider: {
        commands: [OPEN_CONCRETE_BINDING_COMMAND],
      },
      documentSymbolProvider: true,
      workspaceSymbolProvider: true,
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

connection.onDefinition((params: DefinitionParams): Definition => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }

  return definitionsForDocument(document, params.position, index);
});

connection.onReferences(async (params: ReferenceParams): Promise<Location[]> => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }

  return referencesForDocument(document, params.position, index);
});

connection.onImplementation((params: ImplementationParams): Location[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject || !implementationsEnabled) {
    return [];
  }

  return implementationsForDocument(document, params.position, index);
});

connection.onHover((params: HoverParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return null;
  }

  return hoverForDocument(document, params.position, index);
});

connection.languages.inlayHint.on((params: InlayHintParams): InlayHint[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }

  return inlayHintsForDocument(document, index);
});

connection.onCodeAction((params: CodeActionParams): CodeAction[] => {
  if (!laravelProject) {
    return [];
  }

  return codeActionsForDiagnostics(params, index, workspaceRoot, documents.get(params.textDocument.uri));
});

connection.onExecuteCommand(async (params: ExecuteCommandParams) => {
  if (params.command !== OPEN_CONCRETE_BINDING_COMMAND) {
    return null;
  }

  const args = params.arguments?.[0] as Partial<OpenConcreteBindingCommandArgs> | undefined;
  if (!args?.uri || !args.selection) {
    return null;
  }

  await connection.window.showDocument({
    selection: args.selection,
    takeFocus: true,
    uri: args.uri,
  });
  return null;
});

connection.onDocumentSymbol((params: DocumentSymbolParams): DocumentSymbol[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }

  return documentSymbolsForDocument(document, index);
});

connection.onWorkspaceSymbol((params: WorkspaceSymbolParams): SymbolInformation[] => {
  if (!laravelProject) {
    return [];
  }

  return workspaceSymbolsForQuery(params.query, index);
});

connection.onDidChangeWatchedFiles(async (params: DidChangeWatchedFilesParams) => {
  if (workspaceRoot) {
    scheduleRefreshIndex(
      workspaceRoot,
      params.changes.map((change) => fileURLToPath(change.uri)),
    );
  }
});

documents.onDidSave(async (event) => {
  if (workspaceRoot) {
    scheduleRefreshIndex(workspaceRoot, [fileURLToPath(event.document.uri)]);
  }
});

documents.onDidOpen((event) => {
  publishDiagnostics(event.document);
});

documents.onDidChangeContent((event) => {
  publishDiagnostics(event.document);
});

documents.onDidClose((event) => {
  connection.sendDiagnostics({ diagnostics: [], uri: event.document.uri });
});

documents.listen(connection);
connection.listen();

function resolveWorkspaceRoot(params: InitializeParams): string | null {
  if (params.rootUri) {
    return fileURLToPath(params.rootUri);
  }

  return params.rootPath ?? null;
}

async function refreshIndex(rootPath: string, changedFilePaths?: string[]): Promise<void> {
  if (indexInFlight) {
    queueRefresh(changedFilePaths);
    indexRefreshQueued = true;
    return indexInFlight;
  }

  indexInFlight = (async () => {
    let nextChangedFilePaths = changedFilePaths;

    do {
      indexRefreshQueued = false;
      laravelProject = await isLaravelProject(rootPath);

      if (!laravelProject) {
        index = emptyIndex();
        indexCache = emptyIndexCache(rootPath);
        connection.console.info(
          "Laravel Assist is idle because this workspace does not look like a Laravel project.",
        );
        continue;
      }

      const result = await buildLaravelIndex(rootPath, indexCache, {
        changedFilePaths: nextChangedFilePaths,
      });
      index = result.index;
      indexCache = result.cache;
      try {
        await saveLaravelIndexCache(result.cache);
      } catch (error) {
        connection.console.warn(`Laravel Assist could not persist index cache: ${errorMessage(error)}`);
      }
      connection.console.info(
        `Laravel Assist indexed ${index.routes.length} routes, ${index.views.length} views, ${index.bladeComponents.length} Blade components, ${index.configKeys.length} config keys, ${index.envKeys.length} env keys, ${index.translationKeys.length} translation keys, ${index.containerBindings.length} container bindings, ${index.authorization.length} authorization entries, ${index.commands.length} commands, ${index.controllers.length} controllers, ${index.middleware.length} middleware aliases, ${index.facades.length} facades, ${index.providers.length} providers, ${index.macros.length} macros, ${index.factories.length} factories, ${index.seeders.length} seeders, ${index.artifacts.length} artifacts, ${index.models.length} models, ${index.schemaTables.length} schema tables, and ${index.validationRules.length} validation rule sets. Reused ${result.stats.reusedFiles}/${result.stats.discoveredFiles} files, reindexed ${result.stats.indexedFiles}, removed ${result.stats.removedFiles}.`,
      );
      publishAllDiagnostics();
      nextChangedFilePaths = takeQueuedChangedFilePaths();
    } while (indexRefreshQueued);
  })().finally(() => {
    indexInFlight = null;
  });

  return indexInFlight;
}

function scheduleRefreshIndex(rootPath: string, changedFilePaths?: string[]): void {
  queueRefresh(changedFilePaths);

  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    void refreshIndex(rootPath, takeQueuedChangedFilePaths());
  }, 250);
}

function queueRefresh(changedFilePaths?: string[]): void {
  if (!changedFilePaths?.length) {
    queuedFullRefresh = true;
    queuedChangedFilePaths.clear();
    return;
  }

  if (queuedFullRefresh) {
    return;
  }

  for (const filePath of changedFilePaths) {
    queuedChangedFilePaths.add(filePath);
  }
}

function takeQueuedChangedFilePaths(): string[] | undefined {
  if (queuedFullRefresh) {
    queuedFullRefresh = false;
    queuedChangedFilePaths.clear();
    return undefined;
  }

  if (queuedChangedFilePaths.size === 0) {
    return undefined;
  }

  const changedFilePaths = [...queuedChangedFilePaths];
  queuedChangedFilePaths.clear();
  return changedFilePaths;
}

function publishDiagnostics(document: TextDocument): void {
  connection.sendDiagnostics({
    diagnostics: laravelProject ? diagnosticsForDocument(document, index, workspaceRoot) : [],
    uri: document.uri,
  });
}

function publishAllDiagnostics(): void {
  for (const document of documents.all()) {
    publishDiagnostics(document);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
