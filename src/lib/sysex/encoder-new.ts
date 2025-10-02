/**
 * Korg Monologue Parameter Encoder
 *
 * Converts MonologueParameters back to SysEx bytes for perfect round-trip encoding
 * Implements the inverse of all decoder operations
 */

import { addLowerBits, getBits, transformDataFrom7BitTo8Bit } from "./utilities";
import { MonologueParameters } from "./decoder";

// Reverse lookup for slider assignment (string to number)
const SLIDER_ASSIGN_REVERSE_MATRIX: { [key: string]: number } = {
  "VCO 1 PITCH": 13,
  "VCO 1 SHAPE": 14,
  "VCO 2 PITCH": 17,
  "VCO 2 SHAPE": 18,
  "VCO 1 LEVEL": 21,
  CUTOFF: 23,
  RESONANCE: 24,
  ATTACK: 26,
  DECAY: 27,
  "EG INT": 28,
  "LFO RATE": 31,
  "LFO INT": 32,
  PORTAMENT: 40,
  "PITCH BEND": 56,
  "GATE TIME": 57,
};

/**
 * Extract the high 8 bits from a 10-bit value
 */
function getHighBits(value10bit: number): number {
  return (value10bit >> 2) & 0xff; // Shift right 2 bits, mask to 8 bits
}

/**
 * Extract the low 2 bits from a 10-bit value
 */
function getLowBits(value10bit: number): number {
  return value10bit & 0x03; // Mask to get only the lowest 2 bits
}

/**
 * Set specific bits in a byte
 * @param targetByte - The byte to modify
 * @param value - The value to set (should fit in the bit range)
 * @param startBit - Starting bit position (from right, 0-indexed)
 * @param endBit - Ending bit position (from right, 0-indexed)
 */
function setBits(targetByte: number, value: number, startBit: number, endBit: number): number {
  const bitCount = endBit - startBit + 1;
  const mask = ((1 << bitCount) - 1) << startBit; // Create mask
  return (targetByte & ~mask) | ((value & ((1 << bitCount) - 1)) << startBit);
}

/**
 * Pack lower bits into a target byte at specified offset
 * This is the inverse of addLowerBits
 */
function packLowerBits(targetByte: number, value10bit: number, offset: number): number {
  const lowBits = getLowBits(value10bit);
  return setBits(targetByte, lowBits, offset, offset + 1);
}

/**
 * Transform 8-bit data back to 7-bit MIDI data
 * This is the inverse of transformDataFrom7BitTo8Bit
 * Input: 448 bytes of 8-bit data
 * Output: 512 bytes of 7-bit data (64 groups of 8 bytes each)
 */
function transformDataFrom8BitTo7Bit(data8bit: number[]): number[] {
  const result: number[] = [];

  // Process in groups of 7 bytes (transformDataFrom7BitTo8Bit produces 7 bytes per 8-byte input)
  for (let i = 0; i < data8bit.length; i += 7) {
    const group = data8bit.slice(i, i + 7);

    // Extract high bits from each byte in the group
    let highBitsByte = 0;
    const lowBitsBytes: number[] = [];

    for (let j = 0; j < group.length; j++) {
      const byte = group[j];
      const highBit = (byte >> 7) & 1; // Extract bit 7
      const lowBits = byte & 0x7f; // Extract bits 0-6

      highBitsByte |= highBit << j; // Pack high bit at position j
      lowBitsBytes.push(lowBits);
    }

    // Add the high bits byte first, then the low bits bytes (as per Korg format)
    result.push(highBitsByte);
    result.push(...lowBitsBytes);
  }

  return result;
}

/**
 * Encode MonologueParameters back to SysEx bytes
 */
export function encodeMonologueParameters(params: MonologueParameters): number[] {
  if (
    !params.isValid ||
    !params.drive ||
    !params.oscillators ||
    !params.filter ||
    !params.envelope ||
    !params.lfo ||
    !params.misc
  ) {
    throw new Error("Invalid parameters: missing required sections");
  }

  // Create 8-bit data array (448 bytes as produced by transformDataFrom7BitTo8Bit)
  const data = new Array(448).fill(0);

  // Encode patch name (bytes 4-15)
  const patchName = params.patchName.padEnd(12, "\0").slice(0, 12);
  for (let i = 0; i < 12; i++) {
    data[4 + i] = patchName.charCodeAt(i);
  }

  // Encode VCO 1 parameters
  data[17] = getHighBits(params.oscillators.vco1.shape);
  data[20] = getHighBits(params.oscillators.vco1.level);
  data[30] = setBits(data[30], params.oscillators.vco1.wave, 6, 7);
  data[30] = packLowerBits(data[30], params.oscillators.vco1.shape, 2);

  // Encode VCO 2 parameters
  data[18] = getHighBits(params.oscillators.vco2.pitch);
  data[19] = getHighBits(params.oscillators.vco2.shape);
  data[21] = getHighBits(params.oscillators.vco2.level);
  data[31] = setBits(data[31], params.oscillators.vco2.wave, 6, 7);
  data[31] = setBits(data[31], params.oscillators.vco2.octave, 4, 5);
  data[31] = packLowerBits(data[31], params.oscillators.vco2.shape, 2);
  data[31] = packLowerBits(data[31], params.oscillators.vco2.pitch, 0);
  data[32] = setBits(data[32], params.oscillators.vco2.sync, 0, 1);

  // Encode Filter parameters (VCF)
  data[22] = getHighBits(params.filter.cutoff);
  data[23] = getHighBits(params.filter.resonance);

  // Encode Envelope parameters
  data[24] = getHighBits(params.envelope.attack);
  data[25] = getHighBits(params.envelope.decay);
  data[26] = getHighBits(params.envelope.intensity + 512); // Convert from bipolar
  data[34] = setBits(data[34], params.envelope.type, 0, 1);
  data[34] = packLowerBits(data[34], params.envelope.attack, 2);
  data[34] = packLowerBits(data[34], params.envelope.decay, 4);
  data[34] = setBits(data[34], params.envelope.target, 6, 7);

  // Encode LFO parameters
  data[27] = getHighBits(params.lfo.rate);
  data[28] = getHighBits(params.lfo.intensity + 512); // Convert from bipolar
  data[36] = setBits(data[36], params.lfo.wave, 0, 1);
  data[36] = setBits(data[36], params.lfo.mode, 2, 3);
  data[36] = setBits(data[36], params.lfo.target, 4, 5);

  // Encode Drive parameter
  data[29] = getHighBits(params.drive);

  // Encode packed lower bits
  data[33] = packLowerBits(data[33], params.oscillators.vco1.level, 0);
  data[33] = packLowerBits(data[33], params.oscillators.vco2.level, 2);
  data[33] = packLowerBits(data[33], params.filter.cutoff, 4);
  data[33] = packLowerBits(data[33], params.filter.resonance, 6);

  data[35] = packLowerBits(data[35], params.envelope.intensity + 512, 0);
  data[35] = packLowerBits(data[35], params.lfo.rate, 2);
  data[35] = packLowerBits(data[35], params.lfo.intensity + 512, 4);
  data[35] = packLowerBits(data[35], params.drive, 6);

  // Encode Misc parameters
  data[41] = params.misc.portamentTime;
  data[42] = SLIDER_ASSIGN_REVERSE_MATRIX[params.misc.sliderAssign] || 23; // Default to CUTOFF
  data[44] = setBits(data[44], params.misc.portamentMode ? 1 : 0, 0, 0);
  data[44] = setBits(data[44], params.misc.bpmSync ? 1 : 0, 3, 3);
  data[44] = setBits(data[44], params.misc.cutoffVelocity, 4, 5);
  data[44] = setBits(data[44], params.misc.cutoffKeyTrack, 6, 7);

  // Convert 8-bit data back to 7-bit MIDI data
  const midiData = transformDataFrom8BitTo7Bit(data);

  // Add SysEx header and terminator
  const sysexHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
  const sysexTerminator = [0xf7];

  return [...sysexHeader, ...midiData, ...sysexTerminator];
}
