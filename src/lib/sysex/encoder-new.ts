/**
 * Korg Monologue Round-Trip Parameter Encoder
 *
 * Converts MonologueParameters back to 520-byte SysEx format for perfect round-trip encoding.
 * Implements the inverse of decoder.ts operations with "no data loss" capability.
 *
 * Current Status: 60% working (3/5 test dumps pass round-trip)
 * Known Issues: dump1 and dump4 fail due to missing sequencer/motion parameter sections
 *
 * Architecture:
 * - Takes comprehensive MonologueParameters from decoder.ts
 * - Applies inverse bit manipulation and packing
 * - Generates valid 520-byte MIDI SysEx data
 * - Enables patch editing and saving workflows
 *
 * Dependencies: Requires decoder.ts MonologueParameters interface
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
  // Check each required section and collect missing ones
  const missingSections: string[] = [];

  if (!params.isValid) missingSections.push("isValid=false");
  if (!params.drive && params.drive !== 0) missingSections.push("drive");
  if (!params.oscillators) missingSections.push("oscillators");
  if (!params.filter) missingSections.push("filter");
  if (!params.envelope) missingSections.push("envelope");
  if (!params.lfo) missingSections.push("lfo");
  if (!params.sequencer) missingSections.push("sequencer");
  if (!params.motionSequencing) missingSections.push("motionSequencing");
  if (!params.amp) missingSections.push("amp");
  if (!params.misc) missingSections.push("misc");

  if (missingSections.length > 0) {
    throw new Error(`Invalid parameters: missing required sections: [${missingSections.join(", ")}]`);
  }

  // Type assertions: we've validated all required sections exist above
  const drive = params.drive!;
  const oscillators = params.oscillators!;
  const filter = params.filter!;
  const envelope = params.envelope!;
  const lfo = params.lfo!;
  const sequencer = params.sequencer!;
  const motionSequencing = params.motionSequencing!;
  const amp = params.amp!;
  const misc = params.misc!;

  // Create 8-bit data array (448 bytes as produced by transformDataFrom7BitTo8Bit)
  const data = new Array(448).fill(0);

  // Encode patch name (bytes 4-15)
  const patchName = params.patchName.padEnd(12, "\0").slice(0, 12);
  for (let i = 0; i < 12; i++) {
    data[4 + i] = patchName.charCodeAt(i);
  }

  // Encode VCO 1 parameters
  data[17] = getHighBits(oscillators.vco1.shape);
  data[20] = getHighBits(oscillators.vco1.level);
  data[30] = setBits(data[30], oscillators.vco1.wave, 6, 7);
  data[30] = packLowerBits(data[30], oscillators.vco1.shape, 2);

  // Encode VCO 2 parameters
  data[18] = getHighBits(oscillators.vco2.pitch);
  data[19] = getHighBits(oscillators.vco2.shape);
  data[21] = getHighBits(oscillators.vco2.level);
  data[31] = setBits(data[31], oscillators.vco2.wave, 6, 7);
  data[31] = setBits(data[31], oscillators.vco2.octave, 4, 5);
  data[31] = packLowerBits(data[31], oscillators.vco2.shape, 2);
  data[31] = packLowerBits(data[31], oscillators.vco2.pitch, 0);
  data[32] = setBits(data[32], oscillators.vco2.sync, 0, 1);

  // Encode Filter parameters (VCF)
  data[22] = getHighBits(filter.cutoff);
  data[23] = getHighBits(filter.resonance);

  // Encode Envelope parameters
  data[24] = getHighBits(envelope.attack);
  data[25] = getHighBits(envelope.decay);
  data[26] = getHighBits(envelope.intensity + 512); // Convert from bipolar
  data[34] = setBits(data[34], envelope.type, 0, 1);
  data[34] = packLowerBits(data[34], envelope.attack, 2);
  data[34] = packLowerBits(data[34], envelope.decay, 4);
  data[34] = setBits(data[34], envelope.target, 6, 7);

  // Encode LFO parameters
  data[27] = getHighBits(lfo.rate);
  data[28] = getHighBits(lfo.intensity + 512); // Convert from bipolar
  data[36] = setBits(data[36], lfo.wave, 0, 1);
  data[36] = setBits(data[36], lfo.mode, 2, 3);
  data[36] = setBits(data[36], lfo.target, 4, 5);

  // Encode Drive parameter
  data[29] = getHighBits(drive);

  // Encode packed lower bits
  data[33] = packLowerBits(data[33], oscillators.vco1.level, 0);
  data[33] = packLowerBits(data[33], oscillators.vco2.level, 2);
  data[33] = packLowerBits(data[33], filter.cutoff, 4);
  data[33] = packLowerBits(data[33], filter.resonance, 6);

  data[35] = packLowerBits(data[35], envelope.intensity + 512, 0);
  data[35] = packLowerBits(data[35], lfo.rate, 2);
  data[35] = packLowerBits(data[35], lfo.intensity + 512, 4);
  data[35] = packLowerBits(data[35], drive, 6);

  // Encode Sequencer parameters (bytes 54-67)
  data[54] = sequencer.stepLength; // 1-16 steps
  data[55] = sequencer.stepResolution; // 0-4 resolution
  data[56] = sequencer.swing + 75; // Adjust from -75 to +75 range

  // Encode step on/off states (bytes 64-65)
  for (let i = 0; i < 8; i++) {
    data[64] = setBits(data[64], sequencer.stepOnOff[i] ? 1 : 0, i, i);
  }
  for (let i = 0; i < 8; i++) {
    data[65] = setBits(data[65], sequencer.stepOnOff[i + 8] ? 1 : 0, i, i);
  }

  // Encode motion on/off states (bytes 66-67)
  for (let i = 0; i < 8; i++) {
    data[66] = setBits(data[66], sequencer.motionOnOff[i] ? 1 : 0, i, i);
  }
  for (let i = 0; i < 8; i++) {
    data[67] = setBits(data[67], sequencer.motionOnOff[i + 8] ? 1 : 0, i, i);
  }

  // Encode Motion Sequencing data (bytes 72-447)
  // Motion Slot Parameters (bytes 72-79, 2 bytes per slot)
  for (let slot = 0; slot < 4; slot++) {
    const slotData = motionSequencing.slots[slot];
    const paramOffset = 72 + slot * 2;

    data[paramOffset] = setBits(data[paramOffset], slotData.motionOn ? 1 : 0, 0, 0);
    data[paramOffset] = setBits(data[paramOffset], slotData.smoothOn ? 1 : 0, 1, 1);
    data[paramOffset + 1] = slotData.parameterId;
  }

  // Motion Slot Step Enable flags (bytes 80-87)
  for (let slot = 0; slot < 4; slot++) {
    const slotData = motionSequencing.slots[slot];
    const stepOffset = 80 + slot * 2;

    // First 8 steps
    for (let i = 0; i < 8; i++) {
      data[stepOffset] = setBits(data[stepOffset], slotData.stepEnabled[i] ? 1 : 0, i, i);
    }
    // Next 8 steps
    for (let i = 0; i < 8; i++) {
      data[stepOffset + 1] = setBits(data[stepOffset + 1], slotData.stepEnabled[i + 8] ? 1 : 0, i, i);
    }
  }

  // Step Event Data (bytes 96-447, 22 bytes per step × 16 steps)
  for (let step = 0; step < 16; step++) {
    const stepData = motionSequencing.stepEvents[step];
    const stepOffset = 96 + step * 22;

    data[stepOffset + 0] = stepData.noteNumber;
    data[stepOffset + 2] = stepData.velocity;
    data[stepOffset + 4] = setBits(data[stepOffset + 4], stepData.gateTime, 0, 6);
    data[stepOffset + 4] = setBits(data[stepOffset + 4], stepData.triggerSwitch ? 1 : 0, 7, 7);

    // Motion data for all 4 slots
    for (let slot = 0; slot < 4; slot++) {
      const motionData = stepData.motionData[slot];
      const motionOffset = stepOffset + 6 + slot * 4;

      data[motionOffset + 0] = motionData.data1;
      data[motionOffset + 1] = motionData.data2;
      data[motionOffset + 2] = motionData.data3;
      data[motionOffset + 3] = motionData.data4;
    }
  }

  // Encode AMP envelope parameters
  data[16] = amp.attack; // AMP EG Attack (CC 16)
  data[17] = amp.decay; // AMP EG Decay (CC 17)

  // Encode Misc parameters
  data[41] = misc.portamentTime;
  data[42] = SLIDER_ASSIGN_REVERSE_MATRIX[misc.sliderAssign] || 23; // Default to CUTOFF
  data[44] = setBits(data[44], misc.portamentMode ? 1 : 0, 0, 0);
  data[44] = setBits(data[44], misc.bpmSync ? 1 : 0, 3, 3);
  data[44] = setBits(data[44], misc.cutoffVelocity, 4, 5);
  data[44] = setBits(data[44], misc.cutoffKeyTrack, 6, 7);

  // Convert 8-bit data back to 7-bit MIDI data
  const midiData = transformDataFrom8BitTo7Bit(data);

  // Add SysEx header and terminator
  const sysexHeader = [0xf0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
  const sysexTerminator = [0xf7];

  return [...sysexHeader, ...midiData, ...sysexTerminator];
}
