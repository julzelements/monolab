/**
 * Look more carefully at the patch name area
 */

import { decode7BitTo8Bit } from './encoder';

const REAL_MONOLOGUE_DATA = [240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 60, 97, 102, 0, 120, 32, 97, 99, 105, 100, 51, 84, 62, 0, 0, 0, 127, 0, 127, 101, 127, 122, 99, 0, 121, 85, 0, 29, 0, 0, 16, 3, 97, 79, 16, 0, 3, 37, 50, 0, 12, 36, 0, 32, 56, 19, 38, 87, 0, 72, 83, 8, 69, 81, 68, 48, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 94, 0, 119, 127, 127, 127, 35, 20, 0, 0, 0, 0, 23, 0, 24, 3, 56, 27, 3, 28, 127, 127, 31, 34, 7, 127, 127, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 4, 37, 0, 54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 60, 3, 3, 0, 0, 0, 0, 75, 104, 0, 70, 0, 54, 0, 43, 43, 3, 43, 43, 0, 0, 0, 0, 0, 120, 0, 0, 0, 32, 32, 32, 32, 80, 29, 0, 90, 0, 127, 0, 127, 7, 127, 127, 127, 0, 0, 0, 0, 112, 1, 1, 1, 1, 46, 46, 46, 1, 46, 0, 0, 0, 0, 0, 0, 112, 0, 0, 0, 0, 127, 127, 127, 97, 127, 1, 1, 1, 1, 78, 78, 67, 78, 78, 30, 0, 59, 0, 22, 96, 0, 0, 0, 0, 0, 127, 127, 67, 127, 127, 105, 105, 105, 105, 127, 7, 127, 127, 127, 29, 0, 43, 0, 61, 22, 0, 50, 50, 50, 50, 0, 0, 0, 0, 0, 120, 120, 120, 120, 0, 0, 0, 0, 0, 50, 0, 52, 122, 0, 22, 0, 93, 93, 100, 109, 0, 0, 0, 0, 0, 34, 34, 34, 0, 34, 0, 0, 0, 0, 33, 0, 4, 61, 0, 54, 0, 113, 113, 113, 126, 113, 34, 34, 34, 34, 5, 5, 63, 5, 5, 42, 42, 42, 42, 30, 8, 0, 52, 0, 54, 0, 37, 37, 0, 37, 37, 0, 0, 0, 0, 6, 0, 6, 6, 6, 0, 0, 0, 0, 16, 65, 0, 61, 0, 54, 0, 87, 120, 87, 87, 87, 73, 73, 73, 73, 0, 57, 61, 69, 76, 0, 0, 0, 32, 0, 30, 0, 44, 0, 54, 0, 0, 43, 43, 43, 43, 0, 0, 0, 0, 0, 76, 84, 89, 93, 0, 0, 64, 0, 0, 28, 0, 68, 0, 54, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0, 0, 93, 99, 105, 112, 0, 0, 0, 0, 0, 34, 0, 70, 0, 1, 54, 0, 74, 74, 74, 74, 0, 96, 0, 0, 0, 112, 120, 1, 10, 0, 0, 0, 0, 0, 41, 0, 61, 2, 0, 54, 0, 34, 34, 34, 34, 127, 125, 125, 125, 125, 10, 19, 27, 1, 36, 0, 0, 0, 0, 33, 0, 4, 59, 0, 54, 0, 36, 36, 36, 96, 36, 0, 0, 0, 0, 36, 44, 3, 52, 60, 0, 0, 0, 0, 75, 8, 0, 50, 0, 54, 0, 118, 118, 64, 118, 118, 0, 0, 0, 0, 60, 7, 66, 68, 68, 0, 0, 0, 0, 247];

function analyzePatchName() {
  console.log("🔍 Detailed patch name analysis...");
  
  // Extract data section and decode
  const dataSection = REAL_MONOLOGUE_DATA.slice(7, -1);
  const decoded = decode7BitTo8Bit(dataSection);
  if (!decoded.success) return;
  
  const data8bit = decoded.data;
  
  // Print first 32 bytes with both hex and ASCII
  console.log("First 32 decoded bytes:");
  for (let i = 0; i < 32; i++) {
    const byte = data8bit[i];
    const hex = `0x${byte.toString(16).padStart(2, '0')}`;
    const ascii = (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
    console.log(`  ${i.toString().padStart(2)}: ${hex} '${ascii}'`);
  }
  
  // According to Korg spec, patch name might be 12 bytes starting at different offsets
  console.log("\nTrying different offsets for 12-byte patch name:");
  
  for (let offset = 0; offset < 20; offset++) {
    const nameBytes = data8bit.slice(offset, offset + 12);
    const name = nameBytes.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
    console.log(`  Offset ${offset.toString().padStart(2)}: "${name}"`);
  }
}

function analyzeVCFParams() {
  console.log("\n🎛️ Detailed VCF parameter analysis...");
  
  const dataSection = REAL_MONOLOGUE_DATA.slice(7, -1);
  const decoded = decode7BitTo8Bit(dataSection);
  if (!decoded.success) return;
  
  const data8bit = decoded.data;
  
  // Check the specific offsets we found
  console.log("Checking potential VCF parameter locations:");
  
  // Resonance at offset 30: 0x90 0x83
  const res30_le = (data8bit[31] << 8) | data8bit[30]; // little endian
  const res30_be = (data8bit[30] << 8) | data8bit[31]; // big endian
  console.log(`  Offset 30-31 (0x${data8bit[30].toString(16)} 0x${data8bit[31].toString(16)}): LE=${res30_le & 0x3FF}, BE=${res30_be & 0x3FF}`);
  
  // Cutoff at offset 200: 0x69 0xe9 
  if (data8bit.length > 201) {
    const cut200_le = (data8bit[201] << 8) | data8bit[200]; 
    const cut200_be = (data8bit[200] << 8) | data8bit[201];
    console.log(`  Offset 200-201 (0x${data8bit[200].toString(16)} 0x${data8bit[201].toString(16)}): LE=${cut200_le & 0x3FF}, BE=${cut200_be & 0x3FF}`);
  }
  
  // Let's also check if parameters might be spread differently
  console.log("\nScanning for exact values (490 and 911) in different formats:");
  
  for (let i = 0; i < data8bit.length - 1; i++) {
    const le = ((data8bit[i + 1] << 8) | data8bit[i]) & 0x3FF;
    const be = ((data8bit[i] << 8) | data8bit[i + 1]) & 0x3FF;
    
    if (le === 490 || Math.abs(le - 490) <= 2) {
      console.log(`  🎯 Cutoff candidate at ${i}: LE=${le} (0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
    if (le === 911 || Math.abs(le - 911) <= 2) {
      console.log(`  🎯 Resonance candidate at ${i}: LE=${le} (0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
    
    if (be === 490 || Math.abs(be - 490) <= 2) {
      console.log(`  🎯 Cutoff candidate at ${i}: BE=${be} (0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
    if (be === 911 || Math.abs(be - 911) <= 2) {
      console.log(`  🎯 Resonance candidate at ${i}: BE=${be} (0x${data8bit[i].toString(16)} 0x${data8bit[i+1].toString(16)})`);
    }
  }
}

analyzePatchName();
analyzeVCFParams();