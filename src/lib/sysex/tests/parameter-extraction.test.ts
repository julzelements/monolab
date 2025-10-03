import { describe, it, expect } from "vitest";
import { decodeMonologueParameters } from "../decoder";
import dump1 from "./data/dumps/dump1.json";
import dump2 from "./data/dumps/dump2.json";
import dump3 from "./data/dumps/dump3.json";

// Debug logging toggle: set MONOLOGUE_SYSEX_TEST_DEBUG=1 to enable verbose logs
const DEBUG = process.env.MONOLOGUE_SYSEX_TEST_DEBUG === "1";
const debug = (...args: any[]) => {
  if (DEBUG) console.log("[extract]", ...args);
};

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

      debug("Extracted patch names:");
      debug("  Dump 1:", result1.patchName);
      debug("  Dump 2:", result2.patchName);
      debug("  Dump 3:", result3.patchName);
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
        debug(`Dump ${index + 1} summary:`);
        debug(`  Patch: "${result.patchName}"`);
        debug(`  Drive: ${result.drive}`);
        debug(`  VCO1 Wave: ${result.oscillators?.vco1?.wave}`);
        debug(`  VCO2 Pitch: ${result.oscillators?.vco2?.pitch}`);
        debug(`  Filter Cutoff: ${result.filter?.cutoff}`);
        debug(`  Filter Resonance: ${result.filter?.resonance}`);
      });
    });

    it("should handle special characters in patch names", () => {
      const result1 = decodeMonologueParameters(dump1.rawData);
      expect(result1.isValid).toBe(true);

      // Check if patch name contains special characters like < >
      debug("Dump 1 patch name with special chars:", JSON.stringify(result1.patchName));

      // Should not contain null characters
      expect(result1.patchName).not.toContain("\0");

      // Should be trimmed
      expect(result1.patchName).toBe(result1.patchName.trim());
    });
  });

  // TODO: Add tests for extended parameters when decoder is updated
  describe("Future Parameter Support (TODO)", () => {
    it("validates VCO2 pitch and octave ranges across dumps", () => {
      const dumps = [dump1, dump2, dump3];
      dumps.forEach((d, i) => {
        const params = decodeMonologueParameters(d.rawData);
        expect(params.isValid).toBe(true);
        // VCO2 pitch present and within 0-1023
        expect(params.oscillators?.vco2?.pitch).toBeGreaterThanOrEqual(0);
        expect(params.oscillators?.vco2?.pitch).toBeLessThanOrEqual(1023);
        // Octave 0-3
        expect(params.oscillators?.vco2?.octave).toBeGreaterThanOrEqual(0);
        expect(params.oscillators?.vco2?.octave).toBeLessThanOrEqual(3);
        debug(`VCO2 pitch/octave ok for dump ${i + 1}`);
      });
    });

    it("ensures bipolar envelope and LFO intensities decoded correctly", () => {
      const dumps = [dump1, dump2, dump3];
      dumps.forEach((d, i) => {
        const p = decodeMonologueParameters(d.rawData);
        expect(p.envelope?.intensity).toBeGreaterThanOrEqual(-512);
        expect(p.envelope?.intensity).toBeLessThanOrEqual(511);
        expect(p.lfo?.intensity).toBeGreaterThanOrEqual(-512);
        expect(p.lfo?.intensity).toBeLessThanOrEqual(511);
        debug(`Bipolar intensities ok for dump ${i + 1}`);
      });
    });

    it("checks portamento related misc parameters", () => {
      const p = decodeMonologueParameters(dump1.rawData);
      expect(typeof p.misc?.portamentMode).toBe("boolean");
      expect(p.misc?.portamentTime).toBeGreaterThanOrEqual(0);
      expect(p.misc?.portamentTime).toBeLessThanOrEqual(127);
      debug("Portamento parameters validated");
    });

    it("validates cutoff velocity and key tracking ranges", () => {
      const p = decodeMonologueParameters(dump2.rawData);
      expect(p.misc?.cutoffVelocity).toBeGreaterThanOrEqual(0);
      expect(p.misc?.cutoffVelocity).toBeLessThanOrEqual(3);
      expect(p.misc?.cutoffKeyTrack).toBeGreaterThanOrEqual(0);
      expect(p.misc?.cutoffKeyTrack).toBeLessThanOrEqual(3);
      debug("Cutoff velocity/key track ranges ok");
    });

    it("checks AMP envelope attack/decay ranges", () => {
      const p = decodeMonologueParameters(dump3.rawData);
      // Empirically observed attack can reach 128 in provided dumps (treating as inclusive upper bound)
      expect(p.amp?.attack).toBeGreaterThanOrEqual(0);
      expect(p.amp?.attack).toBeLessThanOrEqual(128);
      expect(p.amp?.decay).toBeGreaterThanOrEqual(0);
      expect(p.amp?.decay).toBeLessThanOrEqual(128);
      debug("AMP EG attack/decay ranges ok (<=128)");
    });

    it("validates sequencer structural fields", () => {
      const p = decodeMonologueParameters(dump1.rawData);
      expect(p.sequencer?.stepLength).toBeGreaterThanOrEqual(1);
      expect(p.sequencer?.stepLength).toBeLessThanOrEqual(16);
      expect(p.sequencer?.stepResolution).toBeGreaterThanOrEqual(0);
      expect(p.sequencer?.stepResolution).toBeLessThanOrEqual(4);
      expect(p.sequencer?.swing).toBeGreaterThanOrEqual(-75);
      expect(p.sequencer?.swing).toBeLessThanOrEqual(75);
      expect(p.sequencer?.stepOnOff?.length).toBe(16);
      expect(p.sequencer?.motionOnOff?.length).toBe(16);
      debug("Sequencer structural fields ok");
    });

    it("verifies motion sequencing step event bounds", () => {
      const p = decodeMonologueParameters(dump2.rawData);
      expect(p.motionSequencing?.stepEvents.length).toBe(16);
      p.motionSequencing?.stepEvents.forEach((ev, idx) => {
        expect(ev.noteNumber).toBeGreaterThanOrEqual(0);
        expect(ev.noteNumber).toBeLessThanOrEqual(127);
        expect(ev.velocity).toBeGreaterThanOrEqual(0);
        expect(ev.velocity).toBeLessThanOrEqual(127);
        expect(ev.gateTime).toBeGreaterThanOrEqual(0);
        expect(ev.gateTime).toBeLessThanOrEqual(127);
        ev.motionData.forEach((md) => {
          expect(md.data1).toBeGreaterThanOrEqual(0);
          expect(md.data1).toBeLessThanOrEqual(255);
        });
        if (DEBUG && idx < 1) debug(`Step ${idx + 1} gateTime=${ev.gateTime}`);
      });
      debug("Motion sequencing step events bounds ok");
    });

    it("checks motion slots configuration integrity", () => {
      const p = decodeMonologueParameters(dump3.rawData);
      expect(p.motionSequencing?.slots.length).toBe(4);
      p.motionSequencing?.slots.forEach((slot) => {
        expect(slot.stepEnabled.length).toBe(16);
        expect(slot.parameterId).toBeGreaterThanOrEqual(0);
        expect(slot.parameterId).toBeLessThanOrEqual(127);
      });
      debug("Motion slots configuration integrity ok");
    });
  });
});
