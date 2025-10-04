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

  async sendMidiMessage(data: number[]) {
    await this.page.evaluate((bytes) => {
      window.__mockMIDIInput.dispatchMessage(new Uint8Array(bytes));
    }, data);
  }

  async getMessages(): Promise<Uint8Array[]> {
    const raw: number[][] = await this.page.evaluate(() => {
      return window.__sentMidiMessages.map((msg: Uint8Array) => Array.from(msg));
    });

    return raw.map((arr) => new Uint8Array(arr));
  }
}
