import { describe, expect, it } from "vitest";
import { readServerConfig } from "../src/serverConfig.js";

describe("server config", () => {
  it("enables implementations by default when no options are provided", () => {
    expect(readServerConfig(undefined).implementationsEnabled).toBe(true);
    expect(readServerConfig(null).implementationsEnabled).toBe(true);
    expect(readServerConfig({}).implementationsEnabled).toBe(true);
  });

  it("disables implementations when explicitly turned off", () => {
    expect(readServerConfig({ implementations: { enabled: false } }).implementationsEnabled).toBe(
      false,
    );
  });

  it("keeps implementations enabled when explicitly turned on", () => {
    expect(readServerConfig({ implementations: { enabled: true } }).implementationsEnabled).toBe(
      true,
    );
  });

  it("falls back to the default for malformed or partial options", () => {
    expect(readServerConfig("nope").implementationsEnabled).toBe(true);
    expect(readServerConfig({ implementations: "off" }).implementationsEnabled).toBe(true);
    expect(readServerConfig({ implementations: {} }).implementationsEnabled).toBe(true);
    expect(readServerConfig({ implementations: { enabled: "false" } }).implementationsEnabled).toBe(
      true,
    );
  });
});
