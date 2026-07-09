// Feature toggles the language server reads from the LSP `initialize` request's
// `initializationOptions`. Zed forwards these verbatim from a user's
// `lsp.laravel-assist.initialization_options` block in settings.json, e.g.
//
//   "lsp": {
//     "laravel-assist": {
//       "initialization_options": { "implementations": { "enabled": false } }
//     }
//   }
//
// Every toggle defaults to enabled so the out-of-the-box experience is the full
// feature set; a user only ever opts out. Add future toggles here so the wiring
// stays in one place and each one stays independently unit-testable.
export interface LaravelAssistServerConfig {
  implementationsEnabled: boolean;
}

const defaults: LaravelAssistServerConfig = {
  implementationsEnabled: true,
};

export function readServerConfig(initializationOptions: unknown): LaravelAssistServerConfig {
  return {
    implementationsEnabled: readBooleanOption(
      initializationOptions,
      "implementations",
      "enabled",
      defaults.implementationsEnabled,
    ),
  };
}

function readBooleanOption(
  initializationOptions: unknown,
  group: string,
  key: string,
  fallback: boolean,
): boolean {
  if (initializationOptions && typeof initializationOptions === "object") {
    const groupValue = (initializationOptions as Record<string, unknown>)[group];
    if (groupValue && typeof groupValue === "object") {
      const value = (groupValue as Record<string, unknown>)[key];
      if (typeof value === "boolean") {
        return value;
      }
    }
  }

  return fallback;
}
