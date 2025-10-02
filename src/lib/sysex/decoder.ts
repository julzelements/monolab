/**
 * Korg Monologue Comprehensive Parameter Decoder
 *
 * Complete implementation supporting all parameters from the official MIDI specification.
 * Extracts full parameter set from 520-byte SysEx data for round-trip encoding capability.
 *
 * Use this decoder when you need:
 * - Complete parameter access beyond VCF controls
 * - Round-trip encoding with encoder-new.ts
 * - Full MIDI spec compliance
 * - Future feature development requiring additional parameters
 *
 * For lightweight VCF-only parsing, see monologue-parser.ts
 */

import { addLowerBits, getBits, transformDataFrom7BitTo8Bit } from "./utilities";

// Comprehensive parameter interfaces based on monologue.js structure
export interface MonologueParameters {
  isValid: boolean;
  patchName: string;
  error?: string;

  // Complete parameter set (optional for error cases)
  drive?: number;
  oscillators?: {
    vco1: {
      wave: number; // 0-3 (SAW, TRI, SQR, NOISE)
      shape: number; // 0-1023
      level: number; // 0-1023
    };
    vco2: {
      wave: number; // 0-3 (SAW, TRI, SQR, NOISE)
      shape: number; // 0-1023
      level: number; // 0-1023
      pitch: number; // 0-1023
      sync: number; // 0-3 (OFF, RING, SYNC, RING+SYNC)
      octave: number; // 0-3 (16', 8', 4', 2')
    };
  };
  filter?: {
    cutoff: number; // 0-1023
    resonance: number; // 0-1023
  };
  envelope?: {
    type: number; // 0-3 (GATE, ADSR, ADS, AR)
    attack: number; // 0-1023
    decay: number; // 0-1023
    intensity: number; // -512 to +511 (0-1023 raw, adjusted)
    target: number; // 0-3 (PITCH, CUTOFF, AMP, PITCH+CUTOFF)
  };
  lfo?: {
    wave: number; // 0-3 (SAW, TRI, SQR, S&H)
    mode: number; // 0-3 (1-SHOT, SLOW, FAST, 1S+F)
    rate: number; // 0-1023
    intensity: number; // -512 to +511 (0-1023 raw, adjusted)
    target: number; // 0-3 (PITCH, CUTOFF, AMP, PITCH+CUTOFF)
  };
  misc?: {
    bpmSync: boolean; // BPM sync on/off
    portamentMode: boolean; // Portament mode on/off
    portamentTime: number; // 0-127
    cutoffVelocity: number; // 0-3 (0%, 33%, 66%, 100%)
    cutoffKeyTrack: number; // 0-3 (0%, 33%, 66%, 100%)
    sliderAssign: string; // Parameter name
  };
}

// Slider assignment matrix from monologue.js
const SLIDER_ASSIGN_MATRIX: { [key: number]: string } = {
  13: "VCO 1 PITCH",
  14: "VCO 1 SHAPE",
  17: "VCO 2 PITCH",
  18: "VCO 2 SHAPE",
  21: "VCO 1 LEVEL",
  22: "VCO 1 LEVEL",
  23: "CUTOFF",
  24: "RESONANCE",
  26: "ATTACK",
  27: "DECAY",
  28: "EG INT",
  31: "LFO RATE",
  32: "LFO INT",
  40: "PORTAMENT",
  56: "PITCH BEND",
  57: "GATE TIME",
};

/**
 * Convert 10-bit internal value (0-1023) to MIDI CC value (0-127)
 */
export function to7BitMidiValue(value10bit: number): number {
  return Math.round((value10bit / 1023) * 127);
}

/**
 * Convert MIDI CC value (0-127) to 10-bit internal value (0-1023)
 */
export function from7BitMidiValue(valueMidi: number): number {
  return Math.round((valueMidi / 127) * 1023);
}

/**
 * Complete Monologue SysEx decoder based on the working JavaScript implementation
 */
export function decodeMonologueParameters(rawSysexData: number[]): MonologueParameters {
  try {
    // Validate basic structure
    if (rawSysexData.length !== 520) {
      return {
        isValid: false,
        patchName: "",
        error: `Invalid SysEx length: ${rawSysexData.length}, expected 520`,
      };
    }

    // Validate header [0xF0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40]
    const expectedHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
    for (let i = 0; i < expectedHeader.length; i++) {
      if (rawSysexData[i] !== expectedHeader[i]) {
        return {
          isValid: false,
          patchName: "",
          error: `Invalid header at byte ${i}`,
        };
      }
    }

    // Transform to 8-bit data using the same method as example parser
    const data = transformDataFrom7BitTo8Bit(rawSysexData);

    // Extract patch name (bytes 4-15)
    const patchName = data
      .slice(4, 16)
      .map((x) => String.fromCharCode(x))
      .join("")
      .replace(/\0/g, "") // Remove null terminators
      .trim();

    // Drive parameter
    const drive = addLowerBits(data[29], data[35], 6);

    // VCO 1 parameters
    const vco1 = {
      wave: getBits(data[30], 6, 7),
      shape: addLowerBits(data[17], data[30], 2),
      level: addLowerBits(data[20], data[33], 0),
    };

    // VCO 2 parameters
    const vco2 = {
      wave: getBits(data[31], 6, 7),
      shape: addLowerBits(data[19], data[31], 2),
      level: addLowerBits(data[21], data[33], 2),
      sync: getBits(data[32], 0, 1),
      pitch: addLowerBits(data[18], data[31], 0),
      octave: getBits(data[31], 4, 5),
    };

    // Filter parameters (VCF) - same as our working parser
    const filter = {
      cutoff: addLowerBits(data[22], data[33], 4),
      resonance: addLowerBits(data[23], data[33], 6),
    };

    // Envelope parameters
    const envelope = {
      type: getBits(data[34], 0, 1),
      attack: addLowerBits(data[24], data[34], 2),
      decay: addLowerBits(data[25], data[34], 4),
      intensity: addLowerBits(data[26], data[35], 0) - 512, // Adjust to bipolar range
      target: getBits(data[34], 6, 7),
    };

    // LFO parameters
    const lfo = {
      wave: getBits(data[36], 0, 1),
      mode: getBits(data[36], 2, 3),
      rate: addLowerBits(data[27], data[35], 2),
      intensity: addLowerBits(data[28], data[35], 4) - 512, // Adjust to bipolar range
      target: getBits(data[36], 4, 5),
    };

    // Misc parameters
    const misc = {
      bpmSync: getBits(data[44], 3, 3) === 1,
      portamentMode: getBits(data[44], 0, 0) === 1,
      portamentTime: data[41],
      cutoffVelocity: getBits(data[44], 4, 5),
      cutoffKeyTrack: getBits(data[44], 6, 7),
      sliderAssign: SLIDER_ASSIGN_MATRIX[data[42]] || "UNKNOWN",
    };

    return {
      isValid: true,
      patchName: patchName || "Untitled",
      drive,
      oscillators: {
        vco1,
        vco2,
      },
      filter,
      envelope,
      lfo,
      misc,
    };
  } catch (error) {
    return {
      isValid: false,
      patchName: "",
      error: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Get VCF parameters in MIDI CC format (0-127) for backward compatibility
 */
export function getVCFMidiValues(params: MonologueParameters): { cutoff: number; resonance: number } | null {
  if (!params.isValid || !params.filter) {
    return null;
  }

  return {
    cutoff: to7BitMidiValue(params.filter.cutoff),
    resonance: to7BitMidiValue(params.filter.resonance),
  };
}
