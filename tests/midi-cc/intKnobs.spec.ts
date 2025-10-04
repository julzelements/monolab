import { test, expect } from "@playwright/test";
import { MidiTestPage } from "./MidiTestPage";

test.describe("INT Knobs - Envelope and LFO Intensity", () => {
  let midiTestPage: MidiTestPage;

  test.beforeEach(async ({ page }) => {
    midiTestPage = new MidiTestPage(page);
    await midiTestPage.goto();
    await midiTestPage.setupMockMIDI();
  });

  test.describe("Envelope INT Knob", () => {
    test("should start at center position (0 sysex)", async () => {});

    test("should toggle between NORM and INV states", async () => {});

    test("should handle minimum position correctly", async () => {});

    test("should handle maximum position correctly", async () => {});

    test("should handle middle position correctly", async () => {});

    test("should send correct MIDI CC when rotated (NORM mode)", async () => {});

    test("should send correct MIDI CC when rotated (INV mode)", async () => {});
  });

  test.describe("LFO INT Knob", () => {
    test("should start at center position (0 sysex)", async () => {});

    test("should toggle between NORM and INV states", async () => {});

    test("should handle maximum position correctly", async () => {});

    test("should send correct MIDI CC when rotated (NORM mode)", async () => {});

    test("should send correct MIDI CC when rotated (INV mode)", async () => {});
  });

  test.describe("MIDI Input to INT Knobs", () => {
    test("should respond to incoming EG_INT MIDI CC messages", async () => {});

    test("should respond to incoming LFO_INT MIDI CC messages", async () => {});
  });
});
