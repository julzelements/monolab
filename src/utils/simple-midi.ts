// MVP MIDI utilities - simplified for cutoff and resonance only
import { MVPPatch, SimpleMIDIDevice, ParameterChangeEvent, VCF_CC } from '@/types/mvp'

export class SimpleMIDIManager {
  private static instance: SimpleMIDIManager
  private isInitialized = false
  private midiAccess: any = null
  private monologueOutput: any = null
  private monologueInput: any = null
  private listeners: Map<string, Function[]> = new Map()

  private constructor() {}

  static getInstance(): SimpleMIDIManager {
    if (!SimpleMIDIManager.instance) {
      SimpleMIDIManager.instance = new SimpleMIDIManager()
    }
    return SimpleMIDIManager.instance
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if Web MIDI API is supported
      if (!navigator.requestMIDIAccess) {
        console.error('Web MIDI API not supported')
        return false
      }

      this.midiAccess = await navigator.requestMIDIAccess()
      this.isInitialized = true
      this.setupDeviceListeners()
      this.scanForMonologue()
      return true
    } catch (error) {
      console.error('Failed to initialize MIDI:', error)
      return false
    }
  }

  private setupDeviceListeners() {
    if (!this.midiAccess) return

    this.midiAccess.addEventListener('statechange', () => {
      this.scanForMonologue()
      this.emit('deviceChange', this.getConnectedDevices())
    })
  }

  private scanForMonologue() {
    if (!this.midiAccess) return

    // Look for Monologue in inputs
    for (const input of this.midiAccess.inputs.values()) {
      if (this.isMonologue(input.name)) {
        this.connectInput(input)
        break
      }
    }

    // Look for Monologue in outputs
    for (const output of this.midiAccess.outputs.values()) {
      if (this.isMonologue(output.name)) {
        this.connectOutput(output)
        break
      }
    }
  }

  private isMonologue(deviceName: string): boolean {
    const name = deviceName.toLowerCase()
    return name.includes('monologue') || name.includes('korg')
  }

  private connectInput(input: any) {
    this.monologueInput = input
    input.onmidimessage = (message: any) => {
      this.handleMIDIMessage(message)
    }
    this.emit('monologueConnected', this.getMonologueDevice())
  }

  private connectOutput(output: any) {
    this.monologueOutput = output
    this.emit('monologueConnected', this.getMonologueDevice())
  }

  private handleMIDIMessage(message: any) {
    const [status, data1, data2] = message.data

    // Check for Control Change messages (0xB0-0xBF)
    if ((status & 0xF0) === 0xB0) {
      const ccNumber = data1
      const value = data2

      let parameter: 'cutoff' | 'resonance' | null = null
      if (ccNumber === VCF_CC.CUTOFF) parameter = 'cutoff'
      else if (ccNumber === VCF_CC.RESONANCE) parameter = 'resonance'

      if (parameter) {
        const event: ParameterChangeEvent = {
          parameter,
          value,
          source: 'hardware'
        }
        this.emit('parameterChange', event)
      }
    }
  }

  async sendParameterChange(parameter: 'cutoff' | 'resonance', value: number): Promise<boolean> {
    if (!this.monologueOutput) {
      console.warn('No Monologue output connected')
      return false
    }

    try {
      const ccNumber = parameter === 'cutoff' ? VCF_CC.CUTOFF : VCF_CC.RESONANCE
      const clampedValue = Math.max(0, Math.min(127, Math.round(value)))
      
      // Send Control Change message: [status, cc_number, value]
      const message = [0xB0, ccNumber, clampedValue] // Channel 1
      this.monologueOutput.send(message)
      
      return true
    } catch (error) {
      console.error('Failed to send parameter change:', error)
      return false
    }
  }

  getConnectedDevices(): SimpleMIDIDevice[] {
    if (!this.midiAccess) return []

    const devices: SimpleMIDIDevice[] = []
    
    for (const input of this.midiAccess.inputs.values()) {
      devices.push({
        id: input.id,
        name: input.name,
        isConnected: input.state === 'connected'
      })
    }

    return devices
  }

  getMonologueDevice(): SimpleMIDIDevice | null {
    const devices = this.getConnectedDevices()
    return devices.find(device => this.isMonologue(device.name)) || null
  }

  isMonologueConnected(): boolean {
    return !!(this.monologueInput || this.monologueOutput)
  }

  // Simple event system
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
      this.monologueInput.onmidimessage = null
    }
    this.monologueInput = null
    this.monologueOutput = null
    this.listeners.clear()
  }
}