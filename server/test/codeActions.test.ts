import { CodeActionParams, DiagnosticSeverity } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { codeActionsForDiagnostics } from "../src/codeActions.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel code actions", () => {
  it("suggests a type-narrowing quick fix for Intelephense Auth::user() diagnostics", () => {
    const document = TextDocument.create(
      "file:///app/modules/Console/Controllers/Account/AccountController.php",
      "php",
      1,
      "<?php\n        $this->accountService->updateSignedAt(Auth::user());\n",
    );
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            code: "P1006",
            message:
              "Expected type 'App\\Kollus\\Models\\User'. Found 'Illuminate\\Contracts\\Auth\\Authenticatable|null'.",
            range: {
              end: { character: 60, line: 1 },
              start: { character: 48, line: 1 },
            },
            severity: DiagnosticSeverity.Error,
            source: "intelephense",
          },
        ],
      },
      range: {
        end: { character: 60, line: 1 },
        start: { character: 48, line: 1 },
      },
      textDocument: {
        uri: document.uri,
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture, null, document)).toEqual([
      {
        diagnostics: [params.context.diagnostics[0]],
        edit: {
          changes: {
            [document.uri]: [
              {
                newText:
                  "        /** @var \\App\\Kollus\\Models\\User $authenticatedUser */\n        $authenticatedUser = Auth::user();\n",
                range: {
                  end: { character: 0, line: 1 },
                  start: { character: 0, line: 1 },
                },
              },
              {
                newText: "$authenticatedUser",
                range: {
                  end: { character: 58, line: 1 },
                  start: { character: 46, line: 1 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Type-narrow Auth::user() as App\\Kollus\\Models\\User",
      },
    ]);
  });

  it("suggests quick fixes for unresolved Laravel string diagnostics", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "route",
              value: "dashbord",
            },
            message: "Unknown Laravel route 'dashbord'.",
            range: {
              end: { character: 15, line: 1 },
              start: { character: 7, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 15, line: 1 },
        start: { character: 7, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/DashboardController.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/app/Http/Controllers/DashboardController.php": [
              {
                newText: "dashboard",
                range: {
                  end: { character: 15, line: 1 },
                  start: { character: 7, line: 1 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'dashboard'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved named route parameters", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "routeParameter",
              model: "users.show",
              value: "member",
            },
            message: "Unknown route parameter 'users.show.member'.",
            range: {
              end: { character: 28, line: 1 },
              start: { character: 22, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 28, line: 1 },
        start: { character: 22, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          edit: {
            changes: {
              "file:///app/app/Http/Controllers/UserController.php": [
                {
                  newText: "user",
                  range: {
                    end: { character: 28, line: 1 },
                    start: { character: 22, line: 1 },
                  },
                },
              ],
            },
          },
          kind: "quickfix",
          title: "Replace with 'user'",
        }),
      ]),
    );
  });

  it("suggests quick fixes for unresolved Blade components", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "component",
              value: "forms.inpt",
            },
            message: "Unknown Blade component 'forms.inpt'.",
            range: {
              end: { character: 13, line: 0 },
              start: { character: 3, line: 0 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 13, line: 0 },
        start: { character: 3, line: 0 },
      },
      textDocument: {
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/resources/views/users/index.blade.php": [
              {
                newText: "forms.input",
                range: {
                  end: { character: 13, line: 0 },
                  start: { character: 3, line: 0 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'forms.input'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved Blade sections", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "bladeSection",
              model: "layouts.app",
              value: "contnt",
            },
            message: "Unknown Blade section 'layouts.app.contnt'.",
            range: {
              end: { character: 16, line: 0 },
              start: { character: 10, line: 0 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 16, line: 0 },
        start: { character: 10, line: 0 },
      },
      textDocument: {
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/resources/views/users/index.blade.php": [
              {
                newText: "content",
                range: {
                  end: { character: 16, line: 0 },
                  start: { character: 10, line: 0 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'content'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved Blade stacks", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "bladeStack",
              model: "layouts.app",
              value: "scrpts",
            },
            message: "Unknown Blade stack 'layouts.app.scrpts'.",
            range: {
              end: { character: 13, line: 0 },
              start: { character: 7, line: 0 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 13, line: 0 },
        start: { character: 7, line: 0 },
      },
      textDocument: {
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/resources/views/users/index.blade.php": [
              {
                newText: "scripts",
                range: {
                  end: { character: 13, line: 0 },
                  start: { character: 7, line: 0 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'scripts'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved Blade component props", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "componentProp",
              model: "forms.input",
              value: "label-tex",
            },
            message: "Unknown Blade component prop 'forms.input.label-tex'.",
            range: {
              end: { character: 24, line: 0 },
              start: { character: 15, line: 0 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 24, line: 0 },
        start: { character: 15, line: 0 },
      },
      textDocument: {
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/resources/views/users/index.blade.php": [
              {
                newText: "label-text",
                range: {
                  end: { character: 24, line: 0 },
                  start: { character: 15, line: 0 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'label-text'",
      }),
    ]);
  });

  it("suggests quick fixes for broader Laravel metadata diagnostics", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "translation",
              value: "messages.welcom",
            },
            message: "Unknown translation key 'messages.welcom'.",
            range: {
              end: { character: 20, line: 1 },
              start: { character: 4, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 20, line: 1 },
        start: { character: 4, line: 1 },
      },
      textDocument: {
        uri: "file:///app/resources/views/dashboard.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/resources/views/dashboard.blade.php": [
              {
                newText: "messages.welcome",
                range: {
                  end: { character: 20, line: 1 },
                  start: { character: 4, line: 1 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'messages.welcome'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved seeder diagnostics", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "seeder",
              value: "UsrSeeder",
            },
            message: "Unknown seeder 'UsrSeeder'.",
            range: {
              end: { character: 22, line: 1 },
              start: { character: 13, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 22, line: 1 },
        start: { character: 13, line: 1 },
      },
      textDocument: {
        uri: "file:///app/database/seeders/DatabaseSeeder.php",
      },
    };

    expect(codeActionsForDiagnostics(params, {
      ...indexFixture,
      seeders: [
        {
          calls: ["UserSeeder"],
          className: "DatabaseSeeder",
          filePath: "/app/database/seeders/DatabaseSeeder.php",
          namespace: "Database\\Seeders",
        },
        {
          calls: [],
          className: "UserSeeder",
          filePath: "/app/database/seeders/UserSeeder.php",
          namespace: "Database\\Seeders",
        },
      ],
    })).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/database/seeders/DatabaseSeeder.php": [
              {
                newText: "UserSeeder",
                range: {
                  end: { character: 22, line: 1 },
                  start: { character: 13, line: 1 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'UserSeeder'",
      }),
    ]);
  });

  it("suggests quick fixes for validated request field diagnostics", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "validationField",
              value: "emali",
            },
            message: "Unknown validated request field 'emali'.",
            range: {
              end: { character: 34, line: 4 },
              start: { character: 29, line: 4 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 34, line: 4 },
        start: { character: 29, line: 4 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    };
    const index: LaravelIndex = {
      ...indexFixture,
      validationRules: [
        {
          className: "StoreUserRequest",
          fields: [
            {
              field: "email",
              rules: ["email", "required"],
            },
            {
              field: "name",
              rules: ["required", "string"],
            },
          ],
          filePath: "/app/app/Http/Requests/StoreUserRequest.php",
          namespace: "App\\Http\\Requests",
          source: "formRequest",
        },
      ],
    };

    expect(codeActionsForDiagnostics(params, index)).toEqual([
      expect.objectContaining({
        edit: {
          changes: {
            "file:///app/app/Http/Controllers/UserController.php": [
              {
                newText: "email",
                range: {
                  end: { character: 34, line: 4 },
                  start: { character: 29, line: 4 },
                },
              },
            ],
          },
        },
        kind: "quickfix",
        title: "Replace with 'email'",
      }),
    ]);
  });

  it("suggests quick fixes for Eloquent relation and attribute diagnostics", () => {
    const relationParams: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "relation",
              model: "User",
              value: "post",
            },
            message: "Unknown Eloquent relation 'User.post'.",
            range: {
              end: { character: 16, line: 1 },
              start: { character: 12, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 16, line: 1 },
        start: { character: 12, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    };
    const attributeParams: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "modelAttribute",
              tableName: "users",
              value: "emali",
            },
            message: "Unknown Eloquent attribute 'users.emali'.",
            range: {
              end: { character: 34, line: 3 },
              start: { character: 29, line: 3 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 34, line: 3 },
        start: { character: 29, line: 3 },
      },
      textDocument: {
        uri: "file:///app/app/Models/User.php",
      },
    };
    const factoryStateParams: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "factoryState",
              model: "User",
              value: "suspneded",
            },
            message: "Unknown factory state 'User.suspneded'.",
            range: {
              end: { character: 26, line: 1 },
              start: { character: 17, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 26, line: 1 },
        start: { character: 17, line: 1 },
      },
      textDocument: {
        uri: "file:///app/database/seeders/DatabaseSeeder.php",
      },
    };

    expect(codeActionsForDiagnostics(relationParams, indexFixture)).toEqual([
      expect.objectContaining({
        kind: "quickfix",
        title: "Replace with 'posts'",
      }),
    ]);
    expect(codeActionsForDiagnostics(attributeParams, indexFixture)).toEqual([
      expect.objectContaining({
        kind: "quickfix",
        title: "Replace with 'email'",
      }),
    ]);
    expect(codeActionsForDiagnostics(factoryStateParams, {
      ...indexFixture,
      factories: [
        {
          className: "UserFactory",
          definitionFields: ["email"],
          filePath: "/app/database/factories/UserFactory.php",
          model: "User",
          namespace: "Database\\Factories",
          states: ["suspended"],
        },
      ],
    })).toEqual([
      expect.objectContaining({
        kind: "quickfix",
        title: "Replace with 'suspended'",
      }),
    ]);
  });

  it("suggests quick fixes for unresolved schema table and column diagnostics", () => {
    const tableParams: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "schemaTable",
              value: "userz",
            },
            message: "Unknown schema table 'userz'.",
            range: {
              end: { character: 19, line: 1 },
              start: { character: 14, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 19, line: 1 },
        start: { character: 14, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Requests/StoreUserRequest.php",
      },
    };
    const columnParams: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "schemaColumn",
              tableName: "users",
              value: "emali",
            },
            message: "Unknown schema column 'users.emali'.",
            range: {
              end: { character: 28, line: 1 },
              start: { character: 23, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 28, line: 1 },
        start: { character: 23, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Requests/StoreUserRequest.php",
      },
    };

    expect(codeActionsForDiagnostics(tableParams, indexFixture)).toEqual([
      expect.objectContaining({
        kind: "quickfix",
        title: "Replace with 'users'",
      }),
    ]);
    expect(codeActionsForDiagnostics(columnParams, indexFixture)).toEqual([
      expect.objectContaining({
        kind: "quickfix",
        title: "Replace with 'email'",
      }),
    ]);
  });


  it("suggests creating missing Blade views", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "view",
              value: "admin.reports.index",
            },
            message: "Unknown Blade view 'admin.reports.index'.",
            range: {
              end: { character: 27, line: 1 },
              start: { character: 8, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 27, line: 1 },
        start: { character: 8, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/ReportController.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture, "/app")).toContainEqual(
      expect.objectContaining({
        edit: {
          documentChanges: [
            {
              kind: "create",
              options: {
                ignoreIfExists: true,
              },
              uri: "file:///app/resources/views/admin/reports/index.blade.php",
            },
            {
              edits: [
                {
                  newText: "",
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/resources/views/admin/reports/index.blade.php",
                version: null,
              },
            },
          ],
        },
        kind: "quickfix",
        title: "Create Blade view 'admin.reports.index'",
      }),
    );
  });

  it("suggests creating missing anonymous Blade components", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "component",
              value: "forms.date-picker",
            },
            message: "Unknown Blade component 'forms.date-picker'.",
            range: {
              end: { character: 20, line: 0 },
              start: { character: 3, line: 0 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 20, line: 0 },
        start: { character: 3, line: 0 },
      },
      textDocument: {
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    };

    expect(codeActionsForDiagnostics(params, emptyIndex(), "/app")).toEqual([
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/resources/views/components/forms/date-picker.blade.php",
            }),
            expect.objectContaining({
              textDocument: {
                uri: "file:///app/resources/views/components/forms/date-picker.blade.php",
                version: null,
              },
            }),
          ],
        },
        kind: "quickfix",
        title: "Create Blade component 'forms.date-picker'",
      }),
    ]);
  });

  it("does not create files for unsafe Laravel names", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [
          {
            data: {
              kind: "view",
              value: "../secrets",
            },
            message: "Unknown Blade view '../secrets'.",
            range: {
              end: { character: 17, line: 1 },
              start: { character: 6, line: 1 },
            },
            severity: DiagnosticSeverity.Warning,
            source: "laravel-assist",
          },
        ],
      },
      range: {
        end: { character: 17, line: 1 },
        start: { character: 6, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Http/Controllers/ReportController.php",
      },
    };

    expect(codeActionsForDiagnostics(params, emptyIndex(), "/app")).toEqual([]);
  });

  it("suggests model-based generation actions", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [],
      },
      range: {
        end: { character: 5, line: 1 },
        start: { character: 0, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Models/User.php",
      },
    };

    expect(codeActionsForDiagnostics(params, indexFixture, "/app")).toEqual([
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/database/factories/UserFactory.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace Database\\Factories;

use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'email' => fake()->safeEmail(),
        ];
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/database/factories/UserFactory.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create factory for User",
      }),
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/app/Http/Resources/UserResource.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'email' => $this->email,
        ];
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/app/Http/Resources/UserResource.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create JSON resource for User",
      }),
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/app/Policies/UserPolicy.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace App\\Policies;

use App\\Models\\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, User $model): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, User $model): bool
    {
        return false;
    }

    public function delete(User $user, User $model): bool
    {
        return false;
    }

    public function restore(User $user, User $model): bool
    {
        return false;
    }

    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/app/Policies/UserPolicy.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create policy for User",
      }),
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/database/seeders/UserSeeder.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace Database\\Seeders;

use App\\Models\\User;
use Illuminate\\Database\\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(10)->create();
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/database/seeders/UserSeeder.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create seeder for User",
      }),
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/app/Http/Requests/StoreUserRequest.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'string', 'max:255', 'unique:users,email'],
        ];
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/app/Http/Requests/StoreUserRequest.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create store request for User",
      }),
      expect.objectContaining({
        edit: {
          documentChanges: [
            expect.objectContaining({
              kind: "create",
              uri: "file:///app/app/Http/Requests/UpdateUserRequest.php",
            }),
            expect.objectContaining({
              edits: [
                {
                  newText: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['sometimes', 'required', 'email', 'string', 'max:255', 'unique:users,email'],
        ];
    }
}
`,
                  range: {
                    end: { character: 0, line: 0 },
                    start: { character: 0, line: 0 },
                  },
                },
              ],
              textDocument: {
                uri: "file:///app/app/Http/Requests/UpdateUserRequest.php",
                version: null,
              },
            }),
          ],
        },
        kind: "refactor",
        title: "Create update request for User",
      }),
    ]);
  });

  it("does not suggest model generation actions when related files are indexed", () => {
    const params: CodeActionParams = {
      context: {
        diagnostics: [],
      },
      range: {
        end: { character: 5, line: 1 },
        start: { character: 0, line: 1 },
      },
      textDocument: {
        uri: "file:///app/app/Models/User.php",
      },
    };
    const index: LaravelIndex = {
      ...indexFixture,
      authorization: [
        {
          ability: "view",
          filePath: "/app/app/Policies/UserPolicy.php",
          model: "App\\Models\\User",
          policy: "UserPolicy",
          source: "policyMap",
        },
      ],
      artifacts: [
        {
          className: "UserResource",
          filePath: "/app/app/Http/Resources/UserResource.php",
          kind: "resource",
          namespace: "App\\Http\\Resources",
          related: [],
        },
      ],
      factories: [
        {
          className: "UserFactory",
          definitionFields: ["email"],
          filePath: "/app/database/factories/UserFactory.php",
          model: "App\\Models\\User",
          namespace: "Database\\Factories",
          states: [],
        },
      ],
      seeders: [
        {
          calls: [],
          className: "UserSeeder",
          filePath: "/app/database/seeders/UserSeeder.php",
          namespace: "Database\\Seeders",
        },
      ],
      validationRules: [
        {
          className: "StoreUserRequest",
          fields: [{ field: "email", rules: ["required", "email"] }],
          filePath: "/app/app/Http/Requests/StoreUserRequest.php",
          namespace: "App\\Http\\Requests",
          source: "formRequest",
        },
        {
          className: "UpdateUserRequest",
          fields: [{ field: "email", rules: ["sometimes", "email"] }],
          filePath: "/app/app/Http/Requests/UpdateUserRequest.php",
          namespace: "App\\Http\\Requests",
          source: "formRequest",
        },
      ],
    };

    expect(codeActionsForDiagnostics(params, index, "/app")).toEqual([]);
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  bladeComponents: [
    {
      filePath: "/app/app/View/Components/Forms/Input.php",
      name: "forms.input",
      props: ["label-text", "required"],
      source: "class",
      viewName: "components.forms.input",
    },
  ],
  bladeViews: [
    {
      components: [],
      extends: "layouts.app",
      filePath: "/app/resources/views/users/index.blade.php",
      includes: [],
      name: "users.index",
      props: [],
      sections: ["content"],
      yields: [],
    },
    {
      components: [],
      extends: null,
      filePath: "/app/resources/views/layouts/app.blade.php",
      includes: [],
      name: "layouts.app",
      props: [],
      sections: [],
      stacks: ["scripts"],
      yields: ["content", "scripts"],
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
        end: { character: 64, line: 0 },
        start: { character: 0, line: 0 },
      },
      uri: "/dashboard",
      uriPrefix: "",
    },
    {
      action: "UserController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: [],
      name: "users.show",
      namePrefix: "",
      range: {
        end: { character: 72, line: 0 },
        start: { character: 0, line: 0 },
      },
      uri: "users/{user}/teams/{team?}",
      uriPrefix: "",
    },
  ],
  models: [
    {
      casts: [],
      className: "User",
      filePath: "/app/app/Models/User.php",
      fillable: ["email"],
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
};
