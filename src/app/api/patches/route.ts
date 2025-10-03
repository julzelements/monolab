import { NextRequest, NextResponse } from "next/server";
import { PatchService } from "@/lib/services/patch-service";

// Simple POST /api/patches expecting JSON: { sysex: number[] | base64 string, name?, isPublic?, description?, tags? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let sysex: Uint8Array;

    if (Array.isArray(body.sysex)) {
      sysex = new Uint8Array(body.sysex);
    } else if (typeof body.sysex === "string") {
      // assume base64
      sysex = new Uint8Array(Buffer.from(body.sysex, "base64"));
    } else {
      return NextResponse.json({ success: false, error: "Invalid sysex format" }, { status: 400 });
    }

    const result = await PatchService.createFromSysEx({
      sysex,
      name: body.name,
      isPublic: body.isPublic,
      description: body.description,
      tags: body.tags,
      // TODO: derive authorId from auth session when available
    });

    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
