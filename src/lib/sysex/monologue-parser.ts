/**
 * Simplified Monologue SysEx Parser (converted from JavaScript example)
 * Focuses on VCF parameters and patch name for our MVP
 */

import { addLowerBits, getBits, transformDataFrom7BitTo8Bit } from './utilities';

export interface MonologueVCFParams {
  isValid: boolean;
  patchName?: string;
  vcf?: {
    cutoff: number;
    resonance: number;
  };
  error?: string;
}

/**
 * Parse Monologue SysEx data and extract VCF parameters
 * Uses the same logic as the example parser
 */
export function parseMonologueSysEx(rawSysexData: number[]): MonologueVCFParams {
  try {
    // Validate basic structure
    if (rawSysexData.length !== 520) {
      return {
        isValid: false,
        error: `Invalid SysEx length: ${rawSysexData.length}, expected 520`
      };
    }

    // Validate header
    const expectedHeader = [0xF0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x40];
    for (let i = 0; i < expectedHeader.length; i++) {
      if (rawSysexData[i] !== expectedHeader[i]) {
        return {
          isValid: false,
          error: `Invalid header at byte ${i}`
        };
      }
    }

    // Transform to 8-bit data using the same method as example parser
    const data = transformDataFrom7BitTo8Bit(rawSysexData);

    // Extract patch name (first 12 bytes)
    const patchName = data.slice(4, 16)
      .map(x => String.fromCharCode(x))
      .join('')
      .replace(/\0/g, '') // Remove null terminators
      .trim();

    // Extract VCF parameters using exact same logic as example parser
    // Filter creation from example: 
    // new Filter(new Knob('Cutoff', addLowerBits(data[22], data[33], 4)),
    //            new Knob('Resonance', addLowerBits(data[23], data[33], 6)));
    
    const cutoff = addLowerBits(data[22], data[33], 4);
    const resonance = addLowerBits(data[23], data[33], 6);

    return {
      isValid: true,
      patchName,
      vcf: {
        cutoff,
        resonance
      }
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Parse error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

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