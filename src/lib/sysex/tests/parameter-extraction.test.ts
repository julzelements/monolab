import { describe, it, expect } from "vitest";
import { decodeMonologueParameters } from "../decoder";
import dump1 from "./data/dumps/dump1.json";
import dump2 from "./data/dumps/dump2.json";
import dump3 from "./data/dumps/dump3.json";

/**
 * Comprehensive tests for Monologue parameters
 * Testing the current implementation and preparing for complete MIDI spec
 */
describe("Monologue Parameter Extraction", () => {
  describe("Current VCO Parameters", () => {
    it("should extract VCO1 parameters", () => {
      const result = decodeMonologueParameters(dump1.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.oscillators?.vco1?.wave).toBe("number");
      expect(typeof result.oscillators?.vco1?.shape).toBe("number");
      expect(typeof result.oscillators?.vco1?.level).toBe("number");

      // Wave should be 0-3 (SAW, TRI, SQR, NOISE)
      if (result.oscillators?.vco1?.wave !== undefined) {
        expect(result.oscillators.vco1.wave).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco1.wave).toBeLessThanOrEqual(3);
      }

      // Shape and level should be 0-1023
      if (result.oscillators?.vco1?.shape !== undefined) {
        expect(result.oscillators.vco1.shape).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco1.shape).toBeLessThanOrEqual(1023);
      }

      if (result.oscillators?.vco1?.level !== undefined) {
        expect(result.oscillators.vco1.level).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco1.level).toBeLessThanOrEqual(1023);
      }
    });

    it("should extract VCO2 parameters including pitch and sync", () => {
      const result = decodeMonologueParameters(dump2.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.oscillators?.vco2?.wave).toBe("number");
      expect(typeof result.oscillators?.vco2?.shape).toBe("number");
      expect(typeof result.oscillators?.vco2?.level).toBe("number");
      expect(typeof result.oscillators?.vco2?.pitch).toBe("number");
      expect(typeof result.oscillators?.vco2?.sync).toBe("number");
      expect(typeof result.oscillators?.vco2?.octave).toBe("number");

      // Validate ranges
      if (result.oscillators?.vco2?.wave !== undefined) {
        expect(result.oscillators.vco2.wave).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco2.wave).toBeLessThanOrEqual(3);
      }

      if (result.oscillators?.vco2?.pitch !== undefined) {
        expect(result.oscillators.vco2.pitch).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco2.pitch).toBeLessThanOrEqual(1023);
      }

      if (result.oscillators?.vco2?.sync !== undefined) {
        expect(result.oscillators.vco2.sync).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco2.sync).toBeLessThanOrEqual(3);
      }

      if (result.oscillators?.vco2?.octave !== undefined) {
        expect(result.oscillators.vco2.octave).toBeGreaterThanOrEqual(0);
        expect(result.oscillators.vco2.octave).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("Filter Parameters", () => {
    it("should extract filter cutoff and resonance", () => {
      const result = decodeMonologueParameters(dump1.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.filter?.cutoff).toBe("number");
      expect(typeof result.filter?.resonance).toBe("number");

      if (result.filter?.cutoff !== undefined) {
        expect(result.filter.cutoff).toBeGreaterThanOrEqual(0);
        expect(result.filter.cutoff).toBeLessThanOrEqual(1023);
      }

      if (result.filter?.resonance !== undefined) {
        expect(result.filter.resonance).toBeGreaterThanOrEqual(0);
        expect(result.filter.resonance).toBeLessThanOrEqual(1023);
      }
    });
  });

  describe("Envelope Parameters", () => {
    it("should extract envelope parameters", () => {
      const result = decodeMonologueParameters(dump2.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.envelope?.type).toBe("number");
      expect(typeof result.envelope?.attack).toBe("number");
      expect(typeof result.envelope?.decay).toBe("number");
      expect(typeof result.envelope?.intensity).toBe("number");
      expect(typeof result.envelope?.target).toBe("number");

      if (result.envelope?.type !== undefined) {
        expect(result.envelope.type).toBeGreaterThanOrEqual(0);
        expect(result.envelope.type).toBeLessThanOrEqual(3);
      }

      if (result.envelope?.attack !== undefined) {
        expect(result.envelope.attack).toBeGreaterThanOrEqual(0);
        expect(result.envelope.attack).toBeLessThanOrEqual(1023);
      }

      if (result.envelope?.decay !== undefined) {
        expect(result.envelope.decay).toBeGreaterThanOrEqual(0);
        expect(result.envelope.decay).toBeLessThanOrEqual(1023);
      }

      // Intensity is bipolar: -512 to +511
      if (result.envelope?.intensity !== undefined) {
        expect(result.envelope.intensity).toBeGreaterThanOrEqual(-512);
        expect(result.envelope.intensity).toBeLessThanOrEqual(511);
      }

      if (result.envelope?.target !== undefined) {
        expect(result.envelope.target).toBeGreaterThanOrEqual(0);
        expect(result.envelope.target).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("LFO Parameters", () => {
    it("should extract LFO parameters", () => {
      const result = decodeMonologueParameters(dump3.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.lfo?.wave).toBe("number");
      expect(typeof result.lfo?.mode).toBe("number");
      expect(typeof result.lfo?.rate).toBe("number");
      expect(typeof result.lfo?.intensity).toBe("number");
      expect(typeof result.lfo?.target).toBe("number");

      if (result.lfo?.wave !== undefined) {
        expect(result.lfo.wave).toBeGreaterThanOrEqual(0);
        expect(result.lfo.wave).toBeLessThanOrEqual(3);
      }

      if (result.lfo?.mode !== undefined) {
        expect(result.lfo.mode).toBeGreaterThanOrEqual(0);
        expect(result.lfo.mode).toBeLessThanOrEqual(3);
      }

      if (result.lfo?.rate !== undefined) {
        expect(result.lfo.rate).toBeGreaterThanOrEqual(0);
        expect(result.lfo.rate).toBeLessThanOrEqual(1023);
      }

      // Intensity is bipolar: -512 to +511
      if (result.lfo?.intensity !== undefined) {
        expect(result.lfo.intensity).toBeGreaterThanOrEqual(-512);
        expect(result.lfo.intensity).toBeLessThanOrEqual(511);
      }

      if (result.lfo?.target !== undefined) {
        expect(result.lfo.target).toBeGreaterThanOrEqual(0);
        expect(result.lfo.target).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("Misc Parameters", () => {
    it("should extract misc parameters", () => {
      const result = decodeMonologueParameters(dump1.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.misc?.bpmSync).toBe("boolean");
      expect(typeof result.misc?.portamentMode).toBe("boolean");
      expect(typeof result.misc?.portamentTime).toBe("number");
      expect(typeof result.misc?.cutoffVelocity).toBe("number");
      expect(typeof result.misc?.cutoffKeyTrack).toBe("number");
      expect(typeof result.misc?.sliderAssign).toBe("string");

      if (result.misc?.portamentTime !== undefined) {
        expect(result.misc.portamentTime).toBeGreaterThanOrEqual(0);
        expect(result.misc.portamentTime).toBeLessThanOrEqual(127);
      }

      if (result.misc?.cutoffVelocity !== undefined) {
        expect(result.misc.cutoffVelocity).toBeGreaterThanOrEqual(0);
        expect(result.misc.cutoffVelocity).toBeLessThanOrEqual(3);
      }

      if (result.misc?.cutoffKeyTrack !== undefined) {
        expect(result.misc.cutoffKeyTrack).toBeGreaterThanOrEqual(0);
        expect(result.misc.cutoffKeyTrack).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("Drive Parameter", () => {
    it("should extract drive parameter", () => {
      const result = decodeMonologueParameters(dump2.rawData);
      expect(result.isValid).toBe(true);

      expect(typeof result.drive).toBe("number");

      if (result.drive !== undefined) {
        expect(result.drive).toBeGreaterThanOrEqual(0);
        expect(result.drive).toBeLessThanOrEqual(1023);
      }
    });
  });

  describe("Data Integrity and Patch Names", () => {
    it("should extract valid patch names from all dumps", () => {
      const result1 = decodeMonologueParameters(dump1.rawData);
      const result2 = decodeMonologueParameters(dump2.rawData);
      const result3 = decodeMonologueParameters(dump3.rawData);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(true);
      expect(result3.isValid).toBe(true);

      expect(result1.patchName).toBeDefined();
      expect(result2.patchName).toBeDefined();
      expect(result3.patchName).toBeDefined();

      expect(result1.patchName.length).toBeGreaterThan(0);
      expect(result2.patchName.length).toBeGreaterThan(0);
      expect(result3.patchName.length).toBeGreaterThan(0);

      console.log("Extracted patch names:");
      console.log("  Dump 1:", result1.patchName);
      console.log("  Dump 2:", result2.patchName);
      console.log("  Dump 3:", result3.patchName);
    });

    it("should maintain consistent structure across all dumps", () => {
      const dumps = [dump1, dump2, dump3];

      dumps.forEach((dump, index) => {
        const result = decodeMonologueParameters(dump.rawData);
        expect(result.isValid).toBe(true);

        // All major sections should be present
        expect(result.oscillators).toBeDefined();
        expect(result.filter).toBeDefined();
        expect(result.envelope).toBeDefined();
        expect(result.lfo).toBeDefined();
        expect(result.misc).toBeDefined();
        expect(result.drive).toBeDefined();

        // Log some key values for inspection
        console.log(`Dump ${index + 1} summary:`);
        console.log(`  Patch: "${result.patchName}"`);
        console.log(`  Drive: ${result.drive}`);
        console.log(`  VCO1 Wave: ${result.oscillators?.vco1?.wave}`);
        console.log(`  VCO2 Pitch: ${result.oscillators?.vco2?.pitch}`);
        console.log(`  Filter Cutoff: ${result.filter?.cutoff}`);
        console.log(`  Filter Resonance: ${result.filter?.resonance}`);
      });
    });

    it("should handle special characters in patch names", () => {
      const result1 = decodeMonologueParameters(dump1.rawData);
      expect(result1.isValid).toBe(true);

      // Check if patch name contains special characters like < >
      console.log("Dump 1 patch name with special chars:", JSON.stringify(result1.patchName));

      // Should not contain null characters
      expect(result1.patchName).not.toContain("\0");

      // Should be trimmed
      expect(result1.patchName).toBe(result1.patchName.trim());
    });
  });

  // TODO: Add tests for extended parameters when decoder is updated
  describe("Future Parameter Support (TODO)", () => {
    it("should be ready to test VCO pitch parameters with special curve", () => {
      // This test is a placeholder for when we implement VCO1 pitch decoding
      console.log("TODO: Test VCO pitch parameters (0-1023 with special curve)");
      console.log("TODO: Test VCO octave settings (0-3 = 16', 8', 4', 2')");
      console.log("TODO: Test keyboard octave (0-4 = -2 to +2)");
    });

    it("should be ready to test tuning parameters", () => {
      console.log("TODO: Test program tuning (0-100 = -50 to +50 cents)");
      console.log("TODO: Test micro tuning (0-139)");
      console.log("TODO: Test scale key (0-24 = -12 to +12 keys)");
    });

    it("should be ready to test portamento settings", () => {
      console.log("TODO: Test portamento mode (Auto/On)");
      console.log("TODO: Test portamento time (0=OFF, 1-128)");
      console.log("TODO: Test slide time (0-72 = 0-100%)");
    });

    it("should be ready to test pitch bend range", () => {
      console.log("TODO: Test pitch bend range plus (1-12 semitones)");
      console.log("TODO: Test pitch bend range minus (1-12 semitones)");
    });

    it("should be ready to test program level and amp velocity", () => {
      console.log("TODO: Test program level (77-127 = -25 to +25)");
      console.log("TODO: Test amp velocity (0-127)");
    });

    it("should be ready to test complete sequencer data", () => {
      console.log("TODO: Test BPM (100-3000 = 10.0-300.0)");
      console.log("TODO: Test step length (1-16)");
      console.log("TODO: Test step resolution (0-4)");
      console.log("TODO: Test swing (-75 to +75)");
      console.log("TODO: Test default gate time (0-72 = 0-100%)");
      console.log("TODO: Test sequencer trigger on/off");
    });

    it("should be ready to test step data (16 steps × 22 bytes each)", () => {
      console.log("TODO: Test 16 steps with note data");
      console.log("TODO: Test step on/off, motion on/off, slide on/off");
      console.log("TODO: Test note number (0-127)");
      console.log("TODO: Test velocity (0-127)");
      console.log("TODO: Test gate time (0-72=0-100%, 73-127=TIE)");
      console.log("TODO: Test trigger switch");
      console.log("TODO: Test motion data (4 slots × 4 data points = 0-255)");
    });

    it("should be ready to test motion slots (4 slots)", () => {
      console.log("TODO: Test motion slot configuration");
      console.log("TODO: Test motion slot parameter assignments");
      console.log("TODO: Test per-step motion slot enable/disable (16 steps each)");
    });
  });
});
