import { describe, test, expect } from "vitest";
import { parameterToMidiCC, midiCCToParameter, parametersToMidiCCs } from "@/utils/midi-cc";
import { MonologueParameters } from "@/lib/sysex/decoder";

describe("MIDI CC Integration", () => {
  test("should convert continuous parameters to MIDI CC correctly", () => {
    // Test drive parameter (0-1023 to 0-127)
    const driveResult = parameterToMidiCC("drive", 512);
    expect(driveResult).toEqual({ cc: 28, midiValue: 64 }); // 512/1023 * 127 ≈ 64

    // Test filter cutoff
    const cutoffResult = parameterToMidiCC("filter.cutoff", 1023);
    expect(cutoffResult).toEqual({ cc: 43, midiValue: 127 });

    // Test VCO2 pitch (-512 to +511 range)
    // 0 -> (0 + 512) / 1024 * 127 = 512/1024 * 127 = 64
    const pitchResult = parameterToMidiCC("oscillators.vco2.pitch", 0);
    expect(pitchResult).toEqual({ cc: 35, midiValue: 64 }); // 0 -> center value 64
  });

  test("should convert discrete parameters to MIDI CC correctly", () => {
    // Test VCO1 wave (SQR=0, TRI=1, SAW=2)
    const sqrResult = parameterToMidiCC("oscillators.vco1.wave", 0);
    expect(sqrResult).toEqual({ cc: 50, midiValue: 0 });

    const triResult = parameterToMidiCC("oscillators.vco1.wave", 1);
    expect(triResult).toEqual({ cc: 50, midiValue: 64 });

    const sawResult = parameterToMidiCC("oscillators.vco1.wave", 2);
    expect(sawResult).toEqual({ cc: 50, midiValue: 127 });
  });

  test("should convert MIDI CC back to parameters correctly", () => {
    // Test continuous parameter - allow for rounding differences
    const driveParam = midiCCToParameter(28, 64);
    expect(driveParam?.parameter).toBe("drive");
    expect(driveParam?.value).toBeCloseTo(516, 0); // 64/127 * 1023 ≈ 516

    // Test discrete parameter - VCO1 wave
    const sqrParam = midiCCToParameter(50, 20); // In SQR range (0-42)
    expect(sqrParam).toEqual({ parameter: "oscillators.vco1.wave", value: 0 });

    const triParam = midiCCToParameter(50, 60); // In TRI range (43-85)
    expect(triParam).toEqual({ parameter: "oscillators.vco1.wave", value: 1 });

    const sawParam = midiCCToParameter(50, 100); // In SAW range (86-127)
    expect(sawParam).toEqual({ parameter: "oscillators.vco1.wave", value: 2 });
  });

  test("should batch convert multiple parameters", () => {
    const testParams: Partial<MonologueParameters> = {
      drive: 512,
      filter: {
        cutoff: 1023,
        resonance: 256,
      },
      oscillators: {
        vco1: {
          wave: 1, // TRI
          shape: 128,
          level: 1023,
          octave: 1, // 8'
        },
        vco2: {
          wave: 2, // SAW
          shape: 256,
          level: 512,
          pitch: 100,
          sync: 1, // OFF
          octave: 1, // 8'
        },
      },
    };

    const results = parametersToMidiCCs(testParams);

    // Should contain multiple supported parameters
    expect(results.length).toBeGreaterThan(5);

    // Check specific mappings - allow for rounding differences
    const driveMapping = results.find((r) => r.parameter === "drive");
    expect(driveMapping?.cc).toBe(28);
    expect(driveMapping?.parameter).toBe("drive");
    expect(driveMapping?.midiValue).toBeCloseTo(64, 0); // 512/1023 * 127 ≈ 64

    const waveMapping = results.find((r) => r.parameter === "oscillators.vco1.wave");
    expect(waveMapping).toEqual({ cc: 50, midiValue: 64, parameter: "oscillators.vco1.wave" });
  });

  test("should handle unsupported parameters gracefully", () => {
    // Test parameter that doesn't support MIDI CC
    const result = parameterToMidiCC("unsupported.parameter", 100);
    expect(result).toBeNull();

    // Test unsupported CC number
    const ccResult = midiCCToParameter(999, 64);
    expect(ccResult).toBeNull();
  });

  test("should handle edge cases and value ranges", () => {
    // Test negative values for signed parameters
    const negPitchResult = parameterToMidiCC("oscillators.vco2.pitch", -512);
    expect(negPitchResult).toEqual({ cc: 35, midiValue: 0 }); // Minimum value

    const posPitchResult = parameterToMidiCC("oscillators.vco2.pitch", 511);
    expect(posPitchResult).toEqual({ cc: 35, midiValue: 127 }); // Maximum value

    // Test out-of-range MIDI values - should clamp to valid ranges
    const invalidCCParam = midiCCToParameter(43, 127); // Maximum valid value
    expect(invalidCCParam?.value).toBeLessThanOrEqual(1023);
  });
});
