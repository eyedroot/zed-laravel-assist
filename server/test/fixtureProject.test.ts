import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildLaravelIndex } from "../src/projectIndex.js";

describe("Laravel fixture project", () => {
  it("indexes a representative Laravel app fixture", async () => {
    const rootPath = path.resolve("test/fixtures/laravel-basic");
    const { index, stats } = await buildLaravelIndex(rootPath);

    expect(stats.discoveredFiles).toBeGreaterThan(8);
    expect(index.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "users.show",
          uri: "users/{user}",
        }),
        expect.objectContaining({
          name: "console.me",
          uri: "api-console/me",
        }),
      ]),
    );
    expect(index.models).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accessors: ["avatar_url", "display_name"],
          appends: ["display_name"],
          casts: ["status"],
          className: "User",
          fillable: ["email", "status"],
          relationships: ["posts"],
        }),
      ]),
    );
    expect(index.schemaTables).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          columns: expect.arrayContaining([
            expect.objectContaining({ name: "email", type: "string" }),
            expect.objectContaining({ name: "status", type: "boolean" }),
          ]),
          name: "users",
        }),
      ]),
    );
    expect(index.validationRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          className: "StoreUserRequest",
          fields: expect.arrayContaining([
            expect.objectContaining({ field: "email" }),
            expect.objectContaining({ field: "status" }),
          ]),
          source: "formRequest",
        }),
      ]),
    );
    expect(index.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          className: "UserResource",
          kind: "resource",
        }),
      ]),
    );
    expect(index.authorization).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ability: "view",
          policy: "UserPolicy",
          source: "policy",
        }),
      ]),
    );
  });
});
