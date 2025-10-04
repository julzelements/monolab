import { test, expect } from "@playwright/test";

test.describe("Panel Component Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page which contains the Panel component
    await page.goto("/");

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");

    // Wait for the panel to be visible
    await page.waitForSelector(".monologue-container", { state: "visible" });
  });

  test("Panel component visual snapshot - default state", async ({ page }) => {
    // Get the panel container element
    const panelContainer = page.locator(".monologue-container");

    // Wait for all content to be loaded
    await expect(panelContainer).toBeVisible();

    // Take a screenshot of the entire panel
    await expect(panelContainer).toHaveScreenshot("panel-default-state.png");
  });

  test("Panel component visual snapshot - individual sections", async ({ page }) => {
    // Test each panel section individually for more granular comparison

    // Master section
    const masterSection = page.locator("#master");
    await expect(masterSection).toBeVisible();
    await expect(masterSection).toHaveScreenshot("panel-master-section.png");

    // VCO1 section
    const vco1Section = page.locator("#vco1");
    await expect(vco1Section).toBeVisible();
    await expect(vco1Section).toHaveScreenshot("panel-vco1-section.png");

    // VCO2 section
    const vco2Section = page.locator("#vco2");
    await expect(vco2Section).toBeVisible();
    await expect(vco2Section).toHaveScreenshot("panel-vco2-section.png");

    // Mixer section
    const mixerSection = page.locator("#mixer");
    await expect(mixerSection).toBeVisible();
    await expect(mixerSection).toHaveScreenshot("panel-mixer-section.png");

    // Filter section
    const filterSection = page.locator("#filter");
    await expect(filterSection).toBeVisible();
    await expect(filterSection).toHaveScreenshot("panel-filter-section.png");

    // EG/LFO section
    const egLfoSection = page.locator("#eglfo");
    await expect(egLfoSection).toBeVisible();
    await expect(egLfoSection).toHaveScreenshot("panel-eglfo-section.png");
  });

  test("Panel component visual snapshot - responsive breakpoints", async ({ page }) => {
    // Test different viewport sizes to ensure responsive design stability

    // Desktop view (default)
    await page.setViewportSize({ width: 1280, height: 800 });
    const panelDesktop = page.locator(".monologue-container");
    await expect(panelDesktop).toHaveScreenshot("panel-desktop-1280.png");

    // Large desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(panelDesktop).toHaveScreenshot("panel-desktop-1920.png");

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(panelDesktop).toHaveScreenshot("panel-tablet-768.png");

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(panelDesktop).toHaveScreenshot("panel-mobile-375.png");
  });
});
