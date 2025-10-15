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

  // Create sample patches with real Monologue data
  const patches = [
    {
      name: "<afx acid3>",
      description: "Acid bass patch with sequencer pattern",
      tags: ["acid", "bass", "sequenced"],
      parameters: {
        patchName: "<afx acid3>",
        drive: { name: "Drive", value: 0 },
        oscilators: [
          {
            wave: { name: "Wave", value: 2, oscilator: 0 },
            shape: { name: "Shape", value: 0 },
            level: { name: "Level", value: 1023 },
            pitch: { name: "Pitch", value: 0 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 0 },
          },
          {
            wave: { name: "Wave", value: 2, oscilator: 1 },
            shape: { name: "Shape", value: 0 },
            level: { name: "Level", value: 1023 },
            pitch: { name: "Pitch", value: 1023 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 0 },
          },
        ],
        filter: { cutoff: { name: "Cutoff", value: 488 }, resonance: { name: "Resonance", value: 909 } },
        envelope: {
          type: { name: "Envelope Type", value: 0 },
          attack: { name: "Attack", value: 0 },
          decay: { name: "Decay", value: 485 },
          intensity: { name: "Intensity", value: 343 },
          target: { name: "Target", value: 0, type: 0 },
        },
        lfo: {
          wave: { name: "Wave", value: 1, oscilator: 2 },
          mode: { name: "LFO Mode", value: 1 },
          rate: { name: "Rate", value: 512 },
          intensity: { name: "Intensity", value: 0 },
          target: { name: "Target", value: 2, type: 1 },
        },
        misc: {
          bpmSync: { name: "BPM Sync", value: 0 },
          portamentMode: { name: "Portament Mode", value: 0 },
          portamentTime: { name: "Potament Time", value: 0 },
          cutoffVelocity: { name: "Cutoff Velocity", value: 2 },
          cutoffKeyTrack: { name: "Cutoff Key Track", value: 0 },
          sliderAssign: { name: "Slider Assign", value: "PITCH BEND" },
        },
      },
      rawData: [
        240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 60, 97, 102, 0, 120, 32, 97, 99, 105, 100, 51, 84, 62, 0, 0, 0,
        127, 0, 127, 101, 127, 122, 99, 0, 121, 85, 0, 29, 0, 0, 16, 3, 97, 79, 16, 0, 3, 37, 50, 0, 12, 36, 0, 32, 56,
        19, 38, 87, 0, 72, 83, 8, 69, 81, 68, 48, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 94, 0, 119, 127, 127, 127, 35,
        20, 0, 0, 0, 0, 23, 0, 24, 3, 56, 27, 3, 28, 127, 127, 31, 34, 7, 127, 127, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        40, 0, 4, 37, 0, 54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 60, 3, 3, 0, 0, 0, 0, 75, 104, 0, 70, 0, 54, 0, 43, 43,
        3, 43, 43, 0, 0, 0, 0, 0, 120, 0, 0, 0, 32, 32, 32, 32, 80, 29, 0, 90, 0, 127, 0, 127, 7, 127, 127, 127, 0, 0,
        0, 0, 112, 1, 1, 1, 1, 46, 46, 46, 1, 46, 0, 0, 0, 0, 0, 0, 112, 0, 0, 0, 0, 127, 127, 127, 97, 127, 1, 1, 1, 1,
        78, 78, 67, 78, 78, 30, 0, 59, 0, 22, 96, 0, 0, 0, 0, 0, 127, 127, 67, 127, 127, 105, 105, 105, 105, 127, 7,
        127, 127, 127, 29, 0, 43, 0, 61, 22, 0, 50, 50, 50, 50, 0, 0, 0, 0, 0, 120, 120, 120, 120, 0, 0, 0, 0, 0, 50, 0,
        52, 122, 0, 22, 0, 93, 93, 100, 109, 0, 0, 0, 0, 0, 34, 34, 34, 0, 34, 0, 0, 0, 0, 33, 0, 4, 61, 0, 54, 0, 113,
        113, 113, 126, 113, 34, 34, 34, 34, 5, 5, 63, 5, 5, 42, 42, 42, 42, 30, 8, 0, 52, 0, 54, 0, 37, 37, 0, 37, 37,
        0, 0, 0, 0, 6, 0, 6, 6, 6, 0, 0, 0, 0, 16, 65, 0, 61, 0, 54, 0, 87, 120, 87, 87, 87, 73, 73, 73, 73, 0, 57, 61,
        69, 76, 0, 0, 0, 32, 0, 30, 0, 44, 0, 54, 0, 0, 43, 43, 43, 43, 0, 0, 0, 0, 0, 76, 84, 89, 93, 0, 0, 64, 0, 0,
        28, 0, 68, 0, 54, 0, 0, 100, 100, 100, 100, 0, 0, 0, 0, 0, 93, 99, 105, 112, 0, 0, 0, 0, 0, 34, 0, 70, 0, 1, 54,
        0, 74, 74, 74, 74, 0, 96, 0, 0, 0, 112, 120, 1, 10, 0, 0, 0, 0, 0, 41, 0, 61, 2, 0, 54, 0, 34, 34, 34, 34, 127,
        125, 125, 125, 125, 10, 19, 27, 1, 36, 0, 0, 0, 0, 33, 0, 4, 59, 0, 54, 0, 36, 36, 36, 96, 36, 0, 0, 0, 0, 36,
        44, 3, 52, 60, 0, 0, 0, 0, 75, 8, 0, 50, 0, 54, 0, 118, 118, 64, 118, 118, 0, 0, 0, 0, 60, 7, 66, 68, 68, 0, 0,
        0, 0, 247,
      ],
    },
    {
      name: "Injection",
      description: "High-drive bass with motion sequencing",
      tags: ["bass", "drive", "motion"],
      parameters: {
        patchName: "Injection",
        drive: { name: "Drive", value: 1023 },
        oscilators: [
          {
            wave: { name: "Wave", value: 2, oscilator: 0 },
            shape: { name: "Shape", value: 0 },
            level: { name: "Level", value: 573 },
            pitch: { name: "Pitch", value: 0 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 0 },
          },
          {
            wave: { name: "Wave", value: 1, oscilator: 1 },
            shape: { name: "Shape", value: 0 },
            level: { name: "Level", value: 1023 },
            pitch: { name: "Pitch", value: 472 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 1 },
          },
        ],
        filter: { cutoff: { name: "Cutoff", value: 687 }, resonance: { name: "Resonance", value: 852 } },
        envelope: {
          type: { name: "Envelope Type", value: 2 },
          attack: { name: "Attack", value: 0 },
          decay: { name: "Decay", value: 499 },
          intensity: { name: "Intensity", value: 90 },
          target: { name: "Target", value: 0, type: 0 },
        },
        lfo: {
          wave: { name: "Wave", value: 1, oscilator: 2 },
          mode: { name: "LFO Mode", value: 1 },
          rate: { name: "Rate", value: 109 },
          intensity: { name: "Intensity", value: 131 },
          target: { name: "Target", value: 0, type: 1 },
        },
        misc: {
          bpmSync: { name: "BPM Sync", value: 1 },
          portamentMode: { name: "Portament Mode", value: 1 },
          portamentTime: { name: "Potament Time", value: 0 },
          cutoffVelocity: { name: "Cutoff Velocity", value: 0 },
          cutoffKeyTrack: { name: "Cutoff Key Track", value: 1 },
          sliderAssign: { name: "Slider Assign", value: "PITCH BEND" },
        },
      },
      rawData: [
        240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 73, 110, 106, 0, 101, 99, 116, 105, 111, 110, 0, 68, 0, 0, 0, 0,
        118, 0, 15, 39, 127, 43, 85, 0, 124, 22, 27, 23, 32, 127, 16, 80, 101, 61, 50, 1, 118, 5, 50, 0, 12, 36, 0, 34,
        56, 76, 79, 102, 0, 72, 83, 8, 69, 81, 68, 98, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 30, 0, 127, 127, 127,
        127, 0, 0, 0, 0, 0, 3, 23, 3, 27, 0, 120, 0, 0, 0, 127, 127, 127, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        43, 0, 112, 66, 0, 71, 0, 19, 19, 19, 1, 19, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 66, 0, 71, 0,
        104, 104, 0, 104, 247,
      ],
    },
    {
      name: "Anfem",
      description: "Atmospheric pad with LFO modulation",
      tags: ["pad", "atmospheric", "lfo"],
      parameters: {
        patchName: "Anfem",
        drive: { name: "Drive", value: 78 },
        oscilators: [
          {
            wave: { name: "Wave", value: 1, oscilator: 0 },
            shape: { name: "Shape", value: 0 },
            level: { name: "Level", value: 1023 },
            pitch: { name: "Pitch", value: 0 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 0 },
          },
          {
            wave: { name: "Wave", value: 2, oscilator: 1 },
            shape: { name: "Shape", value: 364 },
            level: { name: "Level", value: 1023 },
            pitch: { name: "Pitch", value: 225 },
            duty: { name: "Duty", value: 1 },
            octave: { name: "Octave", value: 3 },
          },
        ],
        filter: { cutoff: { name: "Cutoff", value: 90 }, resonance: { name: "Resonance", value: 579 } },
        envelope: {
          type: { name: "Envelope Type", value: 2 },
          attack: { name: "Attack", value: 0 },
          decay: { name: "Decay", value: 704 },
          intensity: { name: "Intensity", value: 309 },
          target: { name: "Target", value: 0, type: 0 },
        },
        lfo: {
          wave: { name: "Wave", value: 2, oscilator: 2 },
          mode: { name: "LFO Mode", value: 2 },
          rate: { name: "Rate", value: 50 },
          intensity: { name: "Intensity", value: 235 },
          target: { name: "Target", value: 0, type: 1 },
        },
        misc: {
          bpmSync: { name: "BPM Sync", value: 1 },
          portamentMode: { name: "Portament Mode", value: 0 },
          portamentTime: { name: "Potament Time", value: 0 },
          cutoffVelocity: { name: "Cutoff Velocity", value: 2 },
          cutoffKeyTrack: { name: "Cutoff Key Track", value: 0 },
          sliderAssign: { name: "Slider Assign", value: "CUTOFF" },
        },
      },
      // Using a shorter mock rawData for the third patch to keep file readable
      rawData: [
        240, 66, 48, 0, 1, 68, 64, 0, 80, 82, 79, 71, 65, 110, 102, 101, 109, 0, 0, 0, 0, 0, 0, 0, 78, 0, 127, 101, 127,
        122, 99, 0, 121, 85, 0, 29, 0, 0, 16, 3, 97, 79, 16, 0, 3, 37, 50, 0, 12, 36, 0, 32, 56, 19, 38, 87, 0, 72, 83,
        8, 69, 81, 68, 48, 4, 16, 0, 12, 0, 54, 127, 127, 0, 0, 0, 94, 0, 119, 127, 127, 127, 35, 20, 0, 0, 0, 0, 23, 0,
        24, 3, 56, 27, 3, 28, 127, 127, 31, 34, 7, 127, 127, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 247,
      ],
    },
  ];

  for (const patchData of patches) {
    // Use real SysEx data from Monologue hardware dumps
    const sysExBuffer = Buffer.from(patchData.rawData);

    // Calculate hash for the SysEx data
    const sysexHash = createHash("sha256").update(sysExBuffer).digest("hex");

    // Create patch data without rawData field (not stored in database)
    const { rawData, ...dbPatchData } = patchData;

    await prisma.patch.create({
      data: {
        ...dbPatchData,
        authorId: user.id,
        sysexData: sysExBuffer,
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
