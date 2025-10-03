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

/**
 * Deprecated shim file. All functionality moved to encoder.ts
 */
export { encodeMonologueParameters } from "./encoder";
