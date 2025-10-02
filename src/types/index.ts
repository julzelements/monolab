// Core MIDI and SysEx types
export interface MIDIMessage {
  data: Uint8Array;
  timeStamp: number;
}

export interface SysExMessage {
  manufacturer: number[];
  device: number;
  command: number;
  data: Uint8Array;
  checksum?: number;
}

// Korg Monologue specific types
export interface MonologueParameter {
  id: number;
  name: string;
  ccNumber?: number;
  min: number;
  max: number;
  default: number;
  step?: number;
  type: "continuous" | "stepped" | "switch";
  category: "vco" | "vcf" | "vca" | "eg" | "lfo" | "delay" | "sequencer" | "global";
}

export interface MonologuePatch {
  // Basic info
  name: string;
  description?: string;
  tags: string[];

  // VCO (Voltage Controlled Oscillator)
  vco: {
    wave: "saw" | "triangle" | "square" | "pulse";
    octave: -2 | -1 | 0 | 1 | 2;
    pitch: number; // -50 to +50 cents
    pulseWidth?: number; // 0-127 (only for pulse wave)
  };

  // VCF (Voltage Controlled Filter)
  vcf: {
    cutoff: number; // 0-127
    resonance: number; // 0-127
    eg: number; // EG intensity -64 to +63
    type: "lpf" | "hpf"; // Low-pass or High-pass
    drive: number; // 0-127
  };

  // VCA (Voltage Controlled Amplifier)
  vca: {
    level: number; // 0-127
  };

  // EG (Envelope Generator)
  eg: {
    attack: number; // 0-127
    decay: number; // 0-127
    sustain: number; // 0-127
    release: number; // 0-127
  };

  // LFO (Low Frequency Oscillator)
  lfo: {
    wave: "saw" | "triangle" | "square";
    rate: number; // 0-127
    intensity: number; // 0-127
    target: "pitch" | "cutoff" | "pulse_width";
  };

  // Delay
  delay: {
    time: number; // 0-127
    feedback: number; // 0-127
    hiCut: number; // 0-127
  };

  // Sequencer (basic parameters)
  sequencer?: {
    tempo: number; // 56-240 BPM
    swing: number; // 0-75%
    defaultGate: number; // 0-127
    steps: SequencerStep[];
  };

  // Global settings
  global: {
    portamento: number; // 0-127
    voiceMode: "mono" | "legato" | "priority_last" | "priority_low" | "priority_high";
    syncSource: "internal" | "external";
    midiChannel: number; // 1-16
  };
}

export interface SequencerStep {
  note?: number; // MIDI note number
  gate: number; // 0-127 (gate time)
  slide: boolean;
  active: boolean;
  motion?: {
    [parameterId: number]: number; // Parameter automation
  };
}

// Database model types (matching Prisma schema)
export interface PatchData {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isPublic: boolean;
  authorId?: string;
  authorName?: string;
  sysexData: Buffer;
  parameters: MonologuePatch;
  bankId?: string;
  bankSlot?: number;
  downloadCount: number;
  favoriteCount: number;
  shareToken?: string;
  sharedAt?: Date;
}

export interface BankData {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  patches: PatchData[];
}

export interface UserData {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// MIDI device interface
export interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  input?: any; // Will be WebMidi Input when we migrate
  output?: any; // Will be WebMidi Output when we migrate
  isConnected: boolean;
}

export interface DeviceConfigData {
  id: string;
  userId?: string;
  name: string;
  midiInputPort?: string;
  midiOutputPort?: string;
  deviceType: string;
  isDefault: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// UI State types
export interface PatchEditorState {
  currentPatch: MonologuePatch;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  connectedDevice?: MIDIDevice;
  isReceivingChanges: boolean;
}

export interface LibraryState {
  patches: PatchData[];
  banks: BankData[];
  currentBank?: BankData;
  searchQuery: string;
  selectedTags: string[];
  sortBy: "name" | "date" | "author" | "popularity";
  sortOrder: "asc" | "desc";
  isLoading: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Sharing types
export interface SharedPatch {
  token: string;
  patch: MonologuePatch;
  metadata: {
    name: string;
    author?: string;
    createdAt: Date;
  };
}

export interface UrlEncodedPatch {
  v: number; // version
  p: string; // compressed patch data
  m?: string; // metadata
}
