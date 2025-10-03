import { describe, it, expect } from "vitest";
import { safeEncodeMonologueParameters, decodeMonologueParameters } from "../index";
import fs from "fs";
import path from "path";

describe("safeEncodeMonologueParameters", () => {
  it("returns ok=true for valid parameter set", () => {
    const dumpPath = path.join(__dirname, "data", "dumps", "dump3.json");
    const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
    const params = decodeMonologueParameters(dump.rawData);
    const result = safeEncodeMonologueParameters(params);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBe(520);
    }
  });

  it("returns structured error for invalid params (missing sections)", () => {
    const invalidParams: any = { isValid: false, patchName: "Bad" };
    const result = safeEncodeMonologueParameters(invalidParams);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain("isValid=false");
      expect(result.error).toMatch(/Invalid parameters/);
    }
  });
});
