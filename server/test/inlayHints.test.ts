import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { inlayHintsForDocument } from "../src/inlayHints.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel inlay hints", () => {
  it("shows route URL hints at the end of route declaration lines", () => {
    const source = [
      "<?php",
      "Route::prefix('me')->group(function () {",
      "    Route::get('/', 'MeController');",
      "    Route::get('analytics-dashboard-url', 'MeController@analyticsDashboardUrl')->name('analytics_dashboard_url');",
      "});",
      "",
    ].join("\n");
    const document = TextDocument.create(
      "file:///app/modules/Console/router.php",
      "php",
      1,
      source,
    );

    expect(inlayHintsForDocument(document, indexFixture)).toEqual([
      {
        label: " GET /api-console/me",
        paddingLeft: true,
        position: {
          character: 36,
          line: 2,
        },
      },
      {
        label: " GET /api-console/me/analytics-dashboard-url (analytics_dashboard_url)",
        paddingLeft: true,
        position: {
          character: 113,
          line: 3,
        },
      },
    ]);
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  routes: [
    {
      action: "MeController",
      domain: null,
      filePath: "/app/modules/Console/router.php",
      methods: ["GET"],
      middleware: [],
      name: null,
      namePrefix: "",
      range: {
        end: { character: 40, line: 2 },
        start: { character: 4, line: 2 },
      },
      uri: "api-console/me",
      uriPrefix: "api-console/me",
    },
    {
      action: "MeController@analyticsDashboardUrl",
      domain: null,
      filePath: "/app/modules/Console/router.php",
      methods: ["GET"],
      middleware: [],
      name: "analytics_dashboard_url",
      namePrefix: "",
      range: {
        end: { character: 103, line: 3 },
        start: { character: 4, line: 3 },
      },
      uri: "api-console/me/analytics-dashboard-url",
      uriPrefix: "api-console/me",
    },
  ],
};
