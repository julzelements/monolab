// MVP Simplified types - focusing on VCF cutoff and resonance only

export interface MVPPatch {
  id?: string;
  name: string;
  cutoff: number; // 0-127
  resonance: number; // 0-127
  createdAt?: Date;
  updatedAt?: Date;
}

// MIDI Control Change numbers for Monologue VCF
export const VCF_CC = {
  CUTOFF: 43, // Actual CC from Monologue hardware
  RESONANCE: 44, // Actual CC from Monologue hardware
} as const;

// Simplified MIDI device interface
export interface SimpleMIDIDevice {
  id: string;
  name: string;
  isConnected: boolean;
  type: "input" | "output" | "both";
}

// Device selection state
export interface DeviceSelection {
  selectedInputId: string | null;
  selectedOutputId: string | null;
  availableInputs: SimpleMIDIDevice[];
  availableOutputs: SimpleMIDIDevice[];
}

// Parameter change event
export interface ParameterChangeEvent {
  parameter: "cutoff" | "resonance";
  value: number;
  source: "ui" | "hardware";
}

// App state for MVP
export interface MVPAppState {
  currentPatch: MVPPatch;
  connectedDevice: SimpleMIDIDevice | null;
  isReceivingMIDI: boolean;
  patches: MVPPatch[];
  debugMode: boolean;
  deviceSelection: DeviceSelection;
}
