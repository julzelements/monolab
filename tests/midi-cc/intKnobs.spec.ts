import { test, expect } from '@playwright/test';
import { MidiTestPage } from './MidiTestPage';

test.describe('INT Knobs - Envelope and LFO Intensity', () => {
  let midiTestPage: MidiTestPage;

  test.beforeEach(async ({ page }) => {
    midiTestPage = new MidiTestPage(page);
    await midiTestPage.goto();
    await midiTestPage.setupMockMIDI();
  });

  test.describe('Envelope INT Knob', () => {
    const knobSelector = '#eglfo .panel-group:nth-of-type(1) [data-testid="Int"]'; // EG INT knob
    const toggleSelector = '#eglfo .panel-group:nth-of-type(1) [data-testid="Int-invert-toggle"]';

    test('should start at center position (0 sysex)', async () => {
      const debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
      expect(debugInfo.isInverted).toBe(false);
      expect(parseFloat(debugInfo.degrees)).toBeCloseTo(50, 1); // Should be at minimum position
    });

    test('should toggle between NORM and INV states', async () => {
      // Start in NORM state
      let toggleText = await midiTestPage.page.locator(toggleSelector).textContent();
      expect(toggleText).toBe('NORM');

      // Click toggle to invert
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Should now be in INV state
      toggleText = await midiTestPage.page.locator(toggleSelector).textContent();
      expect(toggleText).toBe('INV');

      // Debug info should show inverted
      const debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.isInverted).toBe(true);
    });

    test('should handle minimum position correctly', async () => {
      // Test minimum in NORM mode (should be 0)
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
      expect(debugInfo.midiCC).toBe(64); // Center MIDI CC value

      // Toggle to INV mode
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Minimum in INV mode should still be 0
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
      expect(debugInfo.midiCC).toBe(64); // Still center MIDI CC value
    });

    test('should handle maximum position correctly', async () => {
      // Test maximum in NORM mode
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(511);
      expect(debugInfo.midiCC).toBe(127); // Maximum MIDI CC value

      // Reset to minimum, then toggle to INV mode
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Now test maximum in INV mode
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(-511);
      expect(debugInfo.midiCC).toBe(0); // Minimum MIDI CC value for inverted
    });

    test('should handle middle position correctly', async () => {
      // Test middle in NORM mode
      await midiTestPage.setKnobToPosition(knobSelector, 'mid');
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBeCloseTo(256, 10); // Roughly half of 511
      expect(debugInfo.midiCC).toBeCloseTo(95, 5); // Roughly 3/4 of 127

      // Reset to minimum, toggle to INV mode, then set to middle
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.page.locator(toggleSelector).click();
      await midiTestPage.setKnobToPosition(knobSelector, 'mid');
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBeCloseTo(-256, 10); // Roughly half of -511
      expect(debugInfo.midiCC).toBeCloseTo(32, 5); // Roughly 1/4 of 127
    });

    test('should send correct MIDI CC when rotated (NORM mode)', async () => {
      // Clear previous messages
      await midiTestPage.clearMIDIMessages();
      
      // Rotate from min to max in NORM mode
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.clearMIDIMessages();
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      // Should send EG_INT (CC 25) with value 127
      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egIntMessages = messages.filter(msg => msg.cc === 25);
      expect(egIntMessages.length).toBeGreaterThan(0);
      expect(egIntMessages[egIntMessages.length - 1].value).toBe(127);
    });

    test('should send correct MIDI CC when rotated (INV mode)', async () => {
      // Toggle to INV mode
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Clear previous messages and rotate from min to max
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.clearMIDIMessages();
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      // Should send EG_INT (CC 25) with value 0 (inverted maximum)
      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const egIntMessages = messages.filter(msg => msg.cc === 25);
      expect(egIntMessages.length).toBeGreaterThan(0);
      expect(egIntMessages[egIntMessages.length - 1].value).toBe(0);
    });
  });

  test.describe('LFO INT Knob', () => {
    const knobSelector = '#eglfo .panel-group:nth-of-type(2) [data-testid="Int"]'; // LFO INT knob
    const toggleSelector = '#eglfo .panel-group:nth-of-type(2) [data-testid="Int-invert-toggle"]';

    test('should start at center position (0 sysex)', async () => {
      const debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
      expect(debugInfo.isInverted).toBe(false);
      expect(parseFloat(debugInfo.degrees)).toBeCloseTo(50, 1); // Should be at minimum position
    });

    test('should toggle between NORM and INV states', async () => {
      // Start in NORM state
      let toggleText = await midiTestPage.page.locator(toggleSelector).textContent();
      expect(toggleText).toBe('NORM');

      // Click toggle to invert
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Should now be in INV state
      toggleText = await midiTestPage.page.locator(toggleSelector).textContent();
      expect(toggleText).toBe('INV');

      // Debug info should show inverted
      const debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.isInverted).toBe(true);
    });

    test('should handle maximum position correctly', async () => {
      // Test maximum in NORM mode
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(511);
      expect(debugInfo.midiCC).toBe(127); // Maximum MIDI CC value

      // Reset to minimum, then toggle to INV mode
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Now test maximum in INV mode
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(-511);
      expect(debugInfo.midiCC).toBe(0); // Minimum MIDI CC value for inverted
    });

    test('should send correct MIDI CC when rotated (NORM mode)', async () => {
      // Clear previous messages
      await midiTestPage.clearMIDIMessages();
      
      // Rotate from min to max in NORM mode
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.clearMIDIMessages();
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      // Should send LFO_INT (CC 26) with value 127
      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoIntMessages = messages.filter(msg => msg.cc === 26);
      expect(lfoIntMessages.length).toBeGreaterThan(0);
      expect(lfoIntMessages[lfoIntMessages.length - 1].value).toBe(127);
    });

    test('should send correct MIDI CC when rotated (INV mode)', async () => {
      // Toggle to INV mode
      await midiTestPage.page.locator(toggleSelector).click();
      
      // Clear previous messages and rotate from min to max
      await midiTestPage.setKnobToPosition(knobSelector, 'min');
      await midiTestPage.clearMIDIMessages();
      await midiTestPage.setKnobToPosition(knobSelector, 'max');
      
      // Should send LFO_INT (CC 26) with value 0 (inverted maximum)
      const messages = await midiTestPage.getOutgoingMIDIMessages();
      const lfoIntMessages = messages.filter(msg => msg.cc === 26);
      expect(lfoIntMessages.length).toBeGreaterThan(0);
      expect(lfoIntMessages[lfoIntMessages.length - 1].value).toBe(0);
    });
  });

  test.describe('MIDI Input to INT Knobs', () => {
    test('should respond to incoming EG_INT MIDI CC messages', async () => {
      const knobSelector = '#eglfo .panel-group:nth-of-type(1) [data-testid="Int"]';
      
      // Send MIDI CC 25 (EG_INT) with value 127 (max positive)
      await midiTestPage.sendMIDICC(25, 127);
      await midiTestPage.page.waitForTimeout(100);
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(511);
      expect(debugInfo.midiCC).toBe(127);
      
      // Send MIDI CC 25 with value 0 (max negative/inverted)
      await midiTestPage.sendMIDICC(25, 0);
      await midiTestPage.page.waitForTimeout(100);
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(-512);
      expect(debugInfo.isInverted).toBe(true);
      
      // Send MIDI CC 25 with value 64 (center)
      await midiTestPage.sendMIDICC(25, 64);
      await midiTestPage.page.waitForTimeout(100);
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
    });

    test('should respond to incoming LFO_INT MIDI CC messages', async () => {
      const knobSelector = '#eglfo .panel-group:nth-of-type(2) [data-testid="Int"]';
      
      // Send MIDI CC 26 (LFO_INT) with value 127 (max positive)
      await midiTestPage.sendMIDICC(26, 127);
      await midiTestPage.page.waitForTimeout(100);
      
      let debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(511);
      expect(debugInfo.midiCC).toBe(127);
      
      // Send MIDI CC 26 with value 0 (max negative/inverted)
      await midiTestPage.sendMIDICC(26, 0);
      await midiTestPage.page.waitForTimeout(100);
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(-512);
      expect(debugInfo.isInverted).toBe(true);
      
      // Send MIDI CC 26 with value 64 (center)
      await midiTestPage.sendMIDICC(26, 64);
      await midiTestPage.page.waitForTimeout(100);
      
      debugInfo = await midiTestPage.getKnobDebugInfo(knobSelector);
      expect(debugInfo.sysex).toBe(0);
    });
  });
});