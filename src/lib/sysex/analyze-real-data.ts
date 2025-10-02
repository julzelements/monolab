/**
 * Analyze real SysEx data to find correct parameter positions
 */

import { decode7BitTo8Bit } from './encoder';

// Real data from export1.json
const REAL_MONOLOGUE_DATA = [240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 60, 97, 102, 0, 120, 32, 97, 99, 105, 100, 51, 84, 62, 0, 0, 0, 127, 0, 127, 101, 127, 122, 99, 0, 121, 85, 0, 29, 0, 0, 16, 3, 97, 79, 16, 0, 3, 37, 50, 0, 12, 36, 0, 32, 56, 19, 38, 87, 0, 72, 83, 8, 69, 81, 68, 48, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 94, 0, 119, 127, 127, 127, 35, 20, 0, 0, 0, 0, 23, 0, 24, 3, 56, 27, 3, 28, 127, 127, 31, 34, 7, 127, 127, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 4, 37, 0, 54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 60, 3, 3, 0, 0, 0, 0, 75, 104, 0, 70, 0, 54, 0, 43, 43, 3, 43, 43, 0, 0, 0, 0, 0, 120, 0, 0, 0, 32, 32, 32, 32, 80, 29, 0, 90, 0, 127, 0, 127, 7, 127, 127, 127, 0, 0, 0, 0, 112, 1, 1, 1, 1, 46, 46, 46, 1, 46, 0, 0, 0, 0, 0, 0, 112, 0, 0, 0, 0, 127, 127, 127, 97, 127, 1, 1, 1, 1, 78, 78, 67, 78, 78, 30, 0, 59, 0, 22, 96, 0, 0, 0, 0, 0, 127, 127, 67, 127, 127, 105, 105, 105, 105, 127, 7, 127, 127, 127, 29, 0, 43, 0, 61, 22, 0, 50, 50, 50, 50, 0, 0, 0, 0, 0, 120, 120, 120, 120, 0, 0, 0, 0, 0, 50, 0, 52, 122, 0, 22, 0, 93, 93, 100, 109, 0, 0, 0, 0, 0, 34, 34, 34, 0, 34, 0, 0, 0, 0, 33, 0, 4, 61, 0, 54, 0, 113, 113, 113, 126, 113, 34, 34, 34, 34, 5, 5, 63, 5, 5, 42, 42, 42, 42, 30, 8, 0, 52, 0, 54, 0, 37, 37, 0, 37, 37, 0, 0, 0, 0, 6, 0, 6, 6, 6, 0, 0, 0, 0, 16, 65, 0, 61, 0, 54, 0, 87, 120, 87, 87, 87, 73, 73, 73, 73, 0, 57, 61, 69, 76, 0, 0, 0, 32, 0, 30, 0, 44, 0, 54, 0, 0, 43, 43, 43, 43, 0, 0, 0, 0, 0, 76, 84, 89, 93, 0, 0, 64, 0, 0, 28, 0, 68, 0, 54, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0, 0, 93, 99, 105, 112, 0, 0, 0, 0, 0, 34, 0, 70, 0, 1, 54, 0, 74, 74, 74, 74, 0, 96, 0, 0, 0, 112, 120, 1, 10, 0, 0, 0, 0, 0, 41, 0, 61, 2, 0, 54, 0, 34, 34, 34, 34, 127, 125, 125, 125, 125, 10, 19, 27, 1, 36, 0, 0, 0, 0, 33, 0, 4, 59, 0, 54, 0, 36, 36, 36, 96, 36, 0, 0, 0, 0, 36, 44, 3, 52, 60, 0, 0, 0, 0, 75, 8, 0, 50, 0, 54, 0, 118, 118, 64, 118, 118, 0, 0, 0, 0, 60, 7, 66, 68, 68, 0, 0, 0, 0, 247];

/**
 * Expected values from user:
 * - Patch name: '<afx acid3> ' (note the trailing space)
 * - Cutoff: ~490 (out of 1023)
 * - Resonance: ~911 (out of 1023)
 */

function analyzeRealData() {
  console.log("🔬 Analyzing real Monologue SysEx data...");
  console.log("Expected values:");
  console.log("  Patch name: '<afx acid3> '");
  console.log("  Cutoff: ~490/1023");
  console.log("  Resonance: ~911/1023");
  console.log("");

  // Extract data section (skip header: F0 42 30 00 01 44 40)
  const dataSection = REAL_MONOLOGUE_DATA.slice(7, -1); // Remove header and F7
  console.log(`📊 Data section: ${dataSection.length} bytes`);

  // Decode 7-bit to 8-bit
  const decoded = decode7BitTo8Bit(dataSection);
  if (!decoded.success) {
    console.error("❌ Failed to decode:", decoded.error);
    return;
  }

  const data8bit = decoded.data;
  console.log(`✅ Decoded to ${data8bit.length} bytes of 8-bit data`);

  // Look for patch name - it should be '<afx acid3> '
  console.log("\n🔍 Searching for patch name...");
  const targetName = '<afx acid3> ';
  const targetBytes = Array.from(Buffer.from(targetName, 'ascii'));
  console.log("Target bytes:", targetBytes.map(b => `0x${b.toString(16)}(${String.fromCharCode(b)})`).join(' '));

  // Search for the pattern
  for (let i = 0; i <= data8bit.length - targetBytes.length; i++) {
    let match = true;
    for (let j = 0; j < targetBytes.length; j++) {
      if (data8bit[i + j] !== targetBytes[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      console.log(`✅ Found patch name at offset ${i}`);
      console.log(`   Data: ${data8bit.slice(i, i + targetBytes.length).map(b => String.fromCharCode(b)).join('')}`);
    }
  }

  // Look for 10-bit values that could be ~490 and ~911
  console.log("\n🔍 Searching for VCF parameters...");
  console.log("Looking for cutoff ~490 (0x1EA) and resonance ~911 (0x38F)");

  for (let i = 0; i < data8bit.length - 1; i++) {
    // Try little-endian 10-bit values
    const value = (data8bit[i + 1] << 8) | data8bit[i];
    const value10bit = value & 0x3FF; // Mask to 10 bits
    
    if (Math.abs(value10bit - 490) <= 5) {
      console.log(`🎯 Potential cutoff at offset ${i}: ${value10bit} (bytes: 0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
    if (Math.abs(value10bit - 911) <= 5) {
      console.log(`🎯 Potential resonance at offset ${i}: ${value10bit} (bytes: 0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }

    // Try big-endian 10-bit values
    const valueBE = (data8bit[i] << 8) | data8bit[i + 1];
    const value10bitBE = valueBE & 0x3FF;
    
    if (Math.abs(value10bitBE - 490) <= 5) {
      console.log(`🎯 Potential cutoff (BE) at offset ${i}: ${value10bitBE} (bytes: 0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
    if (Math.abs(value10bitBE - 911) <= 5) {
      console.log(`🎯 Potential resonance (BE) at offset ${i}: ${value10bitBE} (bytes: 0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
  }

  // Print the first 64 bytes for manual inspection
  console.log("\n📋 First 64 decoded bytes for manual inspection:");
  for (let i = 0; i < Math.min(64, data8bit.length); i += 16) {
    const chunk = data8bit.slice(i, i + 16);
    const hex = chunk.map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ');
    const ascii = chunk.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
    console.log(`${i.toString(16).padStart(4, '0')}: ${hex.padEnd(48)} | ${ascii}`);
  }
}

// Run the analysis
analyzeRealData();