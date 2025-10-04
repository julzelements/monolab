import type { Page } from "@playwright/test";
declare global {
  interface Window {
    __sentMidiMessages: Uint8Array[];
    __mockMIDIInput: MIDIInput & { dispatchMessage(data: Uint8Array): void };
  }
}
export class MidiTestPage {
  constructor(public readonly page: Page) {}

  async goto(url = "http://localhost:3000") {
    await this.page.context().grantPermissions(["midi", "midi-sysex"], {
      origin: new URL(url).origin,
    });

    await this.page.addInitScript(() => {
      window.__sentMidiMessages = [];

      class MockMIDIOutput extends EventTarget implements MIDIOutput {
        id = "mock-output-1";
        manufacturer = "Mock";
        name = "monologue SOUND";
        type: MIDIPortType = "output";
        version = "1.0";
        state: MIDIPortDeviceState = "connected";
        connection: MIDIPortConnectionState = "open";
        onstatechange: ((this: MIDIPort, ev: Event) => void) | null = null;
        async open() {
          return this;
        }
        async close() {
          return this;
        }
        send(data: number[] | Uint8Array) {
          window.__sentMidiMessages.push(new Uint8Array(data));
        }
        clear() {}
        addEventListener() {}
        removeEventListener() {}
        dispatchEvent(): boolean {
          return true;
        }
      }

      class MockMIDIInput extends EventTarget implements MIDIInput {
        id = "mock-input-1";
        manufacturer = "Mock";
        name = "monologue KBD/KNOB";
        type: MIDIPortType = "input";
        version = "1.0";
        state: MIDIPortDeviceState = "connected";
        connection: MIDIPortConnectionState = "open";
        onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => void) | null = null;
        onstatechange: ((this: MIDIPort, ev: Event) => void) | null = null;
        async open() {
          return this;
        }
        async close() {
          return this;
        }
        addEventListener() {}
        removeEventListener() {}
        dispatchEvent(): boolean {
          return true;
        }
        dispatchMessage(data: Uint8Array) {
          // Use generic MessageEvent and coerce to MIDIMessageEvent
          const evt = new MessageEvent("midimessage", { data }) as unknown as MIDIMessageEvent;
          this.onmidimessage?.(evt);
        }
      }

      const input = new MockMIDIInput();
      const output = new MockMIDIOutput();

      // Cast to the Web MIDI map types
      const inputs = new Map<string, MIDIInput>([[input.id, input]]) as unknown as MIDIInputMap;
      const outputs = new Map<string, MIDIOutput>([[output.id, output]]) as unknown as MIDIOutputMap;

      const midiAccess: MIDIAccess = {
        inputs,
        outputs,
        sysexEnabled: true,
        onstatechange: null,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false;
        },
      };

      (navigator as Navigator & { requestMIDIAccess?: () => Promise<MIDIAccess> }).requestMIDIAccess = () =>
        Promise.resolve(midiAccess);
      (window as Window & typeof globalThis).__mockMIDIInput = input;
    });

    await this.page.goto(url);
  }

  async connectMidiDevice() {
    // MIDI devices are auto-connected with the mock setup, so just wait for initialization
    await this.page.waitForSelector('[data-testid="Cutoff"]', { timeout: 5000 });
  }

  async setupMockMIDI() {
    // This is handled in goto() with addInitScript, so just ensure we're connected
    await this.connectMidiDevice();
  }

  async sendMidiMessage(data: number[]) {
    await this.page.evaluate((bytes) => {
      window.__mockMIDIInput.dispatchMessage(new Uint8Array(bytes));
    }, data);
  }

  async sendMIDICC(cc: number, value: number) {
    // Send MIDI CC message: [status, cc_number, value]
    await this.sendMidiMessage([0xb0, cc, value]); // Channel 1
  }

  async getMessages(): Promise<Uint8Array[]> {
    const raw: number[][] = await this.page.evaluate(() => {
      return window.__sentMidiMessages.map((msg: Uint8Array) => Array.from(msg));
    });

    return raw.map((arr) => new Uint8Array(arr));
  }

  async clearMIDIMessages() {
    await this.page.evaluate(() => {
      window.__sentMidiMessages = [];
    });
  }

  async getOutgoingMIDIMessages(): Promise<{cc: number, value: number}[]> {
    const messages = await this.getMessages();
    return messages
      .filter(msg => msg.length === 3 && msg[0] === 0xb0) // MIDI CC messages
      .map(msg => ({ cc: msg[1], value: msg[2] }));
  }

  async getKnobDebugInfo(knobSelector: string) {
    // Find the knob's control group container
    const knobElement = this.page.locator(knobSelector);
    
    // Based on the page snapshot, the debug info is in a sibling div within the same control group
    // Navigate to the control group and find the debug div containing all the info
    const controlGroup = knobElement.locator('../../..');  // Go up to control-group level
    
    // Find all debug text within the control group
    const debugLines = await controlGroup.locator('text=/Sysex:|MIDI:|Angle:|Inverted:/').allTextContents();
    
    // Combine all debug lines and parse them
    const debugText = debugLines.join('\n');
    
    let sysex = 0, midiCC = 0, ccNumber = 0, degrees = '0', startAngle = 0, endAngle = 0, isInverted = false;
    
    for (const line of debugLines) {
      if (line.includes('Sysex:')) {
        const match = line.match(/Sysex: (-?\d+)/);
        if (match) sysex = parseInt(match[1]);
      } else if (line.includes('MIDI:')) {
        const midiMatch = line.match(/MIDI: (\d+) \(CC(\d+)\)/);
        if (midiMatch) {
          midiCC = parseInt(midiMatch[1]);
          ccNumber = parseInt(midiMatch[2]);
        }
      } else if (line.includes('Angle:')) {
        const angleMatch = line.match(/Angle: ([\d.]+)° \(([\d.]+)° - ([\d.]+)°\)/);
        if (angleMatch) {
          degrees = angleMatch[1];
          startAngle = parseFloat(angleMatch[2]);
          endAngle = parseFloat(angleMatch[3]);
        }
      } else if (line.includes('Inverted:')) {
        isInverted = line.includes('Yes');
      }
    }

    return {
      sysex,
      midiCC,
      ccNumber,
      degrees,
      startAngle,
      endAngle,
      isInverted
    };
  }

  async setKnobToPosition(knobSelector: string, position: 'min' | 'max' | 'mid') {
    const knob = this.page.locator(knobSelector);
    const boundingBox = await knob.boundingBox();
    
    if (!boundingBox) {
      throw new Error(`Could not find knob ${knobSelector}`);
    }

    const centerX = boundingBox.x + boundingBox.width / 2;
    const centerY = boundingBox.y + boundingBox.height / 2;
    
    // Calculate target position based on typical knob range (50° to 310°)
    let targetAngle: number;
    switch (position) {
      case 'min':
        targetAngle = 50; // Start angle
        break;
      case 'max':
        targetAngle = 310; // End angle
        break;
      case 'mid':
        targetAngle = 180; // Middle angle
        break;
    }

    // Convert angle to coordinates (knob rotation starts from bottom)
    const radius = 30; // Approximate radius for mouse position
    const radians = (targetAngle - 90) * Math.PI / 180; // -90 to adjust for coordinate system
    const targetX = centerX + Math.cos(radians) * radius;
    const targetY = centerY + Math.sin(radians) * radius;

    // Simulate drag from center to target position
    await knob.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, targetY);
    await this.page.mouse.up();
    
    // Wait a bit for the UI to update
    await this.page.waitForTimeout(50);
  }
}
