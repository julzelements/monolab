"use client";

import { useState } from "react";
import { VCFControls } from "@/components/VCFControls";
import { MVPPatch } from "@/types/mvp";

export default function HomePage() {
  const [currentPatch, setCurrentPatch] = useState<MVPPatch>({
    name: "Init Patch",
    cutoff: 127,
    resonance: 0,
  });

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
        </div>
      </div>
    </div>
  );
}
