/**
 * Korg Monologue SysEx Library
 *
 * Comprehensive encoder/decoder for Korg Monologue SysEx data
 */

// Core encoding/decoding functions
export {
  decode7BitTo8Bit,
  encode8BitTo7Bit,
  is7BitSafe,
  is8BitSafe,
  type DecodedSysExData,
  type EncodedSysExData,
} from "./encoder";

// Parameter extraction and conversion
export {
  decodeMonologueParameters,
  decodeMonologueVCFParameters,
  getVCFMidiValues,
  to7BitMidiValue,
  from7BitMidiValue,
  type MonologueParameters,
  type LegacyMonologueParameters,
} from "./decoder";

// New Monologue parser (converted from example)
export { parseMonologueSysEx, type MonologueVCFParams } from "./monologue-parser";

// Utilities
export { addLowerBits, getBits, transformDataFrom7BitTo8Bit } from "./utilities";
