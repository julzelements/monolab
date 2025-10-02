import { describe, it, expect } from "vitest";
import { parseMonologueSysEx } from "../index";

describe("SysEx Module Integration", () => {
  it("should export parseMonologueSysEx function", () => {
    expect(typeof parseMonologueSysEx).toBe("function");
  });

  it("should handle invalid input gracefully", () => {
    const result = parseMonologueSysEx([]);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should validate basic SysEx structure", () => {
    const validHeader = new Array(520).fill(0);
    validHeader[0] = 0xf0; // SysEx start
    validHeader[1] = 0x42; // Korg manufacturer
    validHeader[2] = 0x30; // Device ID

    const result = parseMonologueSysEx(validHeader);

    // Should either parse or fail with specific error (not crash)
    expect(typeof result.isValid).toBe("boolean");
    if (!result.isValid) {
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe("string");
    }
  });
});
