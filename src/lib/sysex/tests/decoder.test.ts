import { describe, it, expect } from "vitest";
import { decodeMonologueParameters, getVCFMidiValues, to7BitMidiValue, from7BitMidiValue } from "../decoder";
import fs from "fs";
import path from "path";

describe("Monologue Decoder", () => {
  describe("Utility functions", () => {
    it("should convert 10-bit to 7-bit MIDI values correctly", () => {
      expect(to7BitMidiValue(0)).toBe(0);
      expect(to7BitMidiValue(1023)).toBe(127);
      expect(to7BitMidiValue(512)).toBe(64); // 512/1023 * 127 ≈ 63.53 → rounds to 64
    });

    it("should convert 7-bit MIDI to 10-bit values correctly", () => {
      expect(from7BitMidiValue(0)).toBe(0);
      expect(from7BitMidiValue(127)).toBe(1023);
      expect(from7BitMidiValue(64)).toBe(516);
    });
  });

  describe("decodeMonologueParameters", () => {
    it("should reject invalid SysEx length", () => {
      const shortData = new Array(100).fill(0);
      const result = decodeMonologueParameters(shortData);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid SysEx length");
    });

    it("should reject invalid SysEx header", () => {
      const invalidData = new Array(520).fill(0);
      // Set invalid header (should start with 0xF0, 0x42, 0x30)
      invalidData[0] = 0xff;

      const result = decodeMonologueParameters(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid header at byte");
    });

    // Test with real dump data
    it("should decode dump1.json completely", () => {
      const dumpPath = path.join(__dirname, "data", "dumps", "dump1.json");
      const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

      const result = decodeMonologueParameters(dump.rawData);

      expect(result.isValid).toBe(true);
      expect(result.patchName).toBe("<afx acid3>");

      // Check VCF parameters match our working parser
      expect(result.filter?.cutoff).toBe(488);
      expect(result.filter?.resonance).toBe(909);

      // Check that all sections are populated
      expect(result.drive).toBeDefined();
      expect(result.oscillators).toBeDefined();
      expect(result.envelope).toBeDefined();
      expect(result.lfo).toBeDefined();
      expect(result.misc).toBeDefined();

      // Check specific parameter types
      expect(typeof result.drive).toBe("number");
      expect(typeof result.oscillators?.vco1.wave).toBe("number");
      expect(typeof result.oscillators?.vco2.sync).toBe("number");
      expect(typeof result.envelope?.type).toBe("number");
      expect(typeof result.lfo?.mode).toBe("number");
      expect(typeof result.misc?.bpmSync).toBe("boolean");
    });

    it("should decode all test dumps successfully", () => {
      const dumpsDir = path.join(__dirname, "data", "dumps");
      const dumpFiles = fs
        .readdirSync(dumpsDir)
        .filter((file) => file.endsWith(".json"))
        .sort();

      for (const dumpFile of dumpFiles) {
        const dumpPath = path.join(dumpsDir, dumpFile);
        const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

        const result = decodeMonologueParameters(dump.rawData);

        expect(result.isValid).toBe(true);
        expect(result.patchName).toBeDefined();
        expect(result.filter).toBeDefined();
        expect(result.oscillators).toBeDefined();
        expect(result.envelope).toBeDefined();
        expect(result.lfo).toBeDefined();
        expect(result.misc).toBeDefined();
      }
    });
  });

  describe("getVCFMidiValues", () => {
    it("should convert VCF parameters to MIDI CC values", () => {
      const dumpPath = path.join(__dirname, "data", "dumps", "dump1.json");
      const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

      const params = decodeMonologueParameters(dump.rawData);
      const midiValues = getVCFMidiValues(params);

      expect(midiValues).toBeDefined();
      expect(midiValues?.cutoff).toBe(to7BitMidiValue(488));
      expect(midiValues?.resonance).toBe(to7BitMidiValue(909));
    });

    it("should return null for invalid parameters", () => {
      const invalidParams = { isValid: false, patchName: "" };
      const result = getVCFMidiValues(invalidParams);
      expect(result).toBeNull();
    });
  });
});
