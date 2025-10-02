/**
 * Korg Monologue Parameter Decoder
 *
 * Extracts specific parameters from decoded 8-bit SysEx data
 * according to the Korg Monologue MIDI Implementation Chart
 */

import { decode7BitTo8Bit } from "./encoder";

export interface MonologueParameters {
  // Basic info
  isValid: boolean;
  patchName?: string;
  error?: string;

  // VCF Parameters (our MVP focus)
  vcf?: {
    cutoff: number; // 0-1023 internal, maps to 0-127 MIDI CC
    resonance: number; // 0-1023 internal, maps to 0-127 MIDI CC
  };

  // VCO Parameters (for future expansion)
  vco?: {
    vco1Pitch: number; // 0-1023 internal
    vco1Shape: number; // 0-1023 internal
    vco2Pitch: number; // 0-1023 internal
    vco2Shape: number; // 0-1023 internal
    vco1Level: number; // 0-1023 internal
    vco2Level: number; // 0-1023 internal
  };

  // EG/LFO Parameters (for future expansion)
  modulation?: {
    egAttack: number; // 0-1023 internal
    egDecay: number; // 0-1023 internal
    lfoRate: number; // 0-1023 internal
    lfoInt: number; // 0-1023 internal
    egInt: number; // 0-1023 internal
    drive: number; // 0-1023 internal
  };
}

/**
 * Convert 10-bit internal value (0-1023) to MIDI CC value (0-127)
 */
function to7BitMidiValue(value10bit: number): number {
  // Scale from 0-1023 to 0-127
  return Math.round((value10bit / 1023) * 127);
}

/**
 * Convert MIDI CC value (0-127) to 10-bit internal value (0-1023)
 */
function from7BitMidiValue(valueMidi: number): number {
  // Scale from 0-127 to 0-1023
  return Math.round((valueMidi / 127) * 1023);
}
/**
 * Decode Monologue SysEx and extract parameters
 */
export function decodeMonologueParameters(rawSysexData: number[]): MonologueParameters {
  // Validate basic SysEx structure
  if (rawSysexData.length !== 520) {
    return {
      isValid: false,
      error: `Invalid SysEx length: ${rawSysexData.length}, expected 520`,
    };
  }

  // Validate header
  const expectedHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
  for (let i = 0; i < expectedHeader.length; i++) {
    if (rawSysexData[i] !== expectedHeader[i]) {
      return {
        isValid: false,
        error: `Invalid header at byte ${i}`,
      };
    }
  }

  // Extract data section (skip 7-byte header and 1-byte terminator)
  const midiDataSection = rawSysexData.slice(7, -1); // 512 bytes

  // Decode 7-bit MIDI data to 8-bit internal data
  const decoded = decode7BitTo8Bit(midiDataSection);
  if (!decoded.success) {
    return {
      isValid: false,
      error: `Failed to decode 7-bit data: ${decoded.error}`,
    };
  }

  console.log(`🔄 Decoded ${decoded.length} bytes of 8-bit data from ${midiDataSection.length} bytes of 7-bit data`);

  // Extract patch name (starts at offset 4, 12 bytes)
  let patchName = "";
  for (let i = 4; i < 16 && i < decoded.data.length; i++) {
    const byte = decoded.data[i];
    if (byte === 0) break; // Null terminator
    if (byte === 0xbe) {
      patchName += ">"; // Handle corrupted '>' character
    } else if (byte >= 32 && byte <= 126) {
      // Printable ASCII
      patchName += String.fromCharCode(byte);
    } else {
      patchName += " "; // Replace non-printable with space
    }
  }
  patchName = patchName.trimEnd(); // Remove trailing spaces

  // Extract VCF parameters based on real hardware analysis
  let cutoff10bit = 0;
  let resonance10bit = 0;

  // Resonance at offset 30-31 (little-endian 10-bit)
  if (decoded.data.length > 31) {
    const resLow = decoded.data[30];
    const resHigh = decoded.data[31];
    resonance10bit = ((resHigh << 8) | resLow) & 0x3ff; // Mask to 10 bits
  }

  // Cutoff at offset 200-201 (big-endian 10-bit)
  if (decoded.data.length > 201) {
    const cutHigh = decoded.data[200];
    const cutLow = decoded.data[201];
    cutoff10bit = ((cutHigh << 8) | cutLow) & 0x3ff; // Mask to 10 bits
  }

  console.log(`🎛️ VCF Parameters:`);
  console.log(`   Cutoff: ${cutoff10bit}/1023 (${to7BitMidiValue(cutoff10bit)}/127 MIDI)`);
  console.log(`   Resonance: ${resonance10bit}/1023 (${to7BitMidiValue(resonance10bit)}/127 MIDI)`);

  return {
    isValid: true,
    patchName: patchName || "Untitled",
    vcf: {
      cutoff: cutoff10bit,
      resonance: resonance10bit,
    },
  };
}

/**
 * Get VCF parameters in MIDI CC format (0-127)
 */
export function getVCFMidiValues(params: MonologueParameters): { cutoff: number; resonance: number } | null {
  if (!params.isValid || !params.vcf) {
    return null;
  }

  return {
    cutoff: to7BitMidiValue(params.vcf.cutoff),
    resonance: to7BitMidiValue(params.vcf.resonance),
  };
}

export { to7BitMidiValue, from7BitMidiValue };
