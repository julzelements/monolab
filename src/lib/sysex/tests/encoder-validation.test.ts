import { describe, it, expect } from "vitest";
import { validateMonologueParameters, encodeMonologueParameters } from "../encoder";
import { decodeMonologueParameters } from "../decoder";
import fs from "fs";
import path from "path";

// Load one sample dump for baseline
const dumpPath = path.join(__dirname, "data", "dumps", "dump1.json");
const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
const params = decodeMonologueParameters(dump.rawData);

describe("Encoder validation", () => {
  it("returns valid for complete parameter object", () => {
    const result = validateMonologueParameters(params);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("reports missing sections", () => {
    const clone: any = { ...params, lfo: undefined, misc: undefined };
    const result = validateMonologueParameters(clone);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("lfo");
    expect(result.missing).toContain("misc");
  });

  it("throws on encode when invalid", () => {
    const clone: any = { isValid: true, patchName: "Test" }; // intentionally incomplete
    expect(() => encodeMonologueParameters(clone)).toThrow(/missing required sections/);
  });
});
