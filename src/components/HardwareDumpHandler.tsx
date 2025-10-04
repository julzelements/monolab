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
    <div className={`hardware-dump-handler ${className}`}>
      <div className="hardware-dump-header">
        <h3>🎛️ Hardware Sync</h3>
        <div className="hardware-dump-status">
          <div className={`status-dot ${isConnected ? "connected" : "disconnected"}`}></div>
          <span>{isConnected ? "Monologue Connected" : "Not Connected"}</span>
        </div>
      </div>

      <div>
        {/* Main Action Button */}
        <button
          onClick={requestDumpFromHardware}
          disabled={isWaitingForDump || !isConnected}
          className={`hardware-dump-button ${isWaitingForDump || !isConnected ? "disabled" : "enabled"}`}
        >
          {isWaitingForDump ? (
            <span className="hardware-dump-loading">
              <div className="spinner"></div>
              Waiting for Hardware...
            </span>
          ) : (
            "📥 Get Current Patch from Hardware"
          )}
        </button>

        {/* Instructions */}
        {isWaitingForDump && (
          <div className="info-box blue">
            <p>📋 How to send patch from Monologue:</p>
            <ol>
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
          <div className="info-box red">
            <div>
              <p className="error-title">❌ Error</p>
              <p>{error}</p>
            </div>
            <button onClick={clearStatus}>✕</button>
          </div>
        )}

        {lastDumpTime && !error && (
          <div className="info-box green">
            <div>
              <p className="success-title">✅ Patch Received</p>
              <p>
                <strong>"{lastPatchName}"</strong> loaded at {lastDumpTime.toLocaleTimeString()}
              </p>
            </div>
            <button onClick={clearStatus}>✕</button>
          </div>
        )}

        {/* Help Text */}
        {!isConnected && (
          <div className="info-box yellow">
            <p>⚠️ MIDI Setup Required</p>
            <p>Connect your Korg Monologue via USB or MIDI interface and refresh the page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
