/**
 * MIDI Debug Page
 *
 * Safe testing environment for MIDI CC integration with debugging tools
 */

"use client";

import { useState } from "react";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { MonologueEditor } from "@/components/MonologueEditor";
import { MidiDebugPanel } from "@/components/MidiDebugPanel";
import { defaultMonologueParameters } from "@/lib/defaults/monologue-defaults";

export default function MidiDebugPage() {
  const [parameters, setParameters] = useState<MonologueParameters>(defaultMonologueParameters);
  const [debugEnabled, setDebugEnabled] = useState(true);

  const handleParametersChange = (newParameters: MonologueParameters) => {
    setParameters(newParameters);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🐛 MIDI Debug & Test Environment</h1>

        {/* Safety Controls */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-3">⚠️ Safety Controls</h2>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={debugEnabled}
                onChange={(e) => setDebugEnabled(e.target.checked)}
                className="mr-2"
              />
              Enable Debug Monitoring
            </label>
          </div>
          <p className="text-sm text-red-600 mt-2">Debug monitoring shows MIDI message flow and memory usage.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎛️ Monologue Editor</h2>
            <MonologueEditor
              parameters={parameters}
              onParametersChange={handleParametersChange}
              className="max-w-none"
            />
          </div>

          {/* Debug Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <MidiDebugPanel enabled={debugEnabled} maxMessages={50} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">🧪 Testing Instructions</h2>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>To test safely:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Keep "Rate Limit MIDI" enabled initially</li>
              <li>Open Chrome DevTools (F12) to monitor console</li>
              <li>Turn ONE knob slowly and watch for any rapid message loops</li>
              <li>Monitor memory usage in the debug panel</li>
              <li>If memory keeps growing or you see rapid messages, stop immediately</li>
            </ol>
            <p>
              <strong>Signs of problems:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Memory usage constantly increasing</li>
              <li>Console flooding with rapid MIDI messages</li>
              <li>Browser becoming unresponsive</li>
              <li>Fan spinning up (high CPU usage)</li>
            </ul>
          </div>
        </div>

        {/* Current Parameters (for debugging) */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 Current Parameter State</h2>
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600">View Raw Parameters</summary>
            <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded overflow-auto text-xs">
              {JSON.stringify(parameters, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
