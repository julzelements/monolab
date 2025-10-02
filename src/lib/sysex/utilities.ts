/**
 * Utilities for Monologue SysEx parsing (converted from JavaScript)
 */

/**
 * Convert decimal to binary string with padding
 */
export function bin(dec: number, padding: number = 8): string {
  return dec.toString(2).padStart(padding, '0');
}

/**
 * Get specific bits from a number
 * @param num - The number to extract bits from
 * @param start - Start bit position (from right, 0-indexed)
 * @param end - End bit position (from right, 0-indexed)
 */
export function getBits(num: number, start: number, end: number): number {
  const bits = bin(num);
  return parseInt(bits.slice(-end-1, start ? -start : undefined), 2);
}

/**
 * Combine high bits with lower bits to create 10-bit parameter values
 * @param numForHighBits - 8-bit value containing the high bits
 * @param numForLowBits - Byte containing packed lower bits
 * @param offset - Bit offset for extracting the 2 lower bits
 */
export function addLowerBits(numForHighBits: number, numForLowBits: number, offset: number): number {
  const hiBits = bin(numForHighBits);
  const loBits = bin(numForLowBits).slice(-offset-2, offset ? -offset : undefined);
  const tenBitString = hiBits + loBits;
  return parseInt(tenBitString, 2);
}

/**
 * Add high bit to create 8-bit values from 7-bit MIDI data
 * @param numForLowBits - 7-bit value
 * @param numForHighBit - Byte containing the high bit
 * @param offset - Bit offset for extracting the high bit
 */
export function addHighBit(numForLowBits: number, numForHighBit: number, offset: number): number {
  const loBits = bin(numForLowBits, 7);
  const hiBit = bin(numForHighBit).slice(-offset-1, offset ? -offset : undefined);
  const eightBitString = hiBit + loBits;
  return parseInt(eightBitString, 2);
}

/**
 * Transform 7-bit MIDI SysEx data to 8-bit internal data
 * This is the core conversion function for Korg SysEx format
 */
export function transformDataFrom7BitTo8Bit(records: number[]): number[] {
  // Remove the header and footer bytes
  const sBitValues = records.slice(7, records.length - 1);
  const setArray: number[][] = [];
  let index = 0;
  
  while (index < sBitValues.length) {
    setArray.push(sBitValues.slice(index, 8 + index));
    index += 8;
  }
  
  const eBitValues: number[] = [];
  for (const set of setArray) {
    for (let j = 1; j < 8; j++) {
      eBitValues.push(addHighBit(set[j] * 1, set[0] * 1, j - 1));
    }
  }
  
  return eBitValues;
}