// Client helper to save a patch SysEx dump to backend
// Accepts raw Uint8Array or number[] and minimal metadata

export interface SavePatchOptions {
  sysex: Uint8Array | number[];
  name?: string;
  isPublic?: boolean;
  description?: string;
  tags?: string[];
}

export async function savePatch(options: SavePatchOptions) {
  const { sysex, ...meta } = options;
  const payload = {
    sysex: Array.from(sysex),
    ...meta,
  };
  const res = await fetch("/api/patches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save patch");
  }
  return res.json();
}
