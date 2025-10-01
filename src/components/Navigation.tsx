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

    // Initialize MIDI if not already done
    if (!isInitialized) {
      initializeMIDI();
    } else {
      updateDeviceList();
    }

    // Listen for device changes
    midiManager.on("deviceChange", handleDeviceChange);
    midiManager.on("deviceSelectionChanged", handleSelectionChange);

    return () => {
      midiManager.off("deviceChange", handleDeviceChange);
      midiManager.off("deviceSelectionChanged", handleSelectionChange);
    };
  }, [midiManager, isInitialized]);

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
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-blue-600">Monolab</h1>
          <span className="text-sm text-gray-500">MVP</span>
        </div>

        {/* MIDI Device Selection */}
        <div className="flex items-center space-x-6">
          {/* MIDI Input Selection */}
          <div className="flex items-center space-x-2">
            <label htmlFor="midi-input" className="text-sm font-medium text-gray-700">
              MIDI Input:
            </label>
            <select
              id="midi-input"
              value={deviceSelection.selectedInputId || ""}
              onChange={handleInputSelection}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="flex items-center space-x-2">
            <label htmlFor="midi-output" className="text-sm font-medium text-gray-700">
              MIDI Output:
            </label>
            <select
              id="midi-output"
              value={deviceSelection.selectedOutputId || ""}
              onChange={handleOutputSelection}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <button
            onClick={refreshDevices}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
            title="Refresh MIDI devices"
          >
            🔄
          </button>

          {/* MIDI Status Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isInitialized ? "bg-green-500" : "bg-red-500"}`}
              title={isInitialized ? "MIDI Initialized" : "MIDI Not Available"}
            />
            <span className="text-xs text-gray-500">{isInitialized ? "MIDI Ready" : "MIDI Init..."}</span>
          </div>
        </div>
      </div>

      {/* Device Count Info & Auto-selection Status */}
      {isInitialized && (
        <div className="max-w-7xl mx-auto mt-2 flex justify-between items-center">
          <div>
            {autoSelectionStatus && (
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                ✓ {autoSelectionStatus}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {deviceSelection.availableInputs.length} input(s), {deviceSelection.availableOutputs.length} output(s)
            available
          </div>
        </div>
      )}
    </nav>
  );
}
