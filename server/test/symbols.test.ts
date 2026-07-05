import { SymbolKind } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";
import { documentSymbolsForDocument, workspaceSymbolsForQuery } from "../src/symbols.js";

describe("Laravel symbols", () => {
  it("returns Laravel document symbols for the current file", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/dashboard', DashboardController::class)->name('dashboard');",
    );

    expect(documentSymbolsForDocument(document, indexFixture)).toEqual([
      {
        children: [],
        detail: "GET /dashboard",
        kind: SymbolKind.Function,
        name: "route: dashboard",
        range: {
          end: { character: 72, line: 1 },
          start: { character: 0, line: 1 },
        },
        selectionRange: {
          end: { character: 72, line: 1 },
          start: { character: 0, line: 1 },
        },
      },
    ]);
  });

  it("returns config and env document symbols with source ranges", () => {
    const configDocument = TextDocument.create(
      "file:///app/config/services.php",
      "php",
      1,
      "<?php\nreturn ['mailgun' => ['domain' => env('MAILGUN_DOMAIN')]];",
    );
    const envDocument = TextDocument.create(
      "file:///app/.env",
      "dotenv",
      1,
      "APP_NAME=Laravel",
    );

    expect(documentSymbolsForDocument(configDocument, indexFixture)).toEqual([
      {
        children: [],
        detail: undefined,
        kind: SymbolKind.Key,
        name: "config: services.mailgun.domain",
        range: {
          end: { character: 18, line: 1 },
          start: { character: 12, line: 1 },
        },
        selectionRange: {
          end: { character: 18, line: 1 },
          start: { character: 12, line: 1 },
        },
      },
    ]);
    expect(documentSymbolsForDocument(envDocument, indexFixture)).toEqual([
      {
        children: [],
        detail: undefined,
        kind: SymbolKind.Key,
        name: "env: APP_NAME",
        range: {
          end: { character: 8, line: 0 },
          start: { character: 0, line: 0 },
        },
        selectionRange: {
          end: { character: 8, line: 0 },
          start: { character: 0, line: 0 },
        },
      },
    ]);
  });

  it("returns workspace symbols from indexed Laravel metadata", () => {
    expect(workspaceSymbolsForQuery("dashboard", indexFixture)).toEqual([
      {
        containerName: "/app/routes/web.php",
        kind: SymbolKind.Function,
        location: {
          range: {
            end: { character: 72, line: 1 },
            start: { character: 0, line: 1 },
          },
          uri: "file:///app/routes/web.php",
        },
        name: "route: dashboard",
      },
    ]);

    expect(workspaceSymbolsForQuery("User.posts", indexFixture)).toEqual([
      {
        containerName: "model: User",
        kind: SymbolKind.Property,
        location: {
          range: {
            end: { character: 0, line: 0 },
            start: { character: 0, line: 0 },
          },
          uri: "file:///app/app/Models/User.php",
        },
        name: "relation: User.posts",
      },
    ]);

    expect(workspaceSymbolsForQuery("mailgun", indexFixture)).toEqual([
      {
        containerName: "Laravel config",
        kind: SymbolKind.Key,
        location: {
          range: {
            end: { character: 18, line: 1 },
            start: { character: 12, line: 1 },
          },
          uri: "file:///app/config/services.php",
        },
        name: "config: services.mailgun.domain",
      },
    ]);

    expect(workspaceSymbolsForQuery("ReportServiceProvider", indexFixture)).toEqual([
      {
        containerName: "class",
        kind: SymbolKind.Class,
        location: {
          range: {
            end: { character: 0, line: 0 },
            start: { character: 0, line: 0 },
          },
          uri: "file:///app/app/Providers/ReportServiceProvider.php",
        },
        name: "provider: ReportServiceProvider",
      },
    ]);

    expect(workspaceSymbolsForQuery("facade: Reports", indexFixture)).toEqual([
      {
        containerName: "App\\Facades",
        kind: SymbolKind.Class,
        location: {
          range: {
            end: { character: 0, line: 0 },
            start: { character: 0, line: 0 },
          },
          uri: "file:///app/app/Facades/Reports.php",
        },
        name: "facade: Reports",
      },
    ]);

    const facadeDocument = TextDocument.create(
      "file:///app/app/Facades/Reports.php",
      "php",
      1,
      "<?php\nclass Reports extends Facade {}",
    );
    expect(documentSymbolsForDocument(facadeDocument, indexFixture)).toEqual([
      {
        children: [],
        detail: "DatabaseReporter",
        kind: SymbolKind.Class,
        name: "facade: Reports",
        range: {
          end: { character: 31, line: 1 },
          start: { character: 0, line: 0 },
        },
        selectionRange: {
          end: { character: 31, line: 1 },
          start: { character: 0, line: 0 },
        },
      },
    ]);

    expect(workspaceSymbolsForQuery("UserController@index", indexFixture)).toEqual([
      {
        containerName: "controller: UserController",
        kind: SymbolKind.Method,
        location: {
          range: {
            end: { character: 25, line: 4 },
            start: { character: 20, line: 4 },
          },
          uri: "file:///app/app/Http/Controllers/UserController.php",
        },
        name: "action: UserController@index",
      },
    ]);
  });

  it("caps broad workspace symbol results for large projects", () => {
    const index: LaravelIndex = {
      ...emptyIndex(),
      bladeViews: Array.from({ length: 250 }, (_, index) => ({
        components: [],
        extends: null,
        filePath: `/app/resources/views/pages/${index}.blade.php`,
        includes: [],
        name: `pages.${index}`,
        props: [],
        sections: [],
        yields: [],
      })),
      views: Array.from({ length: 250 }, (_, index) => `pages.${index}`),
    };

    expect(workspaceSymbolsForQuery("", index)).toHaveLength(200);
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  bladeComponents: [
    {
      filePath: "/app/app/View/Components/Forms/Input.php",
      name: "forms.input",
      props: ["label-text"],
      source: "class",
      viewName: "components.forms.input",
    },
  ],
  bladeViews: [
    {
      components: ["forms.input"],
      extends: null,
      filePath: "/app/resources/views/users/index.blade.php",
      includes: [],
      name: "users.index",
      props: [],
      sections: [],
      yields: [],
    },
  ],
  commands: [
    {
      className: "SyncUsersCommand",
      description: "Sync users",
      filePath: "/app/app/Console/Commands/SyncUsersCommand.php",
      name: "users:sync",
      namespace: "App\\Console\\Commands",
      signature: "users:sync {--force}",
      source: "class",
    },
  ],
  configEntries: [
    {
      filePath: "/app/config/services.php",
      key: "services.mailgun.domain",
      range: {
        end: { character: 18, line: 1 },
        start: { character: 12, line: 1 },
      },
    },
  ],
  configKeys: ["services.mailgun.domain"],
  envEntries: [
    {
      filePath: "/app/.env",
      key: "APP_NAME",
      range: {
        end: { character: 8, line: 0 },
        start: { character: 0, line: 0 },
      },
    },
  ],
  envKeys: ["APP_NAME"],
  models: [
    {
      casts: ["email_verified_at"],
      className: "User",
      filePath: "/app/app/Models/User.php",
      fillable: ["name", "email"],
      guarded: [],
      namespace: "App\\Models",
      relations: [
        {
          name: "posts",
          relatedModel: "Post",
          type: "hasMany",
        },
      ],
      relationships: ["posts"],
      scopes: ["active"],
      tableName: "users",
    },
  ],
  controllers: [
    {
      actionDetails: [
        {
          name: "index",
          range: {
            end: { character: 25, line: 4 },
            start: { character: 20, line: 4 },
          },
        },
        {
          name: "store",
          range: {
            end: { character: 25, line: 8 },
            start: { character: 20, line: 8 },
          },
        },
      ],
      actions: ["index", "store"],
      className: "UserController",
      filePath: "/app/app/Http/Controllers/UserController.php",
      namespace: "App\\Http\\Controllers",
    },
  ],
  providers: [
    {
      classFilePath: "/app/app/Providers/ReportServiceProvider.php",
      className: "ReportServiceProvider",
      filePath: "/app/app/Providers/ReportServiceProvider.php",
      namespace: "App\\Providers",
      source: "class",
    },
  ],
  facades: [
    {
      accessor: "reports",
      binding: {
        abstract: "reports",
        concrete: "DatabaseReporter",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "singleton",
      },
      className: "Reports",
      filePath: "/app/app/Facades/Reports.php",
      namespace: "App\\Facades",
    },
  ],
  routes: [
    {
      action: "DashboardController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: [],
      name: "dashboard",
      namePrefix: "",
      range: {
        end: { character: 72, line: 1 },
        start: { character: 0, line: 1 },
      },
      uri: "/dashboard",
      uriPrefix: "",
    },
  ],
  schemaTables: [
    {
      columns: [
        {
          filePath: "/app/database/migrations/2024_01_01_000000_create_users_table.php",
          modifiers: ["unique"],
          name: "email",
          tableName: "users",
          type: "string",
        },
      ],
      filePath: "/app/database/migrations/2024_01_01_000000_create_users_table.php",
      name: "users",
    },
  ],
  translationKeys: [
    {
      filePath: "/app/lang/en/messages.php",
      key: "messages.welcome",
      locale: "en",
      namespace: null,
      source: "php",
    },
  ],
  views: ["users.index"],
};
