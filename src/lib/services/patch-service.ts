import crypto from "crypto";
import { prisma } from "../prisma";
import { decodeMonologueParameters, type MonologueParameters } from "../sysex";

export interface CreatePatchInput {
  sysex: Uint8Array | number[]; // raw 520-byte SysEx dump (including F0/F7 already stripped assumed)
  name?: string;
  authorId?: string; // optional user
  authorNameFallback?: string; // if not logged in but want a credit
  isPublic?: boolean;
  description?: string;
  tags?: string[];
}

export interface CreatePatchResult {
  id: string;
  created: boolean; // false if duplicate (existing returned)
}

function hashSysEx(data: Uint8Array | number[]): string {
  const buf = Buffer.from(data);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// Basic validation: expecting 520 bytes (monologue program dump) after outer 0xF0/0xF7 removed
function assertLength(data: Uint8Array | number[]) {
  const len = data.length;
  if (len !== 520) {
    throw new Error(`Unexpected SysEx length ${len}, expected 520-byte program dump`);
  }
}

export class PatchService {
  static async createFromSysEx(input: CreatePatchInput): Promise<CreatePatchResult> {
    const { sysex, name, authorId, authorNameFallback, isPublic = false, description, tags = [] } = input;

    assertLength(sysex);
    const sysexHash = hashSysEx(sysex);

    // Dedup check
    // Using findFirst instead of findUnique until migration with unique index is applied
    const existing = await prisma.patch.findFirst({ where: { sysexHash } as any });
    if (existing) {
      return { id: existing.id, created: false };
    }

    // Decode parameters for querying/UI. If decoding fails, abort save.
    let parameters: MonologueParameters;
    try {
      const arr: number[] = Array.from(sysex instanceof Uint8Array ? sysex : new Uint8Array(sysex));
      parameters = decodeMonologueParameters(arr);
    } catch (e: any) {
      throw new Error(`Failed to decode SysEx: ${e?.message || e}`);
    }

    // Fallback name: derive from patch internal name if present or timestamp
    const fallback = (parameters as any)?.patchName || `Patch ${new Date().toISOString()}`;

    const createData = {
      name: name || fallback,
      description,
      tags,
      authorId,
      authorName: authorId ? undefined : authorNameFallback,
      isPublic,
      sysexData: Buffer.from(sysex),
      sysexHash,
      parameters: parameters as any,
    } as any; // cast pending migration

    const created = await prisma.patch.create({ data: createData });

    return { id: created.id, created: true };
  }

  static async softDelete(id: string, requesterId?: string) {
    // Basic ownership check (only if patch has authorId)
    const patch = await prisma.patch.findUnique({ where: { id } });
    if (!patch) throw new Error("Patch not found");
    if (patch.authorId && requesterId && patch.authorId !== requesterId) {
      throw new Error("Not authorized to delete this patch");
    }
    await prisma.patch.update({ where: { id }, data: { deletedAt: new Date() } as any });
  }

  static async listPatches(limit: number = 50) {
    const patches = await prisma.patch.findMany({
      where: { deletedAt: null } as any,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        authorName: true,
        createdAt: true,
        isPublic: true,
        parameters: true,
      },
    });
    return patches;
  }

  static async getPatch(id: string) {
    const patch = await prisma.patch.findFirst({
      where: { id, deletedAt: null } as any,
    });
    if (!patch) throw new Error("Patch not found");
    return patch;
  }
}
