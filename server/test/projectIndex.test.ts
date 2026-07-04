import { describe, expect, it } from "vitest";
import {
  extractConfigKeys,
  extractEnvKeys,
  extractModelInfo,
  extractRouteNames,
} from "../src/projectIndex.js";

describe("project index extraction", () => {
  it("extracts named Laravel routes", () => {
    const source = `
      Route::get('/dashboard', DashboardController::class)->name('dashboard');
      Route::name('admin.')->group(function () {
        Route::get('/users', UsersController::class)->name("users.index");
      });
    `;

    expect(extractRouteNames(source)).toEqual(["admin.", "dashboard", "users.index"]);
  });

  it("extracts config keys under the config file namespace", () => {
    const source = `
      return [
        'name' => env('APP_NAME', 'Laravel'),
        "timezone" => "UTC",
      ];
    `;

    expect(extractConfigKeys("/app/config/app.php", source)).toEqual([
      "app.name",
      "app.timezone",
    ]);
  });

  it("extracts environment keys", () => {
    expect(extractEnvKeys("APP_NAME=Laravel\n# ignored\nDB_HOST=127.0.0.1")).toEqual([
      "APP_NAME",
      "DB_HOST",
    ]);
  });

  it("extracts Eloquent model metadata and relationships", () => {
    const source = `
      namespace App\\Models;

      class User extends Model
      {
          public function posts(): HasMany
          {
              return $this->hasMany(Post::class);
          }
      }
    `;

    expect(extractModelInfo("/app/app/Models/User.php", source)).toEqual({
      className: "User",
      namespace: "App\\Models",
      filePath: "/app/app/Models/User.php",
      relationships: ["posts"],
    });
  });
});
