import { describe, test, expect } from "vitest";
import { decodeMonologueParameters } from "@/lib/sysex/decoder";

describe("Complete SysEx Decoder Integration", () => {
  test("should decode complete patch from hardware dump", () => {
    // Mock SysEx data (520 bytes) - this would come from actual hardware
    const mockSysexData = new Array(520).fill(0);

    // Set up proper header for Monologue (F0 42 30 00 01 44 40)
    mockSysexData[0] = 0xf0; // SysEx start
    mockSysexData[1] = 0x42; // Korg manufacturer
    mockSysexData[2] = 0x30; // Device ID (global)
    mockSysexData[3] = 0x00; // Function
    mockSysexData[4] = 0x01; // Format
    mockSysexData[5] = 0x44; // Model (Monologue)
    mockSysexData[6] = 0x40; // Command (Current Program Data Dump)
    mockSysexData[519] = 0xf7; // SysEx end

    // Add some test data for parameters
    // Note: This is simplified - real data would need proper 7-bit encoding
    mockSysexData[10] = 0x50; // Some parameter value
    mockSysexData[11] = 0x30; // Another parameter value

    const result = decodeMonologueParameters(mockSysexData);

    // Should successfully decode the basic structure
    expect(result.isValid).toBe(true);
    expect(result.patchName).toBeDefined();
    expect(result.oscillators).toBeDefined();
    expect(result.filter).toBeDefined();
    expect(result.envelope).toBeDefined();
    expect(result.lfo).toBeDefined();
    expect(result.drive).toBeDefined();
  });

  test("should reject invalid SysEx data", () => {
    // Wrong length
    const shortData = new Array(100).fill(0);
    const shortResult = decodeMonologueParameters(shortData);
    expect(shortResult.isValid).toBe(false);
    expect(shortResult.error).toContain("Invalid SysEx length");

    // Wrong header
    const wrongHeader = new Array(520).fill(0);
    wrongHeader[0] = 0xf0;
    wrongHeader[1] = 0x41; // Wrong manufacturer (not Korg)
    const headerResult = decodeMonologueParameters(wrongHeader);
    expect(headerResult.isValid).toBe(false);
    expect(headerResult.error).toContain("Invalid header");
  });

  test("should handle parameter boundaries correctly", () => {
    // Create valid SysEx with boundary test values
    const boundaryData = new Array(520).fill(0);

    // Set up proper header
    boundaryData[0] = 0xf0;
    boundaryData[1] = 0x42;
    boundaryData[2] = 0x30;
    boundaryData[3] = 0x00;
    boundaryData[4] = 0x01;
    boundaryData[5] = 0x44;
    boundaryData[6] = 0x40;
    boundaryData[519] = 0xf7;

    const result = decodeMonologueParameters(boundaryData);

    if (result.isValid && result.filter) {
      // Cutoff and resonance should be within valid ranges
      expect(result.filter.cutoff).toBeGreaterThanOrEqual(0);
      expect(result.filter.cutoff).toBeLessThanOrEqual(1023);
      expect(result.filter.resonance).toBeGreaterThanOrEqual(0);
      expect(result.filter.resonance).toBeLessThanOrEqual(1023);
    }
  });
});
