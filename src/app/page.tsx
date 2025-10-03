"use client";

import { useState } from "react";
import { savePatch } from "@/lib/utils/patch-saving";
import { MonologueEditor } from "@/components/MonologueEditor";
import { HardwareDumpHandler } from "@/components/HardwareDumpHandler";
import { PatchBrowser } from "@/components/PatchBrowser";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { defaultMonologueParameters } from "@/lib/defaults/monologue-defaults";
import { encodeMonologueParameters } from "@/lib/sysex/encoder";

export default function HomePage() {
  const [currentParameters, setCurrentParameters] = useState<MonologueParameters>(defaultMonologueParameters);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [patchName, setPatchName] = useState<string>(defaultMonologueParameters.patchName);

  // Update patch name in parameters when it changes
  function handlePatchNameChange(newName: string) {
    // Limit to 12 characters
    const limitedName = newName.slice(0, 12);
    setPatchName(limitedName);

    // Update the parameters object
    const updatedParameters = { ...currentParameters, patchName: limitedName };
    setCurrentParameters(updatedParameters);
  }

  async function handleSave() {
    console.log("🔄 Starting save process...", { patchName, saving });

    if (saving) {
      console.log("⚠️ Save already in progress, ignoring");
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      console.log("📤 Encoding parameters...", currentParameters.patchName);
      // Encode current parameters to SysEx
      const sysexData = encodeMonologueParameters(currentParameters);

      console.log("💾 Calling savePatch...");
      const result = await savePatch({
        sysex: new Uint8Array(sysexData),
        name: currentParameters.patchName,
      });

      console.log("✅ Save result:", result);
      const message = result.success
        ? `✅ Saved patch "${currentParameters.patchName}" (id ${result.data.id})`
        : `❌ Save failed`;
      setSaveMessage(message);

      // Clear message after 5 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } catch (e: any) {
      console.error("❌ Save error:", e);
      setSaveMessage(`❌ Error: ${e.message || "Unknown error"}`);

      // Clear error message after 7 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 7000);
    } finally {
      setSaving(false);
      console.log("🔄 Save process complete");
    }
  }

  function handleHardwarePatchReceived(parameters: MonologueParameters) {
    console.log("🎹 Hardware patch received on main page:", parameters.patchName);
    setCurrentParameters(parameters);
    setPatchName(parameters.patchName); // Update patch name state
    setSaveMessage(null); // Clear any previous save messages
  }

  function handlePatchLoad(parameters: MonologueParameters) {
    console.log("📦 Patch loaded from database:", parameters.patchName);
    setCurrentParameters(parameters);
    setPatchName(parameters.patchName); // Update patch name state
    setSaveMessage(null); // Clear any previous save messages
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      {/* Background Reference Image */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/monologue-panel-layout.png"
          alt="Monologue Panel Reference"
          className="max-w-full max-h-full object-contain opacity-25"
          style={{ maxWidth: "80vw", maxHeight: "80vh" }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Monologue Editor</h1>
          <p className="text-gray-600">Complete parameter control for Korg Monologue</p>
        </div>

        <MonologueEditor parameters={currentParameters} onParametersChange={setCurrentParameters} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Save Controls */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-2">💾 Save Patch</h3>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>• Adjust parameters using the controls above</p>
              <p>• All changes are automatically synchronized with hardware</p>
              <p>• Save your patch to the database for later recall</p>
            </div>

            {/* Patch Name Input */}
            <div className="mb-4">
              <label htmlFor="patchName" className="block text-sm font-medium text-gray-700 mb-1">
                Patch Name (max 12 characters)
              </label>
              <input
                id="patchName"
                type="text"
                value={patchName}
                onChange={(e) => handlePatchNameChange(e.target.value)}
                maxLength={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patch name"
              />
              <div className="text-xs text-gray-500 mt-1">{patchName.length}/12 characters</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                {saving && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <span>{saving ? "Saving..." : "Save to Database"}</span>
              </button>

              {/* Save Status Message */}
              <div className="min-h-[20px]">
                {saveMessage && (
                  <div
                    className={`text-sm p-2 rounded-md border ${
                      saveMessage.includes("Saved")
                        ? "text-green-700 bg-green-50 border-green-200"
                        : "text-red-700 bg-red-50 border-red-200"
                    }`}
                  >
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Load Patches */}
          <PatchBrowser onPatchLoad={handlePatchLoad} />

          {/* Hardware Sync */}
          <HardwareDumpHandler onPatchReceived={handleHardwarePatchReceived} />
        </div>
      </div>
    </div>
  );
}
