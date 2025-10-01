// MVP MIDI utilities - simplified for cutoff and resonance only
import { MVPPatch, SimpleMIDIDevice, ParameterChangeEvent, VCF_CC, DeviceSelection } from "@/types/mvp";

export class SimpleMIDIManager {
  private static instance: SimpleMIDIManager;
  private isInitialized = false;
  private midiAccess: any = null;
  private monologueOutput: any = null;
  private monologueInput: any = null;
  private listeners: Map<string, Function[]> = new Map();
  private debugMode = false;
  private logRealTimeMessages = false; // Option to log real-time messages
  private selectedInputId: string | null = null;
  private selectedOutputId: string | null = null;
  private recentOutgoingMessages: Map<string, number> = new Map(); // Track recent outgoing CCs to prevent feedback
  private lastDebugLogTime: Map<string, number> = new Map(); // Throttle debug output

  private constructor() {}

  static getInstance(): SimpleMIDIManager {
    if (!SimpleMIDIManager.instance) {
      SimpleMIDIManager.instance = new SimpleMIDIManager();
    }
    return SimpleMIDIManager.instance;
  }

  setDebugMode(enabled: boolean, includeRealTime: boolean = false) {
    this.debugMode = enabled;
    this.logRealTimeMessages = includeRealTime;
    if (enabled) {
      console.log("🎛️ MIDI Debug Mode ENABLED - All MIDI messages will be logged");
      if (!includeRealTime) {
        console.log("⏱️ Real-time messages (Clock, Active Sensing) are filtered for cleaner output");
      }
    } else {
      console.log("🎛️ MIDI Debug Mode DISABLED");
    }
  }

  getDebugMode(): boolean {
    return this.debugMode;
  }

  private debugLog(category: string, message: string, data?: any) {
    if (!this.debugMode) return;

    // Throttle CC messages to prevent console spam
    if (category === "CONTROL_CHANGE") {
      const logKey = `${category}:${message}`;
      const now = Date.now();
      const lastLogTime = this.lastDebugLogTime.get(logKey) || 0;
      
      // Only log CC messages at most once every 50ms
      if (now - lastLogTime < 50) {
        return;
      }
      this.lastDebugLogTime.set(logKey, now);
    }

    const timestamp = new Date().toLocaleTimeString();
    const emoji = this.getCategoryEmoji(category);

    if (data) {
      console.group(`${emoji} [${timestamp}] ${category}: ${message}`);
      console.log("Data:", data);
      console.groupEnd();
    } else {
      console.log(`${emoji} [${timestamp}] ${category}: ${message}`);
    }
  }

  private getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      MIDI_INIT: "🚀",
      DEVICE_SCAN: "🔍",
      CONNECTION: "🔌",
      INCOMING_MSG: "📥",
      OUTGOING_MSG: "📤",
      CONTROL_CHANGE: "🎛️",
      SYSEX: "💾",
      PROGRAM_CHANGE: "🎵",
      ERROR: "❌",
      WARNING: "⚠️",
    };
    return emojis[category] || "📡";
  }

  async initialize(): Promise<boolean> {
    try {
      this.debugLog("MIDI_INIT", "Initializing Web MIDI API...");

      // Check if Web MIDI API is supported
      if (!navigator.requestMIDIAccess) {
        this.debugLog("ERROR", "Web MIDI API not supported in this browser");
        console.error("Web MIDI API not supported");
        return false;
      }

      this.debugLog("MIDI_INIT", "Requesting MIDI access...");
      this.midiAccess = await navigator.requestMIDIAccess();
      this.isInitialized = true;

      this.debugLog("MIDI_INIT", "MIDI access granted successfully");
      this.debugLog(
        "MIDI_INIT",
        `Found ${this.midiAccess.inputs.size} input(s) and ${this.midiAccess.outputs.size} output(s)`
      );

      this.setupDeviceListeners();
      this.scanForMonologue();
      return true;
    } catch (error) {
      this.debugLog("ERROR", "Failed to initialize MIDI", error);
      console.error("Failed to initialize MIDI:", error);
      return false;
    }
  }

  private setupDeviceListeners() {
    if (!this.midiAccess) return;

    this.midiAccess.addEventListener("statechange", (e: any) => {
      this.debugLog("CONNECTION", `Device state changed: ${e.port.name} (${e.port.state})`);

      // If a new Monologue device is connected, try to auto-select it
      if (e.port.state === "connected") {
        this.handleNewDeviceConnection(e.port);
      }

      this.scanForMonologue();
      this.emit("deviceChange", this.getConnectedDevices());
    });
  }

  private handleNewDeviceConnection(port: any) {
    // Auto-select Monologue input if none is currently selected
    if (port.type === "input" && this.isMonologueInput(port.name) && !this.selectedInputId) {
      this.debugLog("CONNECTION", `Auto-selecting newly connected Monologue input: ${port.name}`);
      this.selectedInputId = port.id;
      this.connectInput(port);
    }

    // Auto-select Monologue output if none is currently selected
    if (port.type === "output" && this.isMonologueOutput(port.name) && !this.selectedOutputId) {
      this.debugLog("CONNECTION", `Auto-selecting newly connected Monologue output: ${port.name}`);
      this.selectedOutputId = port.id;
      this.connectOutput(port);
    }
  }

  private scanForMonologue() {
    if (!this.midiAccess) return;

    this.debugLog("DEVICE_SCAN", "Scanning for connected MIDI devices...");

    const inputDevices: string[] = [];
    const outputDevices: string[] = [];
    let autoSelectedInput = false;
    let autoSelectedOutput = false;

    // Scan inputs
    for (const input of this.midiAccess.inputs.values()) {
      inputDevices.push(`${input.name} (${input.state})`);
      this.debugLog("DEVICE_SCAN", `Found input: ${input.name} (ID: ${input.id}, State: ${input.state})`);

      // Auto-select Monologue KBD/KNOB input if not already selected
      if (this.isMonologueInput(input.name) && !this.selectedInputId && input.state === "connected") {
        this.debugLog("CONNECTION", `Auto-selecting Monologue input: ${input.name}`);
        this.selectedInputId = input.id;
        this.connectInput(input);
        autoSelectedInput = true;
      }
    }

    // Scan outputs
    for (const output of this.midiAccess.outputs.values()) {
      outputDevices.push(`${output.name} (${output.state})`);
      this.debugLog("DEVICE_SCAN", `Found output: ${output.name} (ID: ${output.id}, State: ${output.state})`);

      // Auto-select Monologue SOUND output if not already selected
      if (this.isMonologueOutput(output.name) && !this.selectedOutputId && output.state === "connected") {
        this.debugLog("CONNECTION", `Auto-selecting Monologue output: ${output.name}`);
        this.selectedOutputId = output.id;
        this.connectOutput(output);
        autoSelectedOutput = true;
      }
    }

    this.debugLog("DEVICE_SCAN", `Scan complete. Inputs: [${inputDevices.join(", ")}]`);
    this.debugLog("DEVICE_SCAN", `Scan complete. Outputs: [${outputDevices.join(", ")}]`);

    if (autoSelectedInput || autoSelectedOutput) {
      this.debugLog(
        "CONNECTION",
        `Auto-selection complete - Input: ${autoSelectedInput ? "Selected" : "None"}, Output: ${
          autoSelectedOutput ? "Selected" : "None"
        }`
      );
    }

    // Emit device list update
    this.emit("deviceSelectionChanged", this.getAllDevices());
  }

  private isMonologue(deviceName: string): boolean {
    const name = deviceName.toLowerCase();
    return name.includes("monologue") || name.includes("korg");
  }

  private isMonologueInput(deviceName: string): boolean {
    const name = deviceName.toLowerCase();
    return name.includes("monologue") && (name.includes("kbd") || name.includes("knob"));
  }

  private isMonologueOutput(deviceName: string): boolean {
    const name = deviceName.toLowerCase();
    return name.includes("monologue") && name.includes("sound");
  }

  private connectInput(input: any) {
    this.monologueInput = input;
    this.debugLog("CONNECTION", `Connected to Monologue input: ${input.name}`);

    input.onmidimessage = (message: any) => {
      this.handleMIDIMessage(message);
    };
    this.emit("monologueConnected", this.getMonologueDevice());
  }

  private connectOutput(output: any) {
    this.monologueOutput = output;
    this.debugLog("CONNECTION", `Connected to Monologue output: ${output.name}`);
    this.emit("monologueConnected", this.getMonologueDevice());
  }

  private handleMIDIMessage(message: any) {
    const [status, data1, data2] = message.data;
    const timestamp = message.timeStamp;

    // Filter out noisy real-time messages in debug output
    const isRealTimeMessage = this.isRealTimeMessage(status);

    // Always log raw MIDI data in debug mode (except real-time messages)
    if (!isRealTimeMessage) {
      this.debugLog("INCOMING_MSG", "Raw MIDI message received", {
        data: Array.from(message.data),
        hex: Array.from(message.data)
          .map((b: any) => "0x" + b.toString(16).padStart(2, "0"))
          .join(" "),
        timestamp: timestamp,
        statusByte: "0x" + status.toString(16).padStart(2, "0"),
        channel: (status & 0x0f) + 1,
      });
    }

    // Check for Control Change messages (0xB0-0xBF)
    if ((status & 0xf0) === 0xb0) {
      const channel = (status & 0x0f) + 1;
      const ccNumber = data1;
      const value = data2;

      this.debugLog("CONTROL_CHANGE", `CC${ccNumber} = ${value} (Channel ${channel})`, {
        ccNumber,
        value,
        channel,
        parameterName: this.getCCParameterName(ccNumber),
      });

      let parameter: "cutoff" | "resonance" | null = null;
      if (ccNumber === VCF_CC.CUTOFF) parameter = "cutoff";
      else if (ccNumber === VCF_CC.RESONANCE) parameter = "resonance";

      if (parameter) {
        // Check if this is feedback from our own outgoing message
        const messageKey = `${ccNumber}:${value}`;
        const recentTimestamp = this.recentOutgoingMessages.get(messageKey);
        const now = Date.now();
        
        if (recentTimestamp && (now - recentTimestamp) < 100) {
          // This is likely feedback from our own message, ignore it
          this.debugLog("CONTROL_CHANGE", `Ignoring feedback from recent outgoing CC${ccNumber} = ${value}`);
          this.recentOutgoingMessages.delete(messageKey); // Clean up
          return;
        }

        const event: ParameterChangeEvent = {
          parameter,
          value,
          source: "hardware",
        };
        this.debugLog("CONTROL_CHANGE", `Mapped to ${parameter} parameter`, event);
        this.emit("parameterChange", event);
      } else {
        this.debugLog("CONTROL_CHANGE", `Unmapped CC${ccNumber} (not tracked in MVP)`);
      }
    }
    // Check for Program Change messages (0xC0-0xCF)
    else if ((status & 0xf0) === 0xc0) {
      const channel = (status & 0x0f) + 1;
      const program = data1;

      this.debugLog("PROGRAM_CHANGE", `Program ${program} (Channel ${channel})`, {
        program,
        channel,
      });
    }
    // Check for SysEx messages (0xF0)
    else if (status === 0xf0) {
      this.debugLog("SYSEX", "SysEx message received", {
        length: message.data.length,
        data: Array.from(message.data),
      });
    }
    // Check for real-time messages (but don't spam the console)
    else if (isRealTimeMessage) {
      // Only log real-time messages if specifically enabled and occasionally to avoid spam
      if (this.logRealTimeMessages) {
        this.logRealTimeMessageThrottled(status);
      }
    }
    // Other message types
    else {
      const messageType = this.getMIDIMessageType(status);
      this.debugLog("INCOMING_MSG", `${messageType} message`, {
        status: "0x" + status.toString(16).padStart(2, "0"),
        data1,
        data2,
      });
    }
  }

  private realTimeMessageCounts: Map<number, number> = new Map();
  private lastRealTimeLogTime: Map<number, number> = new Map();

  private logRealTimeMessageThrottled(status: number) {
    const now = Date.now();
    const lastLogTime = this.lastRealTimeLogTime.get(status) || 0;
    const count = this.realTimeMessageCounts.get(status) || 0;

    // Log real-time messages at most once per second, with count
    if (now - lastLogTime > 1000) {
      if (count > 0) {
        this.debugLog("INCOMING_MSG", `${this.getRealTimeMessageName(status)} (${count + 1} messages in last second)`, {
          status: "0x" + status.toString(16).padStart(2, "0"),
          messageCount: count + 1,
          note: "Real-time messages are throttled in debug output",
        });
      }
      this.realTimeMessageCounts.set(status, 0);
      this.lastRealTimeLogTime.set(status, now);
    } else {
      this.realTimeMessageCounts.set(status, count + 1);
    }
  }

  private getCCParameterName(ccNumber: number): string {
    const ccMap: Record<number, string> = {
      [VCF_CC.CUTOFF]: "VCF Cutoff",
      [VCF_CC.RESONANCE]: "VCF Resonance",
      1: "Modulation Wheel",
      7: "Volume",
      10: "Pan",
      64: "Sustain Pedal",
      91: "Reverb",
      93: "Chorus",
    };
    return ccMap[ccNumber] || `Unknown CC${ccNumber}`;
  }

  private getMIDIMessageType(status: number): string {
    const high = status & 0xf0;
    switch (high) {
      case 0x80:
        return "Note Off";
      case 0x90:
        return "Note On";
      case 0xa0:
        return "Aftertouch";
      case 0xb0:
        return "Control Change";
      case 0xc0:
        return "Program Change";
      case 0xd0:
        return "Channel Pressure";
      case 0xe0:
        return "Pitch Bend";
      case 0xf0:
        return "System";
      default:
        return "Unknown";
    }
  }

  private isRealTimeMessage(status: number): boolean {
    // Real-time messages that are often noisy and should be filtered from debug output
    const realTimeMessages = [
      0xf8, // MIDI Clock (very frequent)
      0xfa, // Start
      0xfb, // Continue
      0xfc, // Stop
      0xfe, // Active Sensing (very frequent)
      0xff, // System Reset
    ];
    return realTimeMessages.includes(status);
  }

  private getRealTimeMessageName(status: number): string {
    switch (status) {
      case 0xf8:
        return "MIDI Clock";
      case 0xfa:
        return "Start";
      case 0xfb:
        return "Continue";
      case 0xfc:
        return "Stop";
      case 0xfe:
        return "Active Sensing";
      case 0xff:
        return "System Reset";
      default:
        return "Unknown Real-time";
    }
  }

  async sendParameterChange(parameter: "cutoff" | "resonance", value: number): Promise<boolean> {
    if (!this.monologueOutput) {
      this.debugLog("WARNING", "Cannot send parameter change - no Monologue output connected");
      console.warn("No Monologue output connected");
      return false;
    }

    try {
      const ccNumber = parameter === "cutoff" ? VCF_CC.CUTOFF : VCF_CC.RESONANCE;
      const clampedValue = Math.max(0, Math.min(127, Math.round(value)));

      // Send Control Change message: [status, cc_number, value]
      const message = [0xb0, ccNumber, clampedValue]; // Channel 1

      this.debugLog("OUTGOING_MSG", `Sending ${parameter} change`, {
        parameter,
        ccNumber,
        value: clampedValue,
        originalValue: value,
        message,
        hex: message.map((b) => "0x" + b.toString(16).padStart(2, "0")).join(" "),
      });

      // Track this outgoing message to prevent feedback loops
      const messageKey = `${ccNumber}:${clampedValue}`;
      this.recentOutgoingMessages.set(messageKey, Date.now());

      this.monologueOutput.send(message);

      this.debugLog("OUTGOING_MSG", `Successfully sent CC${ccNumber} = ${clampedValue}`);
      
      // Clean up old outgoing message tracking to prevent memory leaks
      this.cleanupOldOutgoingMessages();
      
      return true;
    } catch (error) {
      this.debugLog("ERROR", "Failed to send parameter change", error);
      console.error("Failed to send parameter change:", error);
      return false;
    }
  }

  getConnectedDevices(): SimpleMIDIDevice[] {
    if (!this.midiAccess) return [];

    const devices: SimpleMIDIDevice[] = [];

    for (const input of this.midiAccess.inputs.values()) {
      devices.push({
        id: input.id,
        name: input.name,
        isConnected: input.state === "connected",
        type: "input",
      });
    }

    return devices;
  }

  getAllDevices(): DeviceSelection {
    if (!this.midiAccess) {
      return {
        selectedInputId: this.selectedInputId,
        selectedOutputId: this.selectedOutputId,
        availableInputs: [],
        availableOutputs: [],
      };
    }

    const availableInputs: SimpleMIDIDevice[] = [];
    const availableOutputs: SimpleMIDIDevice[] = [];

    // Get all inputs
    for (const input of this.midiAccess.inputs.values()) {
      availableInputs.push({
        id: input.id,
        name: input.name,
        isConnected: input.state === "connected",
        type: "input",
      });
    }

    // Get all outputs
    for (const output of this.midiAccess.outputs.values()) {
      availableOutputs.push({
        id: output.id,
        name: output.name,
        isConnected: output.state === "connected",
        type: "output",
      });
    }

    return {
      selectedInputId: this.selectedInputId,
      selectedOutputId: this.selectedOutputId,
      availableInputs,
      availableOutputs,
    };
  }

  selectMIDIInput(deviceId: string | null): boolean {
    this.debugLog("CONNECTION", `Manually selecting MIDI input: ${deviceId || "none"}`);

    // Disconnect current input
    if (this.monologueInput) {
      this.monologueInput.onmidimessage = null;
      this.monologueInput = null;
    }

    this.selectedInputId = deviceId;

    if (deviceId && this.midiAccess) {
      const input = this.midiAccess.inputs.get(deviceId);
      if (input && input.state === "connected") {
        this.connectInput(input);
        this.debugLog("CONNECTION", `Successfully connected to input: ${input.name}`);
        this.emit("deviceSelectionChanged", this.getAllDevices());
        return true;
      } else {
        this.debugLog("ERROR", `Input device not found or disconnected: ${deviceId}`);
        // Clear selection if device is not available
        this.selectedInputId = null;
        this.emit("deviceSelectionChanged", this.getAllDevices());
        return false;
      }
    }

    this.emit("deviceSelectionChanged", this.getAllDevices());
    return true;
  }

  selectMIDIOutput(deviceId: string | null): boolean {
    this.debugLog("CONNECTION", `Manually selecting MIDI output: ${deviceId || "none"}`);

    // Disconnect current output
    this.monologueOutput = null;
    this.selectedOutputId = deviceId;

    if (deviceId && this.midiAccess) {
      const output = this.midiAccess.outputs.get(deviceId);
      if (output && output.state === "connected") {
        this.connectOutput(output);
        this.debugLog("CONNECTION", `Successfully connected to output: ${output.name}`);
        this.emit("deviceSelectionChanged", this.getAllDevices());
        return true;
      } else {
        this.debugLog("ERROR", `Output device not found or disconnected: ${deviceId}`);
        // Clear selection if device is not available
        this.selectedOutputId = null;
        this.emit("deviceSelectionChanged", this.getAllDevices());
        return false;
      }
    }

    this.emit("deviceSelectionChanged", this.getAllDevices());
    return true;
  }

  getSelectedDevices(): { inputId: string | null; outputId: string | null } {
    return {
      inputId: this.selectedInputId,
      outputId: this.selectedOutputId,
    };
  }

  getMonologueDevice(): SimpleMIDIDevice | null {
    const devices = this.getConnectedDevices();
    return devices.find((device) => this.isMonologue(device.name)) || null;
  }

  isMonologueConnected(): boolean {
    return !!(this.monologueInput || this.monologueOutput);
  }

  // Simple event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private cleanupOldOutgoingMessages() {
    const now = Date.now();
    const expiredMessages: string[] = [];
    const expiredDebugLogs: string[] = [];
    
    // Find messages older than 500ms
    for (const [messageKey, timestamp] of this.recentOutgoingMessages.entries()) {
      if (now - timestamp > 500) {
        expiredMessages.push(messageKey);
      }
    }
    
    // Find debug logs older than 1 second
    for (const [logKey, timestamp] of this.lastDebugLogTime.entries()) {
      if (now - timestamp > 1000) {
        expiredDebugLogs.push(logKey);
      }
    }
    
    // Remove expired messages and logs
    for (const messageKey of expiredMessages) {
      this.recentOutgoingMessages.delete(messageKey);
    }
    for (const logKey of expiredDebugLogs) {
      this.lastDebugLogTime.delete(logKey);
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.monologueInput) {
      this.monologueInput.onmidimessage = null;
    }
    this.monologueInput = null;
    this.monologueOutput = null;
    this.listeners.clear();
  }
}
