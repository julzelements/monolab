/**
 * Korg Monologue SysEx Data Encoder/Decoder
 * 
 * Handles the conversion between 7-bit MIDI data and 8-bit internal data
 * as specified in the Korg Monologue MIDI Implementation Chart.
 * 
 * Key Concepts:
 * - MIDI SysEx can only contain 7-bit values (0-127)
 * - Internal data uses full 8-bit values (0-255) and even 10-bit values (0-1023)
 * - Conversion packs/unpacks MSBs separately according to Korg's specification
 */

export interface DecodedSysExData {
  /** Raw 8-bit data after 7-bit to 8-bit conversion */
  data: number[];
  /** Total bytes after conversion */
  length: number;
  /** Whether the conversion was successful */
  success: boolean;
  /** Any error message */
  error?: string;
}

export interface EncodedSysExData {
  /** Raw 7-bit MIDI-safe data */
  data: number[];
  /** Total bytes after conversion */
  length: number;
  /** Whether the conversion was successful */
  success: boolean;
  /** Any error message */
  error?: string;
}

/**
 * Convert 7-bit MIDI SysEx data to 8-bit internal data
 * 
 * According to Korg spec:
 * - 1 Set = 8bit x 7Byte (original data)
 * - Becomes = 7bit x 8Byte (MIDI data)
 * - MSBs are packed into separate bytes
 * 
 * @param midiData - Array of 7-bit MIDI bytes (should be 7-bit safe)
 * @returns Decoded 8-bit data
 */
export function decode7BitTo8Bit(midiData: number[]): DecodedSysExData {
  // Validate input
  if (midiData.length === 0) {
    return {
      data: [],
      length: 0,
      success: false,
      error: "Empty input data"
    };
  }

  // Check if input is properly 7-bit (all values <= 127)
  for (let i = 0; i < midiData.length; i++) {
    if (midiData[i] > 127) {
      return {
        data: [],
        length: 0,
        success: false,
        error: `Invalid 7-bit data at index ${i}: ${midiData[i]} > 127`
      };
    }
  }

  // Process data in chunks of 8 MIDI bytes -> 7 data bytes
  const decoded: number[] = [];
  
  for (let chunkStart = 0; chunkStart < midiData.length; chunkStart += 8) {
    const chunk = midiData.slice(chunkStart, chunkStart + 8);
    
    // Need at least 8 bytes for a complete chunk
    if (chunk.length < 8) {
      // Handle partial chunk (padding with zeros if needed)
      while (chunk.length < 8) {
        chunk.push(0);
      }
    }
    
    // First byte contains the MSBs (bit 7) of the next 7 bytes
    const msbByte = chunk[0];
    
    // Decode the 7 data bytes
    for (let i = 1; i < 8; i++) {
      const dataByte = chunk[i];
      const msb = (msbByte >> (7 - i)) & 1; // Extract MSB for this position
      const fullByte = (msb << 7) | dataByte; // Combine MSB + 7-bit data
      decoded.push(fullByte);
    }
  }
  
  return {
    data: decoded,
    length: decoded.length,
    success: true
  };
}

/**
 * Convert 8-bit internal data to 7-bit MIDI SysEx data
 * 
 * Reverse of decode7BitTo8Bit - packs MSBs separately
 * 
 * @param internalData - Array of 8-bit internal bytes
 * @returns Encoded 7-bit MIDI-safe data
 */
export function encode8BitTo7Bit(internalData: number[]): EncodedSysExData {
  // Validate input
  if (internalData.length === 0) {
    return {
      data: [],
      length: 0,
      success: false,
      error: "Empty input data"
    };
  }

  // Check if input is valid 8-bit data
  for (let i = 0; i < internalData.length; i++) {
    if (internalData[i] < 0 || internalData[i] > 255) {
      return {
        data: [],
        length: 0,
        success: false,
        error: `Invalid 8-bit data at index ${i}: ${internalData[i]}`
      };
    }
  }

  const encoded: number[] = [];
  
  // Process data in chunks of 7 data bytes -> 8 MIDI bytes
  for (let chunkStart = 0; chunkStart < internalData.length; chunkStart += 7) {
    const chunk = internalData.slice(chunkStart, chunkStart + 7);
    
    // Pad chunk to 7 bytes if necessary
    while (chunk.length < 7) {
      chunk.push(0);
    }
    
    // Extract MSBs and create MSB byte
    let msbByte = 0;
    const dataBytes: number[] = [];
    
    for (let i = 0; i < 7; i++) {
      const fullByte = chunk[i];
      const msb = (fullByte >> 7) & 1; // Extract MSB
      const data = fullByte & 0x7F; // Remove MSB, keep lower 7 bits
      
      msbByte |= (msb << (6 - i)); // Pack MSB into position
      dataBytes.push(data);
    }
    
    // Add MSB byte first, then data bytes
    encoded.push(msbByte);
    encoded.push(...dataBytes);
  }
  
  return {
    data: encoded,
    length: encoded.length,
    success: true
  };
}

/**
 * Utility function to validate that data is 7-bit safe
 */
export function is7BitSafe(data: number[]): boolean {
  return data.every(byte => byte >= 0 && byte <= 127);
}

/**
 * Utility function to validate that data is 8-bit safe
 */
export function is8BitSafe(data: number[]): boolean {
  return data.every(byte => byte >= 0 && byte <= 255);
}