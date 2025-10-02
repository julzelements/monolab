import { parseMonologueSysEx } from "./monologue-parser";
import fs from "fs";
import path from "path";

// Load and test all dump files
const dumpsDir = path.join(process.cwd(), "example-solution", "dumps");
const dumpFiles = fs.readdirSync(dumpsDir).filter((file) => file.endsWith(".json"));

console.log("Testing Monologue SysEx Parser...\n");

let totalTests = 0;
let passedTests = 0;

for (const dumpFile of dumpFiles.sort()) {
  const dumpPath = path.join(dumpsDir, dumpFile);
  const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

  console.log(`\n--- Testing ${dumpFile} ---`);

  // Test parseMonologueSysEx function
  try {
    const result = parseMonologueSysEx(dump.rawData);

    totalTests++;

    console.log("Result:", result);

    if (result && result.isValid && result.vcf) {
      console.log(
        `✅ Successfully parsed: ${result.patchName} (cutoff: ${result.vcf.cutoff}, resonance: ${result.vcf.resonance})`
      );
      passedTests++;
    } else {
      console.log("❌ Parser returned invalid result:", result?.error || "No VCF data");
    }
  } catch (error) {
    console.log("❌ Parser error:", error);
    totalTests++;
  }
}

console.log(`\n--- Test Summary ---`);
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);
