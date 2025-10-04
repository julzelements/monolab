"use client";

import { useState, useEffect, useRef } from "react";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { SimpleMIDIManager } from "@/utils/simple-midi";
import Panel from "@/components/Panel";
import { setParameterValue, getParameterValue } from "@/lib/utils/parameter-adapters";

interface PanelWithMIDIProps {
  parameters: MonologueParameters;
  onParametersChange: (parameters: MonologueParameters) => void;
  className?: string;
}

export function PanelWithMIDI({ parameters, onParametersChange, className = "" }: PanelWithMIDIProps) {
  const [midiManager] = useState(() => SimpleMIDIManager.getInstance());
  const [isMidiInitialized, setIsMidiInitialized] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Use refs to avoid dependency issues and prevent infinite loops
  const parametersRef = useRef(parameters);
  const onParametersChangeRef = useRef(onParametersChange);
  const isUpdatingFromMidiRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    parametersRef.current = parameters;
    onParametersChangeRef.current = onParametersChange;
  }, [parameters, onParametersChange]);

  // Initialize MIDI
  useEffect(() => {
    const initMidi = async () => {
      try {
        if (!isMidiInitialized) {
          console.log("🎹 Initializing MIDI...");
          await midiManager.initialize();
          setIsMidiInitialized(true);
          console.log("✅ MIDI initialized successfully");
        }
      } catch (error) {
        console.error("❌ MIDI initialization failed:", error);
      }
    };

    initMidi();
  }, [midiManager, isMidiInitialized]);

  // Set up MIDI CC listener
  useEffect(() => {
    if (!isMidiInitialized) return;

    const handleMidiParameterChange = (event: any) => {
      if (isUpdatingFromMidiRef.current) return;

      const { parameter, value } = event;
      if (debugMode) {
        console.log(`🎛️ MIDI parameter change received: ${parameter} = ${value}`);
      }

      // Update the parameter directly using the hierarchical path
      const updatedParameters = setParameterValue(parametersRef.current, parameter, value);

      // Mark that we're updating from MIDI to prevent loops
      isUpdatingFromMidiRef.current = true;
      onParametersChangeRef.current(updatedParameters);

      // Reset the flag after a brief delay
      setTimeout(() => {
        isUpdatingFromMidiRef.current = false;
      }, 50);
    };

    midiManager.on("monologueParameterChange", handleMidiParameterChange);

    return () => {
      midiManager.off("monologueParameterChange", handleMidiParameterChange);
    };
  }, [midiManager, isMidiInitialized, debugMode]);

  // Handle parameter changes from the UI
  const handleParameterChange = async (path: string, value: number) => {
    // Update parameters
    const updatedParameters = setParameterValue(parameters, path, value);
    onParametersChange(updatedParameters);

    // Send MIDI CC when parameter changes from UI
    if (isMidiInitialized && !isUpdatingFromMidiRef.current) {
      if (debugMode) {
        console.log(`🎛️ Sending MIDI for parameter: ${path} = ${value}`);
      }
      try {
        await midiManager.sendMonologueParameterChange(path, value);
      } catch (error) {
        console.error(`Failed to send MIDI for ${path}:`, error);
      }
    }
  };

  return (
    <div className={className}>
      {/* Debug toggle */}
      <div className="panel-controls-header">
        <label className="debug-toggle">
          <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />
          <span>Debug MIDI</span>
        </label>
        <span className={`midi-status-badge ${isMidiInitialized ? "connected" : "disconnected"}`}>
          MIDI: {isMidiInitialized ? "Connected" : "Disconnected"}
        </span>
      </div>

      <Panel parameters={parameters} onParameterChange={handleParameterChange} />
    </div>
  );
}
