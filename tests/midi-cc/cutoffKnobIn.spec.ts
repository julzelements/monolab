import { test, expect } from "@playwright/test";
import { MidiTestPage } from "./MidiTestPage";

test("handles MIDI CC messages", async ({ page }) => {
  const midiPage = new MidiTestPage(page);

  await midiPage.goto();
  await midiPage.connectMidiDevice();

  await midiPage.sendMidiMessage([176, 43, 127]);
  await page.waitForTimeout(100); // Allow UI to update

  const open = await page.$eval('[data-testid="Cutoff"]', (el) => el.style.transform);
  await expect(open).toMatch(/rotate\(310deg\)/);

  await midiPage.sendMidiMessage([176, 43, 0]);
  await page.waitForTimeout(100); // Allow UI to update

  const closed = await page.$eval('[data-testid="Cutoff"]', (el) => el.style.transform);
  await expect(closed).toMatch(/rotate\(50deg\)/);
});
