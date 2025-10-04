import { test, expect } from "@playwright/test";

test.describe("Panel Component Basic Visual Test", () => {
  test("Panel renders and takes initial snapshot", async ({ page }) => {
    // Navigate to the main page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Wait for the panel container to be visible
    await page.waitForSelector(".monologue-container", { state: "visible", timeout: 10000 });

    // Take a full page screenshot first to see the overall layout
    await expect(page).toHaveScreenshot("full-page-with-panel.png");

    // Then take a screenshot of just the panel
    const panelContainer = page.locator(".monologue-container");
    await expect(panelContainer).toBeVisible();
    await expect(panelContainer).toHaveScreenshot("panel-container-basic.png");
  });
});
