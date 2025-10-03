"use client";

import { useState } from "react";
import { savePatch } from "@/lib/utils/patch-saving";
import { VCFControls } from "@/components/VCFControls";
import { MVPPatch } from "@/types/mvp";

export default function HomePage() {
  const [currentPatch, setCurrentPatch] = useState<MVPPatch>({
    name: "Init Patch",
    cutoff: 127,
    resonance: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      // TODO: Replace placeholder with actual captured 520-byte SysEx dump from device
      // For now create a dummy array of correct length filled with zeros so API path is validated
      const dummy = new Uint8Array(520);
      const result = await savePatch({ sysex: dummy, name: currentPatch.name });
      setSaveMessage(result.success ? `Saved patch id ${result.data.id}` : `Save failed`);
    } catch (e: any) {
      setSaveMessage(e.message || "Error saving patch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <VCFControls patch={currentPatch} onPatchChange={setCurrentPatch} />

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Select your Korg Monologue from the MIDI dropdowns above</li>
            <li>2. Enable Debug Mode to see MIDI messages in the console</li>
            <li>3. Move the sliders to control cutoff and resonance</li>
            <li>4. Hardware changes will be reflected in the UI</li>
          </ol>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Patch"}
          </button>
          {saveMessage && <p className="mt-2 text-sm">{saveMessage}</p>}
        </div>
      </div>
    </div>
  );
}
