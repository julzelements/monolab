/**
 * Korg Monologue SysEx Library
 *
 * Complete encoder/decoder system for Korg Monologue SysEx data (520 bytes)
 * Supporting both MVP UI functionality and comprehensive MIDI spec implementation.
 *
 * Architecture:
 * - 7↔8 bit transformation (512 data bytes / 8 * 7 = 448 bytes conversion)
 * - Round-trip encoding capability with full parameter fidelity
 * - Dual parser approach: focused MVP vs comprehensive implementation
 */

// =============================================================================
// CORE 7-BIT ↔ 8-BIT TRANSFORMATION
// =============================================================================
// Low-level encoding/decoding functions for MIDI SysEx format conversion
export {
  decode7BitTo8Bit,
  encode8BitTo7Bit,
  is7BitSafe,
  is8BitSafe,
  type DecodedSysExData,
  type EncodedSysExData,
} from "./encoder";

// =============================================================================
// COMPREHENSIVE PARAMETER EXTRACTION (Full MIDI Spec)
// =============================================================================
// Complete implementation supporting all parameters from Korg Monologue MIDI spec
// Use for: Full parameter access, round-trip encoding, future feature development
export {
  decodeMonologueParameters,
  getVCFMidiValues,
  to7BitMidiValue,
  from7BitMidiValue,
  type MonologueParameters,
} from "./decoder";

// =============================================================================
// MVP PARAMETER EXTRACTION (Production UI)
// =============================================================================
// Focused implementation for VCF controls + patch names (cutoff, resonance)
// Use for: Current UI components, lightweight parsing, production MVP
export { parseMonologueSysEx, type MonologueVCFParams } from "./monologue-parser";

// =============================================================================
// ROUND-TRIP ENCODING (Work in Progress)
// =============================================================================
// Converts MonologueParameters back to SysEx format for perfect round-trip encoding
// Status: 60% working (3/5 test dumps pass), missing sequencer/motion parameters
// Note: Requires comprehensive MonologueParameters from decoder.ts
export { encodeMonologueParameters } from "./encoder-new";

// =============================================================================
// UTILITIES
// =============================================================================
// Bit manipulation and data transformation helpers
export { addLowerBits, getBits, transformDataFrom7BitTo8Bit } from "./utilities";
