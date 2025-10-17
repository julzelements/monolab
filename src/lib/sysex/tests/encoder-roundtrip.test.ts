import { describe, it, expect } from "vitest";
import { encodeMonologueParameters } from "../encoder";
import { decodeMonologueParameters, type MonologueParameters } from "../decoder";

// Debug logging toggle: set MONOLOGUE_SYSEX_TEST_DEBUG=1 to enable verbose logs
const DEBUG = process.env.MONOLOGUE_SYSEX_TEST_DEBUG === "1";
const debug = (...args: any[]) => {
  if (DEBUG) console.log("[roundtrip]", ...args);
};
import fs from "fs";
import path from "path";

/**
 * Test round-trip encoding: decode -> encode -> decode
 */
function testRoundTrip(sysExData: number[]): {
  success: boolean;
  differences: string[];
  encodedSysex?: number[];
} {
  try {
    // Parse original
    const originalDecoded = decodeMonologueParameters(sysExData);
    debug("Original parsed successfully:", !!originalDecoded);

    if (!originalDecoded.isValid || originalDecoded.drive === undefined) {
      throw new Error(originalDecoded.error || "Invalid original parameters");
    }
    const original = originalDecoded as MonologueParameters;

    // Encode back
    const encoded = encodeMonologueParameters(original);
    debug("Encoded successfully, size:", encoded.length);

    // Parse again
    const roundTripDecoded = decodeMonologueParameters(encoded);
    debug("Round-trip parsed successfully:", !!roundTripDecoded);

    if (!roundTripDecoded.isValid || roundTripDecoded.drive === undefined) {
      throw new Error(roundTripDecoded.error || "Invalid round-trip parameters");
    }
    const roundTrip = roundTripDecoded as MonologueParameters;

    // Compare
    const differences: string[] = [];

    // Check basic structure
    if (!original || !roundTrip) {
      differences.push("Failed to parse one or both versions");
      return { success: false, differences, encodedSysex: encoded };
    }

    // Check sizes match
    if (encoded.length !== sysExData.length) {
      differences.push(`Size mismatch: original ${sysExData.length}, encoded ${encoded.length}`);
    }

    // Check header/footer match
    if (encoded[0] !== sysExData[0] || encoded[encoded.length - 1] !== sysExData[sysExData.length - 1]) {
      differences.push("Header or footer mismatch");
    }

    // Check a few key parameters
    if (original.drive !== roundTrip.drive) {
      differences.push(`Drive mismatch: ${original.drive} vs ${roundTrip.drive}`);
    }

    if (original.oscillators?.vco1?.wave !== roundTrip.oscillators?.vco1?.wave) {
      differences.push(
        `VCO1 wave mismatch: ${original.oscillators?.vco1?.wave} vs ${roundTrip.oscillators?.vco1?.wave}`
      );
    }

    return {
      success: differences.length === 0,
      differences,
      encodedSysex: encoded,
    };
  } catch (error) {
    return {
      success: false,
      differences: [`Error during round-trip: ${error}`],
      encodedSysex: undefined,
    };
  }
}

describe("Monologue Encoder", () => {
  describe("Round-trip encoding", () => {
    // Test each dump file for perfect round-trip accuracy
    const dumpFiles = ["dump1.json", "dump2.json", "dump3.json", "dump4.json", "dump5.json"];

    dumpFiles.forEach((dumpFile) => {
      it(`should perfectly round-trip ${dumpFile}`, () => {
        const dumpPath = path.join(__dirname, "data", "dumps", dumpFile);
        const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

        const roundTripResult = testRoundTrip(dump.rawData);

        // Log differences if any
        if (!roundTripResult.success && DEBUG) {
          console.warn(`[roundtrip] ${dumpFile} differences:`, roundTripResult.differences);
        }

        expect(roundTripResult.success).toBe(true);
        expect(roundTripResult.differences).toEqual([]);

        // Verify the encoded SysEx has the correct structure
        expect(roundTripResult.encodedSysex).toBeDefined();
        expect(roundTripResult.encodedSysex).toHaveLength(520);
        if (roundTripResult.encodedSysex) {
          expect(roundTripResult.encodedSysex[0]).toBe(0xf0); // SysEx start
          expect(roundTripResult.encodedSysex[1]).toBe(0x42); // Korg manufacturer
          expect(roundTripResult.encodedSysex[2]).toBe(0x30); // Device ID
          expect(roundTripResult.encodedSysex[519]).toBe(0xf7); // SysEx end
        }
      });
    });

    it("should maintain exact parameter values in round-trip", () => {
      const dumpPath = path.join(__dirname, "data", "dumps", "dump1.json");
      const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

      // Decode original
      const originalDecoded = decodeMonologueParameters(dump.rawData);
      expect(originalDecoded.isValid).toBe(true);
      expect(originalDecoded.drive).toBeDefined();
      const originalParams = originalDecoded as MonologueParameters;

      // Encode and decode again
      const encodedSysex = encodeMonologueParameters(originalParams);
      const redecodedDecoded = decodeMonologueParameters(encodedSysex);
      expect(redecodedDecoded.isValid).toBe(true);
      const redecodedParams = redecodedDecoded as MonologueParameters;

      // Check specific values we know from our tests
      expect(redecodedParams.patchName).toBe("<afx acid3>");
      expect(redecodedParams.filter?.cutoff).toBe(488);
      expect(redecodedParams.filter?.resonance).toBe(909);

      // Check that all sections are preserved
      expect(redecodedParams.drive).toBe(originalParams.drive);
      expect(redecodedParams.oscillators?.vco1).toEqual(originalParams.oscillators?.vco1);
      expect(redecodedParams.oscillators?.vco2).toEqual(originalParams.oscillators?.vco2);
      expect(redecodedParams.envelope).toEqual(originalParams.envelope);
      expect(redecodedParams.lfo).toEqual(originalParams.lfo);
      expect(redecodedParams.misc).toEqual(originalParams.misc);
    });
  });

  describe("Error handling", () => {
    it("should reject invalid parameters", () => {
      const invalidParams = {
        isValid: false,
        patchName: "Test",
      };

      expect(() => {
        encodeMonologueParameters(invalidParams as any);
      }).toThrow("Invalid parameters: missing required sections");
    });
  });

  describe("SysEx structure validation", () => {
    it("should generate valid SysEx structure", () => {
      const dumpPath = path.join(__dirname, "data", "dumps", "dump2.json");
      const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

      const originalDecoded = decodeMonologueParameters(dump.rawData);
      expect(originalDecoded.isValid).toBe(true);
      expect(originalDecoded.drive).toBeDefined();
      const originalParams = originalDecoded as MonologueParameters;

      const encodedSysex = encodeMonologueParameters(originalParams);

      // Check SysEx structure
      expect(encodedSysex).toHaveLength(520);

      // Check header
      expect(encodedSysex.slice(0, 7)).toEqual([0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]);

      // Check terminator
      expect(encodedSysex[519]).toBe(0xf7);

      // Check all data bytes are 7-bit safe (0-127)
      for (let i = 7; i < 519; i++) {
        expect(encodedSysex[i]).toBeGreaterThanOrEqual(0);
        expect(encodedSysex[i]).toBeLessThanOrEqual(127);
      }
    });
  });
});
