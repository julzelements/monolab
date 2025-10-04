"use client";

import { useState, useEffect } from "react";
import { SimpleMIDIDevice, DeviceSelection } from "@/types/mvp";
import { SimpleMIDIManager } from "@/utils/simple-midi";

export function Navigation() {
  const [deviceSelection, setDeviceSelection] = useState<DeviceSelection>({
    selectedInputId: null,
    selectedOutputId: null,
    availableInputs: [],
    availableOutputs: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoSelectionStatus, setAutoSelectionStatus] = useState<string | null>(null);

  const midiManager = SimpleMIDIManager.getInstance();

  useEffect(() => {
    const initializeMIDI = async () => {
      const success = await midiManager.initialize();
      if (success) {
        setIsInitialized(true);
        updateDeviceList();
      }
    };

    const updateDeviceList = () => {
      const devices = midiManager.getAllDevices();
      setDeviceSelection(devices);
    };

    const handleDeviceChange = () => {
      updateDeviceList();
    };

    const handleSelectionChange = (devices: DeviceSelection) => {
      const previousSelection = deviceSelection;
      setDeviceSelection(devices);

      // Show auto-selection status
      if (devices.selectedInputId && !previousSelection.selectedInputId) {
        const inputDevice = devices.availableInputs.find((d) => d.id === devices.selectedInputId);
        if (inputDevice) {
          setAutoSelectionStatus(`Auto-selected input: ${inputDevice.name}`);
          setTimeout(() => setAutoSelectionStatus(null), 3000);
        }
      }

      if (devices.selectedOutputId && !previousSelection.selectedOutputId) {
        const outputDevice = devices.availableOutputs.find((d) => d.id === devices.selectedOutputId);
        if (outputDevice) {
          setAutoSelectionStatus(`Auto-selected output: ${outputDevice.name}`);
          setTimeout(() => setAutoSelectionStatus(null), 3000);
        }
      }
    };

    // Initialize MIDI once
    initializeMIDI();

    // Listen for device changes
    midiManager.on("deviceChange", handleDeviceChange);
    midiManager.on("deviceSelectionChanged", handleSelectionChange);

    return () => {
      midiManager.off("deviceChange", handleDeviceChange);
      midiManager.off("deviceSelectionChanged", handleSelectionChange);
    };
  }, []); // Run once on mount

  const handleInputSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value || null;
    midiManager.selectMIDIInput(deviceId);
  };

  const handleOutputSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value || null;
    midiManager.selectMIDIOutput(deviceId);
  };

  const refreshDevices = async () => {
    await midiManager.initialize();
    const devices = midiManager.getAllDevices();
    setDeviceSelection(devices);
  };

  return (
    <nav>
      <div className="nav-container">
        {/* Logo/Title */}
        <div className="nav-logo">
          <h1>Monolab</h1>
          <span>MVP</span>
        </div>

        {/* MIDI Device Selection */}
        <div className="nav-controls">
          {/* MIDI Input Selection */}
          <div className="nav-control-group">
            <label htmlFor="midi-input">MIDI Input:</label>
            <select
              id="midi-input"
              value={deviceSelection.selectedInputId || ""}
              onChange={handleInputSelection}
              disabled={!isInitialized}
            >
              <option value="">No Input</option>
              {deviceSelection.availableInputs.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} {!device.isConnected && "(disconnected)"}
                </option>
              ))}
            </select>
          </div>

          {/* MIDI Output Selection */}
          <div className="nav-control-group">
            <label htmlFor="midi-output">MIDI Output:</label>
            <select
              id="midi-output"
              value={deviceSelection.selectedOutputId || ""}
              onChange={handleOutputSelection}
              disabled={!isInitialized}
            >
              <option value="">No Output</option>
              {deviceSelection.availableOutputs.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} {!device.isConnected && "(disconnected)"}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button onClick={refreshDevices} title="Refresh MIDI devices">
            🔄
          </button>

          {/* MIDI Status Indicator */}
          <div className="nav-control-group">
            <div
              className={`status-indicator ${isInitialized ? "status-green" : "status-red"}`}
              title={isInitialized ? "MIDI Initialized" : "MIDI Not Available"}
            />
            <span className="status-text">{isInitialized ? "MIDI Ready" : "MIDI Init..."}</span>
          </div>
        </div>
      </div>

      {/* Device Count Info & Auto-selection Status */}
      {isInitialized && (
        <div className="nav-info">
          <div>{autoSelectionStatus && <div className="auto-selection-status">✓ {autoSelectionStatus}</div>}</div>
          <div className="status-text">
            {deviceSelection.availableInputs.length} input(s), {deviceSelection.availableOutputs.length} output(s)
            available
          </div>
        </div>
      )}
    </nav>
  );
}
