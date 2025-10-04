import { test, expect } from "@playwright/test";
import { MidiTestPage } from "./MidiTestPage";

test.describe("Parameter MIDI Input Tests", () => {
  test("Drive responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for Drive (CC 28) - max value
    await midiPage.sendMidiMessage([176, 28, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Drive"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for Drive - min value
    await midiPage.sendMidiMessage([176, 28, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Drive"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("VCO1 Shape responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Find VCO1 Shape knob
    const vco1Section = page.locator("#vco1");
    const shapeKnob = vco1Section.getByTestId("Shape");

    // Send MIDI CC for VCO1 Shape (CC 36) - max value
    await midiPage.sendMidiMessage([176, 36, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for VCO1 Shape - min value
    await midiPage.sendMidiMessage([176, 36, 0]);
    await page.waitForTimeout(100);

    const minPosition = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("VCO2 Shape responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Find VCO2 Shape knob
    const vco2Section = page.locator("#vco2");
    const shapeKnob = vco2Section.getByTestId("Shape");

    // Send MIDI CC for VCO2 Shape (CC 37) - max value
    await midiPage.sendMidiMessage([176, 37, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for VCO2 Shape - min value
    await midiPage.sendMidiMessage([176, 37, 0]);
    await page.waitForTimeout(100);

    const minPosition = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("VCO2 Pitch responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for VCO2 Pitch (CC 35) - max value
    await midiPage.sendMidiMessage([176, 35, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Pitch"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for VCO2 Pitch - min value
    await midiPage.sendMidiMessage([176, 35, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Pitch"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("VCO1 Mix responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for VCO1 Level (CC 39) - max value
    await midiPage.sendMidiMessage([176, 39, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="VCO1"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for VCO1 Level - min value
    await midiPage.sendMidiMessage([176, 39, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="VCO1"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("VCO2 Mix responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for VCO2 Level (CC 40) - max value
    await midiPage.sendMidiMessage([176, 40, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="VCO2"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for VCO2 Level - min value
    await midiPage.sendMidiMessage([176, 40, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="VCO2"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("Resonance responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for Resonance (CC 44) - max value
    await midiPage.sendMidiMessage([176, 44, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Resonance"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for Resonance - min value
    await midiPage.sendMidiMessage([176, 44, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Resonance"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("Attack responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for Attack (CC 16) - max value
    await midiPage.sendMidiMessage([176, 16, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Attack"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for Attack - min value
    await midiPage.sendMidiMessage([176, 16, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Attack"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("Decay responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for Decay (CC 17) - max value
    await midiPage.sendMidiMessage([176, 17, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Decay"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for Decay - min value
    await midiPage.sendMidiMessage([176, 17, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Decay"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("LFO Rate responds to MIDI CC input", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Send MIDI CC for LFO Rate (CC 24) - max value
    await midiPage.sendMidiMessage([176, 24, 127]);
    await page.waitForTimeout(100);

    const maxPosition = await page.$eval('[data-testid="Rate"]', (el) => el.style.transform);
    await expect(maxPosition).toMatch(/rotate\(310deg\)/);

    // Send MIDI CC for LFO Rate - min value
    await midiPage.sendMidiMessage([176, 24, 0]);
    await page.waitForTimeout(100);

    const minPosition = await page.$eval('[data-testid="Rate"]', (el) => el.style.transform);
    await expect(minPosition).toMatch(/rotate\(50deg\)/);
  });

  test("Multiple parameter changes work correctly", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Test drive parameter change
    await midiPage.sendMidiMessage([176, 28, 127]); // Drive max
    await page.waitForTimeout(100);

    const drivePosition = await page.$eval('[data-testid="Drive"]', (el) => el.style.transform);
    await expect(drivePosition).toMatch(/rotate\(310deg\)/);

    // Test cutoff parameter change
    await midiPage.sendMidiMessage([176, 43, 64]); // Cutoff mid
    await page.waitForTimeout(100);

    const cutoffPosition = await page.$eval('[data-testid="Cutoff"]', (el) => el.style.transform);
    await expect(cutoffPosition).toMatch(/rotate\(18[0-9]\.?\d*deg\)/); // Around 180deg for mid value

    // Test resonance parameter change
    await midiPage.sendMidiMessage([176, 44, 127]); // Resonance max
    await page.waitForTimeout(100);

    const resonancePosition = await page.$eval('[data-testid="Resonance"]', (el) => el.style.transform);
    await expect(resonancePosition).toMatch(/rotate\(310deg\)/);
  });
});
