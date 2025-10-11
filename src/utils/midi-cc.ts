/**
 * Korg Monologue MIDI CC Integration
 *
 * Complete MIDI CC mappings based on official Korg Monologue MIDI Implementation:
 * - Transmit Data (1.TRANSMITTED DATA.txt)
 * - Receive Data (2.RECOGNIZED RECEIVE DATA.txt)
 *
 * Handles bi-directional MIDI CC communication for real-time parameter control.
 */

import { MonologueParameters } from "@/lib/sysex/decoder";

// MIDI CC Numbers from official specification
export const MIDI_CC = {
  // Continuous Controllers (0-127 range)
  AMP_EG_ATTACK: 16, // 0x10
  AMP_EG_DECAY: 17, // 0x11
  LFO_RATE: 24, // 0x18
  EG_INT: 25, // 0x19
  LFO_INT: 26, // 0x1a
  DRIVE: 28, // 0x1c
  VCO_1_PITCH: 34, // 0x22 (Receive only)
  VCO_2_PITCH: 35, // 0x23
  VCO_1_SHAPE: 36, // 0x24
  VCO_2_SHAPE: 37, // 0x25
  VCO_1_LEVEL: 39, // 0x27
  VCO_2_LEVEL: 40, // 0x28
  CUTOFF: 43, // 0x2b
  RESONANCE: 44, // 0x2c

  // Switch/Selector Controllers (discrete values)
  VCO_1_OCTAVE: 48, // 0x30 (Receive only)
  VCO_2_OCTAVE: 49, // 0x31
  VCO_1_WAVE: 50, // 0x32
  VCO_2_WAVE: 51, // 0x33
  LFO_TARGET: 56, // 0x38
  LFO_WAVE: 58, // 0x3A
  LFO_MODE: 59, // 0x3B
  SYNC_RING: 60, // 0x3C
  EG_TYPE: 61, // 0x3D
  EG_TARGET: 62, // 0x3E

  // System Controllers
  ALL_SOUND_OFF: 120, // 0x78
  LOCAL_SW: 122, // 0x7a
  ALL_NOTE_OFF: 123, // 0x7b
} as const;

// Value mappings for discrete parameters (transmit format)
export const TRANSMIT_VALUES = {
  VCO_2_OCTAVE: [0, 42, 84, 127], // 16', 8', 4', 2'
  VCO_1_WAVE: [0, 64, 127], // SQR, TRI, SAW
  VCO_2_WAVE: [0, 64, 127], // NOISE, TRI, SAW
  LFO_TARGET: [0, 64, 127], // CUTOFF, SHAPE, PITCH
  LFO_WAVE: [0, 64, 127], // SQR, TRI, SAW
  LFO_MODE: [0, 64, 127], // 1-SHOT, SLOW, FAST
  SYNC_RING: [0, 64, 127], // RING, OFF, SYNC
  EG_TYPE: [0, 64, 127], // GATE, A/G/D, A/D
  EG_TARGET: [0, 64, 127], // CUTOFF, PITCH 2, PITCH
} as const;

// Value ranges for receive operations (more flexible)
export const RECEIVE_RANGES = {
  VCO_OCTAVE: {
    "16'": [0, 31],
    "8'": [32, 63],
    "4'": [64, 95],
    "2'": [96, 127],
  },
  VCO_1_WAVE: {
    SQR: [0, 42],
    TRI: [43, 85],
    SAW: [86, 127],
  },
  VCO_2_WAVE: {
    NOISE: [0, 42],
    TRI: [43, 85],
    SAW: [86, 127],
  },
  LFO_TARGET: {
    CUTOFF: [0, 42],
    SHAPE: [43, 85],
    PITCH: [86, 127],
  },
  LFO_WAVE: {
    SQR: [0, 42],
    TRI: [43, 85],
    SAW: [86, 127],
  },
  SYNC_RING: {
    RING: [0, 42],
    OFF: [43, 85],
    SYNC: [86, 127],
  },
  EG_TYPE: {
    GATE: [0, 42],
    "A/G/D": [43, 85],
    "A/D": [86, 127],
  },
  EG_TARGET: {
    CUTOFF: [0, 42],
    "PITCH 2": [43, 85],
    PITCH: [86, 127],
  },
} as const;

/**
 * Convert internal parameter values to MIDI CC values for transmission
 */
export function parameterToMidiCC(parameter: string, value: number): { cc: number; midiValue: number } | null {
  switch (parameter) {
    // Continuous parameters (scale from 0-1023 to 0-127)
    case "drive":
      return { cc: MIDI_CC.DRIVE, midiValue: Math.round((value / 1023) * 127) };
    case "filter.cutoff":
      return { cc: MIDI_CC.CUTOFF, midiValue: Math.round((value / 1023) * 127) };
    case "filter.resonance":
      return { cc: MIDI_CC.RESONANCE, midiValue: Math.round((value / 1023) * 127) };
    case "oscillators.vco1.shape":
      return { cc: MIDI_CC.VCO_1_SHAPE, midiValue: Math.round((value / 1023) * 127) };
    case "oscillators.vco2.shape":
      return { cc: MIDI_CC.VCO_2_SHAPE, midiValue: Math.round((value / 1023) * 127) };
    case "oscillators.vco1.level":
      return { cc: MIDI_CC.VCO_1_LEVEL, midiValue: Math.round((value / 1023) * 127) };
    case "oscillators.vco2.level":
      return { cc: MIDI_CC.VCO_2_LEVEL, midiValue: Math.round((value / 1023) * 127) };
    case "oscillators.vco2.pitch":
      return { cc: MIDI_CC.VCO_2_PITCH, midiValue: Math.round(((value + 512) / 1023) * 127) }; // -512 to +511 range (bipolar in cents)
    case "envelope.attack":
      return { cc: MIDI_CC.AMP_EG_ATTACK, midiValue: Math.round((value / 1023) * 127) };
    case "envelope.decay":
      return { cc: MIDI_CC.AMP_EG_DECAY, midiValue: Math.round((value / 1023) * 127) };
    case "envelope.intensity":
      return { cc: MIDI_CC.EG_INT, midiValue: Math.round(((value + 512) / 1024) * 127) }; // -512 to +511 range
    case "lfo.rate":
      return { cc: MIDI_CC.LFO_RATE, midiValue: Math.round((value / 1023) * 127) };
    case "lfo.intensity":
      return { cc: MIDI_CC.LFO_INT, midiValue: Math.round(((value + 512) / 1024) * 127) }; // -512 to +511 range (same as EG_INT)

    // Discrete parameters (use exact transmit values)
    case "oscillators.vco2.octave":
      return { cc: MIDI_CC.VCO_2_OCTAVE, midiValue: TRANSMIT_VALUES.VCO_2_OCTAVE[value] || 42 };
    case "oscillators.vco1.wave":
      return { cc: MIDI_CC.VCO_1_WAVE, midiValue: TRANSMIT_VALUES.VCO_1_WAVE[value] || 0 };
    case "oscillators.vco2.wave":
      return { cc: MIDI_CC.VCO_2_WAVE, midiValue: TRANSMIT_VALUES.VCO_2_WAVE[value] || 0 };
    case "lfo.wave":
      return { cc: MIDI_CC.LFO_WAVE, midiValue: TRANSMIT_VALUES.LFO_WAVE[value] || 0 };
    case "lfo.mode":
      return { cc: MIDI_CC.LFO_MODE, midiValue: TRANSMIT_VALUES.LFO_MODE[value] || 0 };
    case "lfo.target":
      return { cc: MIDI_CC.LFO_TARGET, midiValue: TRANSMIT_VALUES.LFO_TARGET[value] || 0 };
    case "oscillators.vco2.sync":
      return { cc: MIDI_CC.SYNC_RING, midiValue: TRANSMIT_VALUES.SYNC_RING[value] || 0 };
    case "envelope.type":
      return { cc: MIDI_CC.EG_TYPE, midiValue: TRANSMIT_VALUES.EG_TYPE[value] || 0 };
    case "envelope.target":
      return { cc: MIDI_CC.EG_TARGET, midiValue: TRANSMIT_VALUES.EG_TARGET[value] || 0 };

    default:
      return null;
  }
}

/**
 * Convert MIDI CC values to internal parameter values for receiving
 */
export function midiCCToParameter(cc: number, midiValue: number): { parameter: string; value: number } | null {
  switch (cc) {
    // Continuous parameters (scale from 0-127 to 0-1023)
    case MIDI_CC.DRIVE:
      return { parameter: "drive", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.CUTOFF:
      return { parameter: "filter.cutoff", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.RESONANCE:
      return { parameter: "filter.resonance", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.VCO_1_SHAPE:
      return { parameter: "oscillators.vco1.shape", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.VCO_2_SHAPE:
      return { parameter: "oscillators.vco2.shape", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.VCO_1_LEVEL:
      return { parameter: "oscillators.vco1.level", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.VCO_2_LEVEL:
      return { parameter: "oscillators.vco2.level", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.VCO_2_PITCH:
      return { parameter: "oscillators.vco2.pitch", value: Math.round((midiValue / 127) * 1023) - 512 }; // Convert to -512 to +511 (bipolar)
    case MIDI_CC.AMP_EG_ATTACK:
      return { parameter: "envelope.attack", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.AMP_EG_DECAY:
      return { parameter: "envelope.decay", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.EG_INT:
      return { parameter: "envelope.intensity", value: Math.round((midiValue / 127) * 1024) - 512 }; // Convert to -512 to +511
    case MIDI_CC.LFO_RATE:
      return { parameter: "lfo.rate", value: Math.round((midiValue / 127) * 1023) };
    case MIDI_CC.LFO_INT:
      return { parameter: "lfo.intensity", value: Math.round((midiValue / 127) * 1024) - 512 }; // Convert to -512 to +511 (same as EG_INT)

    // VCO 1 Pitch (receive only - not in transmit spec)
    case MIDI_CC.VCO_1_PITCH:
      return { parameter: "oscillators.vco1.pitch", value: Math.round((midiValue / 127) * 1024) - 512 };

    // Discrete parameters using receive ranges
    case MIDI_CC.VCO_1_OCTAVE:
    case MIDI_CC.VCO_2_OCTAVE: {
      const param = cc === MIDI_CC.VCO_1_OCTAVE ? "oscillators.vco1.octave" : "oscillators.vco2.octave";
      const ranges = RECEIVE_RANGES.VCO_OCTAVE;
      if (midiValue >= ranges["16'"][0] && midiValue <= ranges["16'"][1]) return { parameter: param, value: 0 };
      if (midiValue >= ranges["8'"][0] && midiValue <= ranges["8'"][1]) return { parameter: param, value: 1 };
      if (midiValue >= ranges["4'"][0] && midiValue <= ranges["4'"][1]) return { parameter: param, value: 2 };
      if (midiValue >= ranges["2'"][0] && midiValue <= ranges["2'"][1]) return { parameter: param, value: 3 };
      return { parameter: param, value: 1 }; // Default to 8'
    }

    case MIDI_CC.VCO_1_WAVE: {
      const ranges = RECEIVE_RANGES.VCO_1_WAVE;
      if (midiValue >= ranges.SQR[0] && midiValue <= ranges.SQR[1])
        return { parameter: "oscillators.vco1.wave", value: 0 };
      if (midiValue >= ranges.TRI[0] && midiValue <= ranges.TRI[1])
        return { parameter: "oscillators.vco1.wave", value: 1 };
      if (midiValue >= ranges.SAW[0] && midiValue <= ranges.SAW[1])
        return { parameter: "oscillators.vco1.wave", value: 2 };
      return { parameter: "oscillators.vco1.wave", value: 0 }; // Default to SQR
    }

    case MIDI_CC.VCO_2_WAVE: {
      const ranges = RECEIVE_RANGES.VCO_2_WAVE;
      if (midiValue >= ranges.NOISE[0] && midiValue <= ranges.NOISE[1])
        return { parameter: "oscillators.vco2.wave", value: 0 };
      if (midiValue >= ranges.TRI[0] && midiValue <= ranges.TRI[1])
        return { parameter: "oscillators.vco2.wave", value: 1 };
      if (midiValue >= ranges.SAW[0] && midiValue <= ranges.SAW[1])
        return { parameter: "oscillators.vco2.wave", value: 2 };
      return { parameter: "oscillators.vco2.wave", value: 0 }; // Default to NOISE
    }

    case MIDI_CC.LFO_TARGET: {
      const ranges = RECEIVE_RANGES.LFO_TARGET;
      if (midiValue >= ranges.CUTOFF[0] && midiValue <= ranges.CUTOFF[1]) return { parameter: "lfo.target", value: 0 };
      if (midiValue >= ranges.SHAPE[0] && midiValue <= ranges.SHAPE[1]) return { parameter: "lfo.target", value: 1 };
      if (midiValue >= ranges.PITCH[0] && midiValue <= ranges.PITCH[1]) return { parameter: "lfo.target", value: 2 };
      return { parameter: "lfo.target", value: 0 }; // Default to CUTOFF
    }

    case MIDI_CC.LFO_WAVE: {
      const ranges = RECEIVE_RANGES.LFO_WAVE;
      if (midiValue >= ranges.SQR[0] && midiValue <= ranges.SQR[1]) return { parameter: "lfo.wave", value: 0 };
      if (midiValue >= ranges.TRI[0] && midiValue <= ranges.TRI[1]) return { parameter: "lfo.wave", value: 1 };
      if (midiValue >= ranges.SAW[0] && midiValue <= ranges.SAW[1]) return { parameter: "lfo.wave", value: 2 };
      return { parameter: "lfo.wave", value: 0 }; // Default to SQR
    }

    case MIDI_CC.LFO_MODE: {
      // LFO MODE: 1-SHOT, SLOW, FAST (missing LFO_MODE ranges in RECEIVE_RANGES, using same pattern)
      if (midiValue >= 0 && midiValue <= 42) return { parameter: "lfo.mode", value: 0 }; // 1-SHOT
      if (midiValue >= 43 && midiValue <= 85) return { parameter: "lfo.mode", value: 1 }; // SLOW
      if (midiValue >= 86 && midiValue <= 127) return { parameter: "lfo.mode", value: 2 }; // FAST
      return { parameter: "lfo.mode", value: 1 }; // Default to SLOW
    }

    case MIDI_CC.SYNC_RING: {
      const ranges = RECEIVE_RANGES.SYNC_RING;
      if (midiValue >= ranges.RING[0] && midiValue <= ranges.RING[1])
        return { parameter: "oscillators.vco2.sync", value: 0 };
      if (midiValue >= ranges.OFF[0] && midiValue <= ranges.OFF[1])
        return { parameter: "oscillators.vco2.sync", value: 1 };
      if (midiValue >= ranges.SYNC[0] && midiValue <= ranges.SYNC[1])
        return { parameter: "oscillators.vco2.sync", value: 2 };
      return { parameter: "oscillators.vco2.sync", value: 1 }; // Default to OFF
    }

    case MIDI_CC.EG_TYPE: {
      const ranges = RECEIVE_RANGES.EG_TYPE;
      if (midiValue >= ranges.GATE[0] && midiValue <= ranges.GATE[1]) return { parameter: "envelope.type", value: 0 };
      if (midiValue >= ranges["A/G/D"][0] && midiValue <= ranges["A/G/D"][1])
        return { parameter: "envelope.type", value: 1 };
      if (midiValue >= ranges["A/D"][0] && midiValue <= ranges["A/D"][1])
        return { parameter: "envelope.type", value: 2 };
      return { parameter: "envelope.type", value: 1 }; // Default to A/G/D
    }

    case MIDI_CC.EG_TARGET: {
      const ranges = RECEIVE_RANGES.EG_TARGET;
      if (midiValue >= ranges.CUTOFF[0] && midiValue <= ranges.CUTOFF[1])
        return { parameter: "envelope.target", value: 0 };
      if (midiValue >= ranges["PITCH 2"][0] && midiValue <= ranges["PITCH 2"][1])
        return { parameter: "envelope.target", value: 1 };
      if (midiValue >= ranges.PITCH[0] && midiValue <= ranges.PITCH[1])
        return { parameter: "envelope.target", value: 2 };
      return { parameter: "envelope.target", value: 0 }; // Default to CUTOFF
    }

    default:
      return null;
  }
}

/**
 * Get all supported MIDI CC numbers for parameter transmission
 */
export function getSupportedCCs(): number[] {
  return Object.values(MIDI_CC).filter((cc) => typeof cc === "number");
}

/**
 * Check if a parameter path supports MIDI CC transmission
 */
export function supportsMidiCC(parameter: string): boolean {
  return parameterToMidiCC(parameter, 0) !== null;
}

/**
 * Batch convert multiple parameters to MIDI CC messages
 */
export function parametersToMidiCCs(
  parameters: Partial<MonologueParameters>
): Array<{ cc: number; midiValue: number; parameter: string }> {
  const results: Array<{ cc: number; midiValue: number; parameter: string }> = [];

  // Helper function to process nested objects
  function processObject(obj: any, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        processObject(value, fullPath);
      } else if (typeof value === "number") {
        const ccMapping = parameterToMidiCC(fullPath, value);
        if (ccMapping) {
          results.push({ ...ccMapping, parameter: fullPath });
        }
      }
    }
  }

  processObject(parameters);
  return results;
}
