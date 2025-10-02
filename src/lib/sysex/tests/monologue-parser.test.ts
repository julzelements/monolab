import { describe, it, expect } from "vitest";
import { parseMonologueSysEx } from "../monologue-parser";
import fs from "fs";
import path from "path";

// Expected results for each dump file
const expectedResults = {
  "dump1.json": {
    patchName: "<afx acid3>",
    cutoff: 488,
    resonance: 909,
  },
  "dump2.json": {
    patchName: "Injection",
    cutoff: 687,
    resonance: 852,
  },
  "dump3.json": {
    patchName: "Anfem",
    cutoff: 90,
    resonance: 579,
  },
  "dump4.json": {
    patchName: "<wavetable>",
    cutoff: 756,
    resonance: 0,
  },
  "dump5.json": {
    patchName: "Lu-Fuki",
    cutoff: 176,
    resonance: 736,
  },
};

describe("Monologue SysEx Parser", () => {
  describe("parseMonologueSysEx", () => {
    it("should reject invalid SysEx length", () => {
      const shortData = new Array(100).fill(0);
      const result = parseMonologueSysEx(shortData);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid SysEx length");
    });

    it("should reject invalid SysEx header", () => {
      const invalidData = new Array(520).fill(0);
      // Set invalid header (should start with 0xF0, 0x42, 0x30)
      invalidData[0] = 0xff;

      const result = parseMonologueSysEx(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid header at byte");
    });

    // Test each dump file
    Object.entries(expectedResults).forEach(([filename, expected]) => {
      it(`should correctly parse ${filename}`, () => {
        const dumpPath = path.join(__dirname, "data", "dumps", filename);
        const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

        const result = parseMonologueSysEx(dump.rawData);

        expect(result.isValid).toBe(true);
        expect(result.patchName).toBe(expected.patchName);
        expect(result.vcf).toBeDefined();
        expect(result.vcf!.cutoff).toBe(expected.cutoff);
        expect(result.vcf!.resonance).toBe(expected.resonance);
      });
    });

    it("should parse all dump files successfully", () => {
      const dumpsDir = path.join(__dirname, "data", "dumps");
      const dumpFiles = fs
        .readdirSync(dumpsDir)
        .filter((file) => file.endsWith(".json"))
        .sort();

      expect(dumpFiles).toHaveLength(5);

      let successCount = 0;
      for (const dumpFile of dumpFiles) {
        const dumpPath = path.join(dumpsDir, dumpFile);
        const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

        const result = parseMonologueSysEx(dump.rawData);

        if (result.isValid && result.vcf) {
          successCount++;
        }
      }

      expect(successCount).toBe(5);
    });
  });

  describe("edge cases", () => {
    it("should handle malformed data gracefully", () => {
      const malformedData = new Array(520).fill(0);
      // Set valid header
      malformedData[0] = 0xf0;
      malformedData[1] = 0x42;
      malformedData[2] = 0x30;

      const result = parseMonologueSysEx(malformedData);

      // Should either parse successfully or fail gracefully with error
      expect(typeof result.isValid).toBe("boolean");
      if (!result.isValid) {
        expect(result.error).toBeDefined();
      }
    });
  });
});
