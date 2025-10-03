/**
 * Hardware Dump Handler Component
 *
 * Provides UI for receiving complete patches from Korg Monologue hardware.
 * Handles the flow: User requests dump → Hardware sends SysEx → Update app state
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { SimpleMIDIManager } from "@/utils/simple-midi";
import { MonologueParameters } from "@/lib/sysex/decoder";

interface HardwareDumpHandlerProps {
  onPatchReceived: (parameters: MonologueParameters) => void;
  className?: string;
}

export function HardwareDumpHandler({ onPatchReceived, className = "" }: HardwareDumpHandlerProps) {
  const [midiManager] = useState(() => SimpleMIDIManager.getInstance());
  const [isWaitingForDump, setIsWaitingForDump] = useState(false);
  const [lastDumpTime, setLastDumpTime] = useState<Date | null>(null);
  const [lastPatchName, setLastPatchName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check MIDI connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(midiManager.isMonologueConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, [midiManager]);

  // Handle incoming hardware patch dumps
  useEffect(() => {
    const handleHardwarePatch = (event: any) => {
      try {
        const { parameters, timestamp } = event;

        if (parameters.isValid) {
          console.log("🎹 Hardware patch received:", parameters.patchName);

          // Update app state with the complete patch
          onPatchReceived(parameters);

          // Update UI feedback
          setLastDumpTime(new Date(timestamp));
          setLastPatchName(parameters.patchName);
          setIsWaitingForDump(false);
          setError(null);

          console.log("✅ Hardware patch loaded successfully!");
        } else {
          throw new Error(parameters.error || "Invalid patch data received");
        }
      } catch (err: any) {
        console.error("❌ Failed to handle hardware patch:", err);
        setError(err.message || "Failed to load patch from hardware");
        setIsWaitingForDump(false);
      }
    };

    midiManager.on("hardwarePatchReceived", handleHardwarePatch);

    return () => {
      midiManager.off("hardwarePatchReceived", handleHardwarePatch);
    };
  }, [midiManager, onPatchReceived]);

  const requestDumpFromHardware = useCallback(() => {
    if (!isConnected) {
      setError("No Monologue connected. Please connect your hardware via MIDI.");
      return;
    }

    setIsWaitingForDump(true);
    setError(null);
    console.log("📥 Waiting for hardware dump...");

    // Auto-timeout after 10 seconds
    setTimeout(() => {
      if (isWaitingForDump) {
        setIsWaitingForDump(false);
        setError("Timeout waiting for hardware dump. Please try again.");
      }
    }, 10000);
  }, [isConnected, isWaitingForDump]);

  const clearStatus = () => {
    setError(null);
    setLastDumpTime(null);
    setLastPatchName(null);
    setIsWaitingForDump(false);
  };

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🎛️ Hardware Sync</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? "Monologue Connected" : "Not Connected"}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Action Button */}
        <button
          onClick={requestDumpFromHardware}
          disabled={isWaitingForDump || !isConnected}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            isWaitingForDump || !isConnected
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isWaitingForDump ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Waiting for Hardware...
            </span>
          ) : (
            "📥 Get Current Patch from Hardware"
          )}
        </button>

        {/* Instructions */}
        {isWaitingForDump && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">📋 How to send patch from Monologue:</p>
            <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
              <li>
                Press and hold <strong>WRITE</strong> button
              </li>
              <li>
                While holding, press <strong>PROGRAM/VALUE</strong> knob
              </li>
              <li>Release both buttons</li>
              <li>Your current patch will be sent to this app</li>
            </ol>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
            <div>
              <p className="text-sm text-red-800 font-medium">❌ Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={clearStatus} className="text-red-500 hover:text-red-700 ml-2">
              ✕
            </button>
          </div>
        )}

        {lastDumpTime && !error && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">✅ Patch Received</p>
              <p className="text-sm text-green-700">
                <strong>"{lastPatchName}"</strong> loaded at {lastDumpTime.toLocaleTimeString()}
              </p>
            </div>
            <button onClick={clearStatus} className="text-green-500 hover:text-green-700 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Help Text */}
        {!isConnected && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">⚠️ MIDI Setup Required</p>
            <p className="text-sm text-yellow-700 mt-1">
              Connect your Korg Monologue via USB or MIDI interface and refresh the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
