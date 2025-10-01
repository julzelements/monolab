import { WebMidi, Input, Output } from 'webmidi'
import { MIDIDevice, MIDIMessage, SysExMessage, MonologuePatch } from '@/types'
import { MONOLOGUE_SYSEX, MONOLOGUE_PARAMETERS, CC_TO_PARAMETER } from '@/lib/monologue-constants'

export class MIDIManager {
  private static instance: MIDIManager
  private isInitialized = false
  private connectedDevices: MIDIDevice[] = []
  private monologueInput: Input | null = null
  private monologueOutput: Output | null = null
  private listeners: Map<string, Function[]> = new Map()

  private constructor() {}

  static getInstance(): MIDIManager {
    if (!MIDIManager.instance) {
      MIDIManager.instance = new MIDIManager()
    }
    return MIDIManager.instance
  }

  async initialize(): Promise<boolean> {
    try {
      await WebMidi.enable()
      this.isInitialized = true
      this.setupDeviceListeners()
      this.scanForDevices()
      return true
    } catch (error) {
      console.error('Failed to initialize WebMIDI:', error)
      return false
    }
  }

  private setupDeviceListeners() {
    WebMidi.addListener('connected', (e) => {
      console.log('MIDI device connected:', e.port.name)
      this.scanForDevices()
      this.emit('deviceConnected', e.port)
    })

    WebMidi.addListener('disconnected', (e) => {
      console.log('MIDI device disconnected:', e.port.name)
      this.scanForDevices()
      this.emit('deviceDisconnected', e.port)
    })
  }

  private scanForDevices() {
    this.connectedDevices = []

    // Scan inputs
    WebMidi.inputs.forEach(input => {
      const device: MIDIDevice = {
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer || 'Unknown',
        input: input,
        output: undefined,
        isConnected: true
      }

      // Try to find matching output
      const matchingOutput = WebMidi.outputs.find(output => 
        output.name === input.name || 
        output.id === input.id.replace('input', 'output')
      )
      
      if (matchingOutput) {
        device.output = matchingOutput
      }

      this.connectedDevices.push(device)

      // Auto-connect Monologue if found
      if (this.isMonologue(input.name)) {
        this.connectToMonologue(device)
      }
    })

    this.emit('devicesUpdated', this.connectedDevices)
  }

  private isMonologue(deviceName: string): boolean {
    const monologueNames = [
      'monologue',
      'korg monologue',
      'monologue SOUND'
    ]
    return monologueNames.some(name => 
      deviceName.toLowerCase().includes(name.toLowerCase())
    )
  }

  async connectToMonologue(device: MIDIDevice): Promise<boolean> {
    try {
      if (device.input) {
        this.monologueInput = device.input
        this.setupMonologueInputListeners()
      }

      if (device.output) {
        this.monologueOutput = device.output
      }

      this.emit('monologueConnected', device)
      return true
    } catch (error) {
      console.error('Failed to connect to Monologue:', error)
      return false
    }
  }

  private setupMonologueInputListeners() {
    if (!this.monologueInput) return

    // Listen for CC messages (parameter changes)
    this.monologueInput.addListener('controlchange', (e) => {
      const parameterKey = CC_TO_PARAMETER[e.controller.number]
      if (parameterKey) {
        this.emit('parameterChange', {
          parameter: parameterKey,
          value: e.value,
          rawValue: e.rawValue
        })
      }
    })

    // Listen for SysEx messages (patch dumps)
    this.monologueInput.addListener('sysex', (e) => {
      const sysexData = new Uint8Array(e.data)
      if (this.isMonologueSysEx(sysexData)) {
        const parsedData = this.parseSysEx(sysexData)
        if (parsedData) {
          this.emit('patchReceived', parsedData)
        }
      }
    })

    // Listen for program changes
    this.monologueInput.addListener('programchange', (e) => {
      this.emit('programChange', e.value)
    })
  }

  private isMonologueSysEx(data: Uint8Array): boolean {
    if (data.length < 8) return false
    
    return (
      data[0] === 0xF0 && // SysEx start
      data[1] === MONOLOGUE_SYSEX.MANUFACTURER[0] && // Korg
      data[2] === MONOLOGUE_SYSEX.DEVICE_ID && // Device ID
      data[3] === MONOLOGUE_SYSEX.MODEL_ID[0] &&
      data[4] === MONOLOGUE_SYSEX.MODEL_ID[1] &&
      data[5] === MONOLOGUE_SYSEX.MODEL_ID[2] &&
      data[data.length - 1] === 0xF7 // SysEx end
    )
  }

  private parseSysEx(data: Uint8Array): MonologuePatch | null {
    try {
      // Extract command byte
      const command = data[6]
      
      if (command === MONOLOGUE_SYSEX.COMMANDS.CURRENT_PROGRAM_DATA_DUMP ||
          command === MONOLOGUE_SYSEX.COMMANDS.PROGRAM_DATA_DUMP) {
        
        // Extract parameter data (skip header and footer)
        const parameterData = data.slice(8, -1)
        return this.parseParameterData(parameterData)
      }
      
      return null
    } catch (error) {
      console.error('Failed to parse SysEx data:', error)
      return null
    }
  }

  private parseParameterData(data: Uint8Array): MonologuePatch {
    // This is a simplified parser - real implementation would need
    // detailed knowledge of Monologue SysEx format
    return {
      name: 'Received Patch',
      description: 'Patch received from Monologue',
      tags: [],
      vco: {
        wave: 'saw',
        octave: 0,
        pitch: data[0] || 64
      },
      vcf: {
        cutoff: data[1] || 127,
        resonance: data[2] || 0,
        eg: data[3] || 64,
        type: 'lpf',
        drive: data[4] || 0
      },
      vca: {
        level: data[5] || 127
      },
      eg: {
        attack: data[6] || 0,
        decay: data[7] || 64,
        sustain: data[8] || 127,
        release: data[9] || 64
      },
      lfo: {
        wave: 'triangle',
        rate: data[10] || 64,
        intensity: data[11] || 0,
        target: 'pitch'
      },
      delay: {
        time: data[12] || 0,
        feedback: data[13] || 0,
        hiCut: data[14] || 127
      },
      global: {
        portamento: data[15] || 0,
        voiceMode: 'mono',
        syncSource: 'internal',
        midiChannel: 1
      }
    }
  }

  async sendPatchToMonologue(patch: MonologuePatch): Promise<boolean> {
    if (!this.monologueOutput) {
      console.error('No Monologue output connected')
      return false
    }

    try {
      const sysexData = this.createSysEx(patch)
      this.monologueOutput.sendSysex(MONOLOGUE_SYSEX.MANUFACTURER, sysexData)
      return true
    } catch (error) {
      console.error('Failed to send patch to Monologue:', error)
      return false
    }
  }

  private createSysEx(patch: MonologuePatch): number[] {
    // Simplified SysEx creation - real implementation would need
    // detailed knowledge of Monologue SysEx format
    const data = [
      MONOLOGUE_SYSEX.DEVICE_ID,
      ...MONOLOGUE_SYSEX.MODEL_ID,
      MONOLOGUE_SYSEX.COMMANDS.CURRENT_PROGRAM_DATA_DUMP,
      0x00, // Data start
      patch.vco.pitch,
      patch.vcf.cutoff,
      patch.vcf.resonance,
      patch.vcf.eg,
      patch.vcf.drive,
      patch.vca.level,
      patch.eg.attack,
      patch.eg.decay,
      patch.eg.sustain,
      patch.eg.release,
      patch.lfo.rate,
      patch.lfo.intensity,
      patch.delay.time,
      patch.delay.feedback,
      patch.delay.hiCut,
      patch.global.portamento,
      // ... more parameters would go here
      ...Array(MONOLOGUE_SYSEX.DATA_SIZE.PROGRAM - 16).fill(0) // Pad remaining data
    ]

    return data
  }

  async sendParameterChange(parameterKey: string, value: number): Promise<boolean> {
    if (!this.monologueOutput) {
      console.error('No Monologue output connected')
      return false
    }

    const parameter = MONOLOGUE_PARAMETERS[parameterKey]
    if (!parameter?.ccNumber) {
      console.error('No CC number for parameter:', parameterKey)
      return false
    }

    try {
      // Ensure value is within parameter range
      const clampedValue = Math.max(parameter.min, Math.min(parameter.max, value))
      
      this.monologueOutput.sendControlChange(parameter.ccNumber, clampedValue, 1)
      return true
    } catch (error) {
      console.error('Failed to send parameter change:', error)
      return false
    }
  }

  async requestCurrentPatch(): Promise<boolean> {
    if (!this.monologueOutput) {
      console.error('No Monologue output connected')
      return false
    }

    try {
      // Send SysEx request for current program data
      const requestData = [
        MONOLOGUE_SYSEX.DEVICE_ID,
        ...MONOLOGUE_SYSEX.MODEL_ID,
        MONOLOGUE_SYSEX.COMMANDS.INQUIRY_REQUEST,
        0x00 // Request current program
      ]

      this.monologueOutput.sendSysex(MONOLOGUE_SYSEX.MANUFACTURER, requestData)
      return true
    } catch (error) {
      console.error('Failed to request current patch:', error)
      return false
    }
  }

  getConnectedDevices(): MIDIDevice[] {
    return this.connectedDevices
  }

  getMonologueDevice(): MIDIDevice | null {
    return this.connectedDevices.find(device => 
      this.isMonologue(device.name)
    ) || null
  }

  isMonologueConnected(): boolean {
    return !!(this.monologueInput && this.monologueOutput)
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  disconnect() {
    if (this.monologueInput) {
      this.monologueInput.removeListener()
    }
    this.monologueInput = null
    this.monologueOutput = null
    this.listeners.clear()
  }

  destroy() {
    this.disconnect()
    if (this.isInitialized) {
      WebMidi.disable()
      this.isInitialized = false
    }
  }
}