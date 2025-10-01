// Korg Monologue parameter definitions
import { MonologueParameter } from "@/types";

export const MONOLOGUE_PARAMETERS: Record<string, MonologueParameter> = {
  // VCO Parameters
  VCO_WAVE: {
    id: 0,
    name: "VCO Wave",
    ccNumber: 40,
    min: 0,
    max: 3,
    default: 0,
    type: "stepped",
    category: "vco",
  },
  VCO_OCTAVE: {
    id: 1,
    name: "VCO Octave",
    ccNumber: 41,
    min: 0,
    max: 4,
    default: 2,
    type: "stepped",
    category: "vco",
  },
  VCO_PITCH: {
    id: 2,
    name: "VCO Pitch",
    ccNumber: 42,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "vco",
  },
  VCO_PULSE_WIDTH: {
    id: 3,
    name: "Pulse Width",
    ccNumber: 43,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "vco",
  },

  // VCF Parameters
  VCF_CUTOFF: {
    id: 10,
    name: "VCF Cutoff",
    ccNumber: 74,
    min: 0,
    max: 127,
    default: 127,
    type: "continuous",
    category: "vcf",
  },
  VCF_RESONANCE: {
    id: 11,
    name: "VCF Resonance",
    ccNumber: 71,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "vcf",
  },
  VCF_EG: {
    id: 12,
    name: "VCF EG Intensity",
    ccNumber: 79,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "vcf",
  },
  VCF_TYPE: {
    id: 13,
    name: "VCF Type",
    ccNumber: 83,
    min: 0,
    max: 1,
    default: 0,
    type: "switch",
    category: "vcf",
  },
  VCF_DRIVE: {
    id: 14,
    name: "VCF Drive",
    ccNumber: 84,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "vcf",
  },

  // VCA Parameters
  VCA_LEVEL: {
    id: 20,
    name: "VCA Level",
    ccNumber: 7,
    min: 0,
    max: 127,
    default: 127,
    type: "continuous",
    category: "vca",
  },

  // EG Parameters
  EG_ATTACK: {
    id: 30,
    name: "EG Attack",
    ccNumber: 73,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "eg",
  },
  EG_DECAY: {
    id: 31,
    name: "EG Decay",
    ccNumber: 75,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "eg",
  },
  EG_SUSTAIN: {
    id: 32,
    name: "EG Sustain",
    ccNumber: 70,
    min: 0,
    max: 127,
    default: 127,
    type: "continuous",
    category: "eg",
  },
  EG_RELEASE: {
    id: 33,
    name: "EG Release",
    ccNumber: 72,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "eg",
  },

  // LFO Parameters
  LFO_WAVE: {
    id: 40,
    name: "LFO Wave",
    ccNumber: 80,
    min: 0,
    max: 2,
    default: 1,
    type: "stepped",
    category: "lfo",
  },
  LFO_RATE: {
    id: 41,
    name: "LFO Rate",
    ccNumber: 76,
    min: 0,
    max: 127,
    default: 64,
    type: "continuous",
    category: "lfo",
  },
  LFO_INTENSITY: {
    id: 42,
    name: "LFO Intensity",
    ccNumber: 77,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "lfo",
  },
  LFO_TARGET: {
    id: 43,
    name: "LFO Target",
    ccNumber: 78,
    min: 0,
    max: 2,
    default: 0,
    type: "stepped",
    category: "lfo",
  },

  // Delay Parameters
  DELAY_TIME: {
    id: 50,
    name: "Delay Time",
    ccNumber: 85,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "delay",
  },
  DELAY_FEEDBACK: {
    id: 51,
    name: "Delay Feedback",
    ccNumber: 86,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "delay",
  },
  DELAY_HI_CUT: {
    id: 52,
    name: "Delay Hi Cut",
    ccNumber: 87,
    min: 0,
    max: 127,
    default: 127,
    type: "continuous",
    category: "delay",
  },

  // Global Parameters
  PORTAMENTO: {
    id: 60,
    name: "Portamento",
    ccNumber: 5,
    min: 0,
    max: 127,
    default: 0,
    type: "continuous",
    category: "global",
  },
  VOICE_MODE: {
    id: 61,
    name: "Voice Mode",
    ccNumber: 81,
    min: 0,
    max: 4,
    default: 0,
    type: "stepped",
    category: "global",
  },
  SYNC_SOURCE: {
    id: 62,
    name: "Sync Source",
    ccNumber: 82,
    min: 0,
    max: 1,
    default: 0,
    type: "switch",
    category: "global",
  },
};

// Parameter value mappings
export const PARAMETER_VALUES = {
  VCO_WAVE: ["Saw", "Triangle", "Square", "Pulse"],
  VCO_OCTAVE: ["-2", "-1", "0", "+1", "+2"],
  VCF_TYPE: ["LPF", "HPF"],
  LFO_WAVE: ["Saw", "Triangle", "Square"],
  LFO_TARGET: ["Pitch", "Cutoff", "Pulse Width"],
  VOICE_MODE: ["Mono", "Legato", "Priority Last", "Priority Low", "Priority High"],
  SYNC_SOURCE: ["Internal", "External"],
};

// Korg Monologue SysEx constants
export const MONOLOGUE_SYSEX = {
  MANUFACTURER: [0x42], // Korg
  DEVICE_ID: 0x30,
  MODEL_ID: [0x00, 0x01, 0x44], // Monologue
  COMMANDS: {
    CURRENT_PROGRAM_DATA_DUMP: 0x10,
    PROGRAM_DATA_DUMP: 0x1c,
    PARAMETER_CHANGE: 0x41,
    INQUIRY_REQUEST: 0x11,
    INQUIRY_REPLY: 0x12,
  },
  DATA_SIZE: {
    PROGRAM: 256, // bytes
    SEQUENCE: 512, // bytes (if sequencer data included)
  },
};

// MIDI CC to parameter mapping
export const CC_TO_PARAMETER: Record<number, string> = Object.fromEntries(
  Object.entries(MONOLOGUE_PARAMETERS)
    .filter(([, param]) => param.ccNumber !== undefined)
    .map(([key, param]) => [param.ccNumber!, key])
);
