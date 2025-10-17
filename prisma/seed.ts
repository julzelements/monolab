import { MonologueParameters, decodeMonologueParameters } from "@/lib/sysex";
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Load test dump files
function loadDumpFile(filename: string): { rawData: number[]; name?: string } {
  const filePath = path.join(__dirname, "../src/lib/sysex/tests/data/dumps", filename);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

async function main() {
  console.log("Seeding database...");

  // Create or get existing sample user
  let user = await prisma.user.findUnique({
    where: { email: "demo@monolab.app" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@monolab.app",
        name: "Demo User",
      },
    });
  }

  // Load and decode the 5 test dump files
  const dumpFiles = ["dump1.json", "dump2.json", "dump3.json", "dump4.json", "dump5.json"];
  const patches: Array<{
    name: string;
    description: string;
    tags: string[];
    parameters: MonologueParameters;
    rawData: number[];
  }> = [];

  for (const filename of dumpFiles) {
    console.log(`Loading ${filename}...`);
    const dump = loadDumpFile(filename);
    const decodedParams = decodeMonologueParameters(dump.rawData);

    if (decodedParams.isValid) {
      patches.push({
        name: decodedParams.patchName || `Patch ${filename.replace(".json", "")}`,
        description: `Decoded patch from ${filename}`,
        tags: ["demo", "test", "decoded"],
        parameters: decodedParams,
        rawData: dump.rawData,
      });
      console.log(`✅ Successfully decoded ${filename}: ${decodedParams.patchName}`);
    } else {
      console.error(`❌ Failed to decode ${filename}:`, decodedParams.error);
    }
  }

  // Create patches from the decoded dump files
  for (const patch of patches) {
    console.log(`Creating patch: ${patch.name}`);

    const sysexBuffer = Buffer.from(patch.rawData);
    const sysexHash = createHash("sha256").update(sysexBuffer).digest("hex");

    // Check if patch already exists
    const existingPatch = await prisma.patch.findUnique({
      where: { sysexHash },
    });

    if (!existingPatch) {
      await prisma.patch.create({
        data: {
          authorId: user.id,
          sysexData: sysexBuffer,
          sysexHash,
          shareToken: createHash("sha256")
            .update(`${user.id}-${patch.name}-${Date.now()}`)
            .digest("hex")
            .substring(0, 16),
          name: patch.name,
          description: patch.description,
          tags: patch.tags,
          parameters: patch.parameters as any, // Type assertion for Prisma JSON field
        },
      });
      console.log(`✅ Created patch: ${patch.name}`);
    } else {
      console.log(`⚠️ Patch already exists: ${patch.name}`);
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
