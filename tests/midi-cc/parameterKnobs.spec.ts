import { test, expect } from "@playwright/test";
import { MidiTestPage } from "./MidiTestPage";

test.describe("Parameter Knob MIDI Output Tests", () => {
  test("Drive knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Drive");
    const box = await locator.boundingBox();
    if (!box) throw new Error("Drive knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (drive default is 0 = 50deg)
    const beforeTweak = await page.$eval('[data-testid="Drive"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(50deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position (should be 310deg for max)
    const afterTweak = await page.$eval('[data-testid="Drive"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (Drive = CC 28)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 28, 127]); // Channel 1, CC 28, max value
  });

  test("VCO1 Shape knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Find VCO1 Shape knob (it's in the VCO1 section)
    const vco1Section = page.locator("#vco1");
    const shapeKnob = vco1Section.getByTestId("Shape");
    const box = await shapeKnob.boundingBox();
    if (!box) throw new Error("VCO1 Shape knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (shape default is 0 = 50deg)
    const beforeTweak = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(50deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (VCO1 Shape = CC 36)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 36, 127]);
  });

  test("VCO2 Shape knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    // Find VCO2 Shape knob (it's in the VCO2 section)
    const vco2Section = page.locator("#vco2");
    const shapeKnob = vco2Section.getByTestId("Shape");
    const box = await shapeKnob.boundingBox();
    if (!box) throw new Error("VCO2 Shape knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (shape default is 0 = 50deg)
    const beforeTweak = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(50deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await shapeKnob.evaluate((el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (VCO2 Shape = CC 37)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 37, 127]);
  });

  test("VCO2 Pitch knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Pitch");
    const box = await locator.boundingBox();
    if (!box) throw new Error("VCO2 Pitch knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (pitch default is 512 = 180deg)
    const beforeTweak = await page.$eval('[data-testid="Pitch"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(180\.1?\d*deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="Pitch"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (VCO2 Pitch = CC 35)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 35, 127]);
  });

  test("VCO1 Mix knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("VCO1");
    const box = await locator.boundingBox();
    if (!box) throw new Error("VCO1 Mix knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (vco1 level default is 512 = 180deg)
    const beforeTweak = await page.$eval('[data-testid="VCO1"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(180\.1?\d*deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="VCO1"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (VCO1 Level = CC 39)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 39, 127]);
  });

  test("VCO2 Mix knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("VCO2");
    const box = await locator.boundingBox();
    if (!box) throw new Error("VCO2 Mix knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (vco2 level default is 512 = 180deg)
    const beforeTweak = await page.$eval('[data-testid="VCO2"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(180\.1?\d*deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="VCO2"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (VCO2 Level = CC 40)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 40, 127]);
  });

  test("Resonance knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Resonance");
    const box = await locator.boundingBox();
    if (!box) throw new Error("Resonance knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (resonance default is 0 = 50deg)
    const beforeTweak = await page.$eval('[data-testid="Resonance"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(50deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="Resonance"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (Resonance = CC 44)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 44, 127]);
  });

  test("Attack knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Attack");
    const box = await locator.boundingBox();
    if (!box) throw new Error("Attack knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (attack default is 0 = 50deg)
    const beforeTweak = await page.$eval('[data-testid="Attack"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(50deg\)/);

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="Attack"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (Attack = CC 16)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 16, 127]);
  });

  test("Decay knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Decay");
    const box = await locator.boundingBox();
    if (!box) throw new Error("Decay knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (decay default is 300 ≈ 126deg)
    const beforeTweak = await page.$eval('[data-testid="Decay"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(12[0-9]\.?\d*deg\)/); // Allow range around 126deg

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="Decay"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (Decay = CC 17)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 17, 127]);
  });

  test("LFO Rate knob sends correct MIDI CC", async ({ page }) => {
    const midiPage = new MidiTestPage(page);
    await midiPage.goto();
    await midiPage.connectMidiDevice();

    const locator = page.getByTestId("Rate");
    const box = await locator.boundingBox();
    if (!box) throw new Error("LFO Rate knob not found or not visible");

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Check initial position (rate default is 50 ≈ 63deg)
    const beforeTweak = await page.$eval('[data-testid="Rate"]', (el) => el.style.transform);
    await expect(beforeTweak).toMatch(/rotate\(6[0-9]\.?\d*deg\)/); // Allow range around 63deg

    // Move knob to maximum position
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
    await page.mouse.up();

    // Check final position
    const afterTweak = await page.$eval('[data-testid="Rate"]', (el) => el.style.transform);
    await expect(afterTweak).toMatch(/rotate\(310deg\)/);

    // Check MIDI CC output (LFO Rate = CC 24)
    const messages = await midiPage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    const last = Array.from(messages.pop() ?? []);
    expect(last).toStrictEqual([176, 24, 127]);
  });
});
