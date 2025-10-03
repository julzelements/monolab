"use client";

import { useState } from "react";
import { savePatch } from "@/lib/utils/patch-saving";
import { MonologueEditor } from "@/components/MonologueEditor";
import { HardwareDumpHandler } from "@/components/HardwareDumpHandler";
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

  function handleHardwarePatchReceived(parameters: MonologueParameters) {
    console.log("🎹 Hardware patch received on main page:", parameters.patchName);
    setCurrentParameters(parameters);
    setSaveMessage(null); // Clear any previous save messages
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monologue Editor</h1>
          <p className="text-gray-600">Complete parameter control for Korg Monologue</p>
        </div>

        <MonologueEditor parameters={currentParameters} onParametersChange={setCurrentParameters} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Save Controls */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-2">💾 Save Patch</h3>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>• Adjust parameters using the controls above</p>
              <p>• All changes are automatically synchronized with hardware</p>
              <p>• Save your patch to the database for later recall</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save to Database"}
              </button>
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes("Saved") ? "text-green-600" : "text-red-600"}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>

          {/* Hardware Sync */}
          <HardwareDumpHandler onPatchReceived={handleHardwarePatchReceived} />
        </div>
      </div>
    </div>
  );
}
