import { NextRequest, NextResponse } from "next/server";
import { PatchService } from "@/lib/services/patch-service";
import { decodeMonologueParameters } from "@/lib/sysex";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patch = await PatchService.getPatch(params.id);
    
    // Decode the sysex data to parameters if needed
    let parameters = patch.parameters;
    if (!parameters && patch.sysexData) {
      const sysexArray = Array.from(patch.sysexData);
      parameters = decodeMonologueParameters(sysexArray) as any;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...patch,
        parameters,
        sysexData: Array.from(patch.sysexData) // Convert buffer to array for JSON
      }
    });
  } catch (e: any) {
    const status = e?.message === "Patch not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: e?.message || "Unknown error" }, { status });
  }
}