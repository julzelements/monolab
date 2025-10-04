"use client";

import { useState, useEffect, useRef } from "react";
import { MonologueParameters } from "@/lib/sysex/decoder";
import { ParamState } from "@/types/paramState";
import { Parameters } from "@/types/ParameterHash";
import { SimpleMIDIManager } from "@/utils/simple-midi";
import Panel from "@/components/Panel";
import {
  monologueParametersToParamState,
  paramStateToMonologueParameters,
  createSetParamViaCallback,
} from "@/lib/utils/parameter-adapters";

interface PanelWithMIDIProps {
  parameters: MonologueParameters;
  onParametersChange: (parameters: MonologueParameters) => void;
  className?: string;
}

export function PanelWithMIDI({ parameters, onParametersChange, className = "" }: PanelWithMIDIProps) {
  const [midiManager] = useState(() => SimpleMIDIManager.getInstance());
  const [isMidiInitialized, setIsMidiInitialized] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [paramState, setParamState] = useState<ParamState>(() => monologueParametersToParamState(parameters));

  // Use refs to avoid dependency issues and prevent infinite loops
  const parametersRef = useRef(parameters);
  const onParametersChangeRef = useRef(onParametersChange);
  const isUpdatingFromMidiRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    parametersRef.current = parameters;
    onParametersChangeRef.current = onParametersChange;
  }, [parameters, onParametersChange]);

  // Update paramState when parameters change from external sources (like hardware dumps)
  useEffect(() => {
    if (!isUpdatingFromMidiRef.current) {
      setParamState(monologueParametersToParamState(parameters));
    }
  }, [parameters]);

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
      console.log(`🎛️ MIDI parameter change received: ${parameter} = ${value}`);

      // Find which parameter this corresponds to in our ParamState
      const parameterEntry = Object.entries(Parameters).find(([, param]) => param.name === parameter);
      if (!parameterEntry) {
        if (debugMode) console.log(`⚠️ Unknown parameter: ${parameter}`);
        return;
      }

      const [, paramObj] = parameterEntry;
      const paramName = paramObj.name as keyof ParamState;

      if (!paramState[paramName]) {
        if (debugMode) console.log(`⚠️ Parameter not found in state: ${paramName}`);
        return;
      }

      // Update paramState
      setParamState((prev) => {
        const updated = {
          ...prev,
          [paramName]: {
            ...prev[paramName],
            value: value,
          },
        };

        // Convert to MonologueParameters and trigger change
        const updatedMonologueParams = paramStateToMonologueParameters(updated, parametersRef.current);

        // Mark that we're updating from MIDI to prevent loops
        isUpdatingFromMidiRef.current = true;
        onParametersChangeRef.current(updatedMonologueParams);

        // Reset the flag after a brief delay
        setTimeout(() => {
          isUpdatingFromMidiRef.current = false;
        }, 50);

        return updated;
      });
    };

    midiManager.on("monologueParameterChange", handleMidiParameterChange);

    return () => {
      midiManager.off("monologueParameterChange", handleMidiParameterChange);
    };
  }, [midiManager, isMidiInitialized, paramState, debugMode]);

  // Create the callback function for Panel.tsx
  const setParamViaCallback = createSetParamViaCallback(
    paramState,
    (newParamState: ParamState) => {
      setParamState(newParamState);

      // Send MIDI CC when parameter changes from UI
      Object.entries(newParamState).forEach(async ([paramName, paramStateMap]) => {
        const prevValue = paramState[paramName as keyof ParamState]?.value;
        if (prevValue !== paramStateMap.value && isMidiInitialized) {
          if (debugMode) {
            console.log(`🎛️ Sending MIDI for parameter: ${paramName} = ${paramStateMap.value}`);
          }
          try {
            await midiManager.sendMonologueParameterChange(paramName, paramStateMap.value);
          } catch (error) {
            console.error(`Failed to send MIDI for ${paramName}:`, error);
          }
        }
      });
    },
    onParametersChange,
    parameters
  );

  return (
    <div className={className}>
      {/* Debug toggle */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="rounded"
          />
          <span>Debug MIDI</span>
        </label>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isMidiInitialized ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          MIDI: {isMidiInitialized ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="monologue-container">
        <div className="section-wrapper">
          <div className="panel">
            <Panel setParamViaCallback={setParamViaCallback} paramState={paramState} Parameters={Parameters} />
          </div>
        </div>
      </div>
    </div>
  );
}
