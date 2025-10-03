"use client";

import { useState } from "react";
import { savePatch } from "@/lib/utils/patch-saving";
import { MonologueEditor } from "@/components/MonologueEditor";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { defaultMonologueParameters } from "@/lib/defaults/monologue-defaults";
import { encodeMonologueParameters } from "@/lib/sysex/encoder";

export default function HomePage() {
  const [currentParameters, setCurrentParameters] = useState<MonologueParameters>(defaultMonologueParameters);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      // Encode current parameters to SysEx
      const sysexData = encodeMonologueParameters(currentParameters);
      const result = await savePatch({
        sysex: new Uint8Array(sysexData),
        name: currentParameters.patchName,
      });
      setSaveMessage(result.success ? `Saved patch id ${result.data.id}` : `Save failed`);
    } catch (e: any) {
      setSaveMessage(e.message || "Error saving patch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monologue Editor</h1>
          <p className="text-gray-600">Complete parameter control for Korg Monologue</p>
        </div>

        <MonologueEditor parameters={currentParameters} onParametersChange={setCurrentParameters} className="mb-8" />

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1 mb-4">
            <li>1. Adjust any parameter using the knobs and controls above</li>
            <li>2. Parameters are organized by section: VCO, Filter, Envelope, LFO, etc.</li>
            <li>3. All values are automatically synchronized</li>
            <li>4. Click Save to store the current patch</li>
          </ol>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Patch"}
            </button>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("Saved") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
