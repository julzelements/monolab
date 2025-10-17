import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { patches } from "./seed/patches";

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

  // Use pre-generated static patches (generated via 'npm run db:seed-generate')
  console.log(`📦 Loading ${patches.length} pre-generated patches...`);

  // Create patches from the static data
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
