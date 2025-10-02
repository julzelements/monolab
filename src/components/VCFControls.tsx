"use client";

import { useState, useEffect, useRef } from "react";
import { MVPPatch, ParameterChangeEvent } from "@/types/mvp";
import { SimpleMIDIManager } from "@/utils/simple-midi";
import { Knob } from "./ui/knob";

interface VCFControlsProps {
  patch: MVPPatch;
  onPatchChange: (patch: MVPPatch) => void;
}

export function VCFControls({ patch, onPatchChange }: VCFControlsProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [includeRealTime, setIncludeRealTime] = useState(false);
  const midiManager = SimpleMIDIManager.getInstance();

  // Use refs to avoid stale closures in event handlers
  const patchRef = useRef(patch);
  const onPatchChangeRef = useRef(onPatchChange);

  // Update refs when props change
  patchRef.current = patch;
  onPatchChangeRef.current = onPatchChange;

  useEffect(() => {
    // Initialize MIDI
    midiManager.initialize().then((success) => {
      if (success) {
        setIsConnected(midiManager.isMonologueConnected());
      }
    });

    // Listen for parameter changes from hardware
    const handleParameterChange = (event: ParameterChangeEvent) => {
      if (event.source === "hardware") {
        const updatedPatch = {
          ...patchRef.current,
          [event.parameter]: event.value,
        };
        onPatchChangeRef.current(updatedPatch);
      }
    };

    // Listen for device connections
    const handleDeviceChange = () => {
      setIsConnected(midiManager.isMonologueConnected());
    };

    midiManager.on("parameterChange", handleParameterChange);
    midiManager.on("deviceChange", handleDeviceChange);
    midiManager.on("monologueConnected", handleDeviceChange);

    return () => {
      midiManager.off("parameterChange", handleParameterChange);
      midiManager.off("deviceChange", handleDeviceChange);
      midiManager.off("monologueConnected", handleDeviceChange);
    };
  }, []); // Remove dependencies that cause re-renders

  const handleCutoffChange = (value: number) => {
    const updatedPatch = { ...patch, cutoff: value };
    onPatchChange(updatedPatch);

    // Send to hardware
    midiManager.sendParameterChange("cutoff", value);
  };

  const handleResonanceChange = (value: number) => {
    const updatedPatch = { ...patch, resonance: value };
    onPatchChange(updatedPatch);

    // Send to hardware
    midiManager.sendParameterChange("resonance", value);
  };

  const toggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);
    midiManager.setDebugMode(newDebugMode, includeRealTime);
  };

  const toggleRealTimeMessages = () => {
    const newIncludeRealTime = !includeRealTime;
    setIncludeRealTime(newIncludeRealTime);
    if (debugMode) {
      midiManager.setDebugMode(debugMode, newIncludeRealTime);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">VCF Controls</h2>
        <div className="flex items-center space-x-4">
          {/* Debug Mode Toggle */}
          <div className="flex items-center space-x-2">
            <label htmlFor="debug-toggle" className="text-sm font-medium">
              Debug Mode
            </label>
            <input
              id="debug-toggle"
              type="checkbox"
              checked={debugMode}
              onChange={toggleDebugMode}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Real-time Messages Toggle (only show when debug is enabled) */}
          {debugMode && (
            <div className="flex items-center space-x-2">
              <label htmlFor="realtime-toggle" className="text-sm font-medium text-gray-600">
                Include Clock
              </label>
              <input
                id="realtime-toggle"
                type="checkbox"
                checked={includeRealTime}
                onChange={toggleRealTimeMessages}
                className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500"
                title="Include MIDI Clock and Active Sensing messages in debug output"
              />
            </div>
          )}
        </div>
      </div>

      {/* Debug Mode Info */}
      {debugMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🐛</span>
            <h3 className="font-medium text-yellow-800">Debug Mode Active</h3>
          </div>
          <p className="text-sm text-yellow-700">
            All MIDI messages are being logged to the browser console. Open Developer Tools (F12) and check the Console
            tab to see detailed MIDI communication.
            {!includeRealTime && (
              <span className="block mt-1 text-xs">
                Real-time messages (Clock, Active Sensing) are filtered for cleaner output. Enable "Include Clock" to
                see all messages.
              </span>
            )}
          </p>
          <div className="mt-2 text-xs text-yellow-600">
            <strong>Tip:</strong> Move knobs on your Monologue or use the sliders below to see MIDI messages in
            real-time.
          </div>
        </div>
      )}

      <div className="flex justify-center items-center space-x-12">
        {/* Cutoff Control */}
        <Knob
          value={patch.cutoff}
          min={0}
          max={127}
          onChange={handleCutoffChange}
          label="Cutoff"
          size={100}
          className="flex-shrink-0"
        />

        {/* Resonance Control */}
        <Knob
          value={patch.resonance}
          min={0}
          max={127}
          onChange={handleResonanceChange}
          label="Resonance"
          size={100}
          className="flex-shrink-0"
        />
      </div>

      {/* Patch Info */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Current Patch</h3>
        <p className="text-muted-foreground">{patch.name}</p>
      </div>

      {/* SysEx Test */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">SysEx Analysis</h3>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => {
              console.log("🔍 SysEx analysis mode active - any SysEx will be captured and analyzed");
              midiManager.requestSysExDump();
            }}
            disabled={!isConnected}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            Analyze Any SysEx
          </button>
          <button
            onClick={() => {
              midiManager.exportSysExDump();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Export Captured Data
          </button>
        </div>
        {!isConnected && <p className="text-sm text-gray-500 mt-2">Connect a Monologue to analyze SysEx messages</p>}
        <p className="text-xs text-gray-600 mt-2">
          Will capture and analyze ANY SysEx message from the Monologue to understand the format.
        </p>
      </div>
    </div>
  );
}
