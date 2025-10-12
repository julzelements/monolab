import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

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

  // Create sample patches with mock SysEx data
  const patches = [
    {
      name: "Init Program",
      description: "Basic initialization patch",
      tags: ["init", "basic"],
      parameters: {
        vco: { wave: "saw", octave: 0, pitch: 0 },
        vcf: { cutoff: 127, resonance: 0, eg: 64, type: "lpf" },
        vca: { level: 127 },
        eg: { attack: 0, decay: 64, sustain: 127, release: 64 },
        lfo: { rate: 64, intensity: 0, target: "pitch", wave: "triangle" },
      },
    },
    {
      name: "Lead Saw",
      description: "Bright lead synthesizer sound",
      tags: ["lead", "bright", "saw"],
      parameters: {
        vco: { wave: "saw", octave: 1, pitch: 0 },
        vcf: { cutoff: 100, resonance: 32, eg: 96, type: "lpf" },
        vca: { level: 127 },
        eg: { attack: 10, decay: 40, sustain: 80, release: 30 },
        lfo: { rate: 80, intensity: 16, target: "cutoff", wave: "triangle" },
      },
    },
    {
      name: "Bass Pulse",
      description: "Deep bass with pulse width modulation",
      tags: ["bass", "pulse", "deep"],
      parameters: {
        vco: { wave: "pulse", octave: -1, pitch: 0 },
        vcf: { cutoff: 60, resonance: 40, eg: 32, type: "lpf" },
        vca: { level: 127 },
        eg: { attack: 0, decay: 80, sustain: 40, release: 20 },
        lfo: { rate: 60, intensity: 32, target: "pulse_width", wave: "triangle" },
      },
    },
  ];

  for (const patchData of patches) {
    // Mock SysEx data - in real implementation this would be actual MIDI data
    // Make each patch unique by varying one byte
    const patchIndex = patches.indexOf(patchData);
    const mockSysEx = Buffer.from([
      0xf0,
      0x42,
      0x30,
      0x00,
      0x01,
      0x44,
      0x00,
      0x00, // Header
      ...Array(256)
        .fill(0)
        .map((_, i) => (i + patchIndex) % 128), // Parameter data (varied per patch)
      0xf7, // End of SysEx
    ]);

    // Calculate hash for the SysEx data
    const sysexHash = createHash("sha256").update(mockSysEx).digest("hex");

    await prisma.patch.create({
      data: {
        ...patchData,
        authorId: user.id,
        sysexData: mockSysEx,
        sysexHash,
        shareToken: `share_${Math.random().toString(36).substr(2, 9)}`,
      },
    });
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
