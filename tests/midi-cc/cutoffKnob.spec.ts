import { test, expect, Page } from "@playwright/test";
import { MidiTestPage } from "./MidiTestPage";

test("has title", async ({ page }) => {
  await page.goto("localhost:3000");
  await expect(page).toHaveTitle(/Monolab - Korg Monologue Patch Manager/);
});

test("Tweak cutoff with mouse", async ({ page }) => {
  const midiPage = new MidiTestPage(page);
  await midiPage.goto();
  await midiPage.connectMidiDevice();

  const locator = page.getByTestId("Cutoff");
  const box = await locator.boundingBox();

  if (!box) throw new Error("Element not found or not visible");

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  const beforeTweak = await page.$eval('[data-testid="Cutoff"]', (el) => el.style.transform);
  await expect(beforeTweak).toMatch(/rotate\(180\.1\d+deg\)/);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 100, startY, { steps: 20 });
  await page.mouse.move(startX + 100, startY + 100, { steps: 20 });
  await page.mouse.up();
  const afterTweak = await page.$eval('[data-testid="Cutoff"]', (el) => el.style.transform);
  await expect(afterTweak).toMatch(/rotate\(310deg\)/);
  const messages = await midiPage.getMessages();
  expect(messages.length).toBeGreaterThan(0);
  const last = Array.from(messages.pop() ?? []);
  expect(last).toStrictEqual([176, 43, 127]);
});
