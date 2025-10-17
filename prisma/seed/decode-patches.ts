import { MonologueParameters, decodeMonologueParameters } from "@/lib/sysex";
import fs from "fs";
import path from "path";

// Load test dump files
function loadDumpFile(filename: string): { rawData: number[]; name?: string } {
  const filePath = path.join(__dirname, "../../src/lib/sysex/tests/data/dumps", filename);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

export interface DecodedPatch {
  name: string;
  description: string;
  tags: string[];
  parameters: MonologueParameters;
  rawData: number[];
}

async function decodePatches(): Promise<DecodedPatch[]> {
  console.log("🔄 Decoding patches from dump files...");

  // Load and decode the 5 test dump files
  const dumpFiles = ["dump1.json", "dump2.json", "dump3.json", "dump4.json", "dump5.json"];
  const patches: DecodedPatch[] = [];

  for (const filename of dumpFiles) {
    console.log(`Loading ${filename}...`);
    const dump = loadDumpFile(filename);
    const decodedParams = decodeMonologueParameters(dump.rawData);

    if (decodedParams.isValid && decodedParams.drive !== undefined) {
      // Type guard: if isValid is true and required fields exist, it's MonologueParameters
      const validParams = decodedParams as MonologueParameters;
      patches.push({
        name: validParams.patchName || `Patch ${filename.replace(".json", "")}`,
        description: `Decoded patch from ${filename}`,
        tags: ["demo", "test", "decoded"],
        parameters: validParams,
        rawData: dump.rawData,
      });
      console.log(`✅ Successfully decoded ${filename}: ${validParams.patchName}`);
    } else {
      console.error(`❌ Failed to decode ${filename}:`, decodedParams.error || "Invalid parameters");
    }
  }

  return patches;
}

async function generatePatchesFile() {
  console.log("🔄 Generating static patches file...");

  const patches = await decodePatches();

  // Generate TypeScript content
  const content = `// Auto-generated patch data from SysEx dumps
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'npm run db:seed-generate' to regenerate

import { MonologueParameters } from "@/lib/sysex";

export interface DecodedPatch {
  name: string;
  description: string;
  tags: string[];
  parameters: MonologueParameters;
  rawData: number[];
}

export const patches: DecodedPatch[] = ${JSON.stringify(patches, null, 2)};
`;

  // Write to patches.ts
  const outputPath = path.join(__dirname, "patches.ts");
  fs.writeFileSync(outputPath, content, "utf8");

  console.log(`✅ Generated ${patches.length} patches in ${outputPath}`);
  console.log("📦 Patches generated:", patches.map((p) => p.name).join(", "));
}

// Run if called directly
if (require.main === module) {
  generatePatchesFile().catch(console.error);
}

export { generatePatchesFile };
