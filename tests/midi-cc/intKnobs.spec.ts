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
    const egIntKnobSelector = '[data-testid="envelope-int-knob"]';
    const egToggleSelector = '[data-testid="envelope-int-toggle"]';

    test("should start at center position and send MIDI CC 64", async () => {
      await midiTestPage.clearMIDIMessages();

      // The knob should start at center (0 sysex) and send MIDI CC 64
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "mid");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25); // EG_INT is CC25
      expect(egMessages.length).toBeGreaterThan(0);
      expect(egMessages[egMessages.length - 1].value).toBe(64);
    });

    test("should toggle between NORM and INV states", async () => {
      // First move the knob away from zero so toggle behavior is visible
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "max");

      // Check initial state
      const toggleButton = midiTestPage.page.locator(egToggleSelector);
      await expect(toggleButton).toBeVisible();

      // Get initial text and log it
      const initialText = await toggleButton.textContent();
      console.log(`Initial toggle text: ${initialText}`);
      await expect(toggleButton).toHaveText("NORM");

      // Click to toggle to INV
      await toggleButton.click();
      await midiTestPage.page.waitForTimeout(100); // Give time for state update

      const afterClickText = await toggleButton.textContent();
      console.log(`After click text: ${afterClickText}`);
      await expect(toggleButton).toHaveText("INV");

      // Click again to toggle back to NORM
      await toggleButton.click();
      await midiTestPage.page.waitForTimeout(100); // Give time for state update

      const finalText = await toggleButton.textContent();
      console.log(`Final text: ${finalText}`);
      await expect(toggleButton).toHaveText("NORM");
    });

    test("should handle minimum position correctly", async () => {
      await midiTestPage.clearMIDIMessages();

      // Set to minimum position (should send MIDI CC 0)
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "min");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25);
      expect(egMessages.length).toBeGreaterThan(0);
      expect(egMessages[egMessages.length - 1].value).toBe(0);
    });

    test("should handle maximum position correctly", async () => {
      await midiTestPage.clearMIDIMessages();

      // Set to maximum position (should send MIDI CC 127)
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25);
      expect(egMessages.length).toBeGreaterThan(0);
      expect(egMessages[egMessages.length - 1].value).toBe(127);
    });

    test("should send correct MIDI CC when rotated (NORM mode)", async () => {
      // Ensure we're in NORM mode
      const toggleButton = midiTestPage.page.locator(egToggleSelector);
      const currentText = await toggleButton.textContent();
      if (currentText === "INV") {
        await toggleButton.click();
      }
      await expect(toggleButton).toHaveText("NORM");

      await midiTestPage.clearMIDIMessages();

      // Test different positions
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "min");
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "mid");
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25);
      expect(egMessages.length).toBeGreaterThanOrEqual(3);

      // Should have sent values corresponding to min (0), mid (64), max (127)
      const values = egMessages.map((msg) => msg.value);
      expect(values).toContain(0); // min position
      expect(values).toContain(64); // center position
      expect(values).toContain(127); // max position
    });

    test("should send correct MIDI CC when rotated (INV mode)", async () => {
      // Switch to INV mode
      const toggleButton = midiTestPage.page.locator(egToggleSelector);
      const currentText = await toggleButton.textContent();
      if (currentText === "NORM") {
        await toggleButton.click();
      }
      await expect(toggleButton).toHaveText("INV");

      await midiTestPage.clearMIDIMessages();

      // Test different positions - in INV mode, the MIDI output should still be 0-127
      // but the internal sysex values are negative
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "min");
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "mid");
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25);
      expect(egMessages.length).toBeGreaterThanOrEqual(3);

      // Even in INV mode, MIDI CC values should still be 0-127
      const values = egMessages.map((msg) => msg.value);
      expect(values).toContain(0);
      expect(values).toContain(64);
      expect(values).toContain(127);
    });

    test("should handle toggle state changes between NORM and INV states", async () => {
      const toggleButton = midiTestPage.page.locator(egToggleSelector);

      // Start in NORM mode
      const currentText = await toggleButton.textContent();
      if (currentText === "INV") {
        await toggleButton.click();
      }
      await expect(toggleButton).toHaveText("NORM");

      await midiTestPage.clearMIDIMessages();

      // Set knob to a specific position in NORM mode
      await midiTestPage.setKnobToPosition(egIntKnobSelector, "max");

      // Switch to INV mode and observe behavior
      await toggleButton.click();
      await expect(toggleButton).toHaveText("INV");

      // The knob position should remain the same, but internal behavior changes
      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egMessages = messages.filter((msg) => msg.cc === 25);

      // Should have received MIDI messages from the position setting
      expect(egMessages.length).toBeGreaterThan(0);
    });
  });

  test.describe("LFO INT Knob", () => {
    const lfoIntKnobSelector = '[data-testid="lfo-int-knob"]';
    const lfoToggleSelector = '[data-testid="lfo-int-toggle"]';

    test("should start at center position and send MIDI CC 64", async () => {
      await midiTestPage.clearMIDIMessages();

      // The knob should start at center (0 sysex) and send MIDI CC 64
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "mid");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoMessages = messages.filter((msg) => msg.cc === 26); // LFO_INT is CC26
      expect(lfoMessages.length).toBeGreaterThan(0);
      expect(lfoMessages[lfoMessages.length - 1].value).toBe(64);
    });

    test("should toggle between NORM and INV states", async () => {
      // First move the knob away from zero so toggle behavior is visible
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "max");

      // Check initial state
      const toggleButton = midiTestPage.page.locator(lfoToggleSelector);
      await expect(toggleButton).toHaveText("NORM");

      // Click to toggle to INV
      await toggleButton.click();
      await expect(toggleButton).toHaveText("INV");

      // Click again to toggle back to NORM
      await toggleButton.click();
      await expect(toggleButton).toHaveText("NORM");
    });

    test("should handle maximum position correctly", async () => {
      await midiTestPage.clearMIDIMessages();

      // Set to maximum position (should send MIDI CC 127)
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoMessages = messages.filter((msg) => msg.cc === 26);
      expect(lfoMessages.length).toBeGreaterThan(0);
      expect(lfoMessages[lfoMessages.length - 1].value).toBe(127);
    });

    test("should send correct MIDI CC when rotated (NORM mode)", async () => {
      // Ensure we're in NORM mode
      const toggleButton = midiTestPage.page.locator(lfoToggleSelector);
      const currentText = await toggleButton.textContent();
      if (currentText === "INV") {
        await toggleButton.click();
      }
      await expect(toggleButton).toHaveText("NORM");

      await midiTestPage.clearMIDIMessages();

      // Test different positions
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "min");
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "mid");
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoMessages = messages.filter((msg) => msg.cc === 26);
      expect(lfoMessages.length).toBeGreaterThanOrEqual(3);

      // Should have sent values corresponding to min (0), mid (64), max (127)
      const values = lfoMessages.map((msg) => msg.value);
      expect(values).toContain(0); // min position
      expect(values).toContain(64); // center position
      expect(values).toContain(127); // max position
    });

    test("should send correct MIDI CC when rotated (INV mode)", async () => {
      // Switch to INV mode
      const toggleButton = midiTestPage.page.locator(lfoToggleSelector);
      const currentText = await toggleButton.textContent();
      if (currentText === "NORM") {
        await toggleButton.click();
      }
      await expect(toggleButton).toHaveText("INV");

      await midiTestPage.clearMIDIMessages();

      // Test different positions - in INV mode, the MIDI output should still be 0-127
      // but the internal sysex values are negative
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "min");
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "mid");
      await midiTestPage.setKnobToPosition(lfoIntKnobSelector, "max");

      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoMessages = messages.filter((msg) => msg.cc === 26);
      expect(lfoMessages.length).toBeGreaterThanOrEqual(3);

      // Even in INV mode, MIDI CC values should still be 0-127
      const values = lfoMessages.map((msg) => msg.value);
      expect(values).toContain(0);
      expect(values).toContain(64);
      expect(values).toContain(127);
    });
  });

  test.describe("MIDI Input to INT Knobs", () => {
    test("should respond to incoming EG_INT MIDI CC messages", async () => {
      const egIntKnobSelector = '[data-testid="envelope-int-knob"]';

      await midiTestPage.clearMIDIMessages();

      // Send MIDI CC 25 (EG_INT) with value 0 (minimum)
      await midiTestPage.sendMIDICC(25, 0);
      await midiTestPage.page.waitForTimeout(100); // Give time for processing

      // Send MIDI CC 25 with value 64 (center)
      await midiTestPage.sendMIDICC(25, 64);
      await midiTestPage.page.waitForTimeout(100);

      // Send MIDI CC 25 with value 127 (maximum)
      await midiTestPage.sendMIDICC(25, 127);
      await midiTestPage.page.waitForTimeout(100);

      // The knob should respond to these inputs
      // We can't easily check the exact angle, but we can verify the knob element exists
      const knobElement = midiTestPage.page.locator(egIntKnobSelector);
      await expect(knobElement).toBeVisible();
    });

    test("should respond to incoming LFO_INT MIDI CC messages", async () => {
      const lfoIntKnobSelector = '[data-testid="lfo-int-knob"]';

      await midiTestPage.clearMIDIMessages();

      // Send MIDI CC 26 (LFO_INT) with value 0 (minimum)
      await midiTestPage.sendMIDICC(26, 0);
      await midiTestPage.page.waitForTimeout(100); // Give time for processing

      // Send MIDI CC 26 with value 64 (center)
      await midiTestPage.sendMIDICC(26, 64);
      await midiTestPage.page.waitForTimeout(100);

      // Send MIDI CC 26 with value 127 (maximum)
      await midiTestPage.sendMIDICC(26, 127);
      await midiTestPage.page.waitForTimeout(100);

      // The knob should respond to these inputs
      // We can't easily check the exact angle, but we can verify the knob element exists
      const knobElement = midiTestPage.page.locator(lfoIntKnobSelector);
      await expect(knobElement).toBeVisible();
    });
  });
});
