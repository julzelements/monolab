/**
 * Tests for Korg Monologue SysEx Encoder/Decoder
 *
 * Tests the critical 7-bit to 8-bit conversion logic
 */

import {
  decode7BitTo8Bit,
  encode8BitTo7Bit,
  is7BitSafe,
  is8BitSafe,
  type DecodedSysExData,
  type EncodedSysExData,
} from "./encoder";

/**
 * Test data based on the Korg specification example
 */
const TEST_CASES = {
  // Simple case: all MSBs are 0
  simple7Bit: [0, 1, 2, 3, 4, 5, 6, 7], // MSB byte + 7 data bytes
  simple8Bit: [1, 2, 3, 4, 5, 6, 7], // Expected result

  // Complex case: some MSBs are 1
  complex7Bit: [0b01010101, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70], // MSBs: 0,1,0,1,0,1,0,1
  complex8Bit: [0x90, 0x20, 0xb0, 0x40, 0xd0, 0x60, 0xf0], // With MSBs applied

  // Edge case: all MSBs are 1
  maxMSB7Bit: [0b01111111, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06], // All MSBs set
  maxMSB8Bit: [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86], // All with bit 7 set
};

/**
 * Run all encoder/decoder tests
 */
export function runEncoderTests(): boolean {
  console.log("🧪 Running SysEx Encoder/Decoder Tests...");

  let allPassed = true;

  // Test 1: Simple 7-bit to 8-bit decoding
  console.log("\n📝 Test 1: Simple 7-bit to 8-bit decoding");
  const result1 = decode7BitTo8Bit(TEST_CASES.simple7Bit);
  if (result1.success && arraysEqual(result1.data, TEST_CASES.simple8Bit)) {
    console.log("✅ PASS: Simple decoding works");
  } else {
    console.log("❌ FAIL: Simple decoding failed", result1);
    allPassed = false;
  }

  // Test 2: Complex 7-bit to 8-bit decoding
  console.log("\n📝 Test 2: Complex 7-bit to 8-bit decoding");
  const result2 = decode7BitTo8Bit(TEST_CASES.complex7Bit);
  if (result2.success && arraysEqual(result2.data, TEST_CASES.complex8Bit)) {
    console.log("✅ PASS: Complex decoding works");
  } else {
    console.log("❌ FAIL: Complex decoding failed");
    console.log(
      "Expected:",
      TEST_CASES.complex8Bit.map((b) => "0x" + b.toString(16))
    );
    console.log(
      "Got:",
      result2.data.map((b) => "0x" + b.toString(16))
    );
    allPassed = false;
  }

  // Test 3: Round-trip encoding/decoding
  console.log("\n📝 Test 3: Round-trip encoding/decoding");
  const originalData = [0x00, 0x7f, 0x80, 0xff, 0x55, 0xaa, 0x42];
  const encoded = encode8BitTo7Bit(originalData);
  const decoded = decode7BitTo8Bit(encoded.data);

  if (encoded.success && decoded.success && arraysEqual(decoded.data.slice(0, originalData.length), originalData)) {
    console.log("✅ PASS: Round-trip conversion works");
  } else {
    console.log("❌ FAIL: Round-trip conversion failed");
    console.log(
      "Original:",
      originalData.map((b) => "0x" + b.toString(16))
    );
    console.log(
      "Encoded:",
      encoded.data.map((b) => "0x" + b.toString(16))
    );
    console.log(
      "Decoded:",
      decoded.data.map((b) => "0x" + b.toString(16))
    );
    allPassed = false;
  }

  // Test 4: Error handling for invalid 7-bit data
  console.log("\n📝 Test 4: Error handling for invalid 7-bit data");
  const result4 = decode7BitTo8Bit([0, 1, 2, 128, 4, 5, 6, 7]); // 128 > 127
  if (!result4.success && result4.error?.includes("Invalid 7-bit data")) {
    console.log("✅ PASS: Correctly rejects invalid 7-bit data");
  } else {
    console.log("❌ FAIL: Should reject invalid 7-bit data", result4);
    allPassed = false;
  }

  // Test 5: Error handling for invalid 8-bit data
  console.log("\n📝 Test 5: Error handling for invalid 8-bit data");
  const result5 = encode8BitTo7Bit([0, 1, 2, -1, 4, 256]); // -1 and 256 are invalid
  if (!result5.success && result5.error?.includes("Invalid 8-bit data")) {
    console.log("✅ PASS: Correctly rejects invalid 8-bit data");
  } else {
    console.log("❌ FAIL: Should reject invalid 8-bit data", result5);
    allPassed = false;
  }

  // Test 6: Utility functions
  console.log("\n📝 Test 6: Utility functions");
  const is7BitValid = is7BitSafe([0, 1, 127]) && !is7BitSafe([0, 1, 128]);
  const is8BitValid = is8BitSafe([0, 1, 255]) && !is8BitSafe([0, 1, 256]);

  if (is7BitValid && is8BitValid) {
    console.log("✅ PASS: Utility functions work correctly");
  } else {
    console.log("❌ FAIL: Utility functions failed");
    allPassed = false;
  }

  // Summary
  console.log(allPassed ? "\n🎉 All tests passed!" : "\n💥 Some tests failed!");
  return allPassed;
}

/**
 * Test with real Monologue data
 */
export function testWithRealData(sysexData: number[]): void {
  console.log("🎹 Testing with real Monologue SysEx data...");

  // Skip header (7 bytes) and terminator (1 byte)
  const dataSection = sysexData.slice(7, -1);
  console.log(`📊 Data section: ${dataSection.length} bytes`);

  // Check if it's 7-bit safe
  if (!is7BitSafe(dataSection)) {
    console.log("⚠️ Warning: Data contains bytes > 127, might not be properly encoded");
  } else {
    console.log("✅ Data is 7-bit safe");
  }

  // Try to decode
  const decoded = decode7BitTo8Bit(dataSection);
  if (decoded.success) {
    console.log(`✅ Successfully decoded ${decoded.length} bytes of 8-bit data`);
    console.log(
      "First 10 decoded bytes:",
      decoded.data.slice(0, 10).map((b) => "0x" + b.toString(16))
    );
  } else {
    console.log("❌ Failed to decode:", decoded.error);
  }
}

// Helper function
function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
