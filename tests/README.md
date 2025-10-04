# Visual Testing with Playwright

This directory contains Playwright visual regression tests for the Monologue Panel UI components.

## Setup

The Playwright configuration is already set up in `playwright.config.ts`. The tests will automatically start the development server and run against `http://localhost:3000`.

## Running Tests

### Basic Visual Tests

```bash
# Run just the basic panel visual test
npm run test:visual

# Run all Playwright tests
npm run test:playwright

# Run tests with UI mode (interactive)
npm run test:playwright:ui

# Run tests in headed mode (see browser)
npm run test:playwright:headed
```

### Updating Snapshots

When you make intentional changes to the Panel UI and need to update the reference images:

```bash
# Update all visual snapshots
npm run test:visual:update

# Update specific test snapshots
npx playwright test tests/panel-basic.spec.ts --update-snapshots
```

## Test Files

### `panel-basic.spec.ts`

- Simple baseline test for Panel component
- Takes full page and panel container screenshots
- Good starting point for visual regression testing

### `panel-visual.spec.ts`

- Comprehensive visual testing suite
- Tests individual panel sections
- Tests responsive breakpoints
- Tests interactive states (hover, focus)
- Tests different viewport sizes
- Tests debug mode states

## Visual Testing Strategy

The visual tests are designed to:

1. **Catch Unintended Changes**: Ensure CSS changes don't break the panel layout
2. **Test Responsive Design**: Verify the panel looks correct at different screen sizes
3. **Test Component States**: Capture different interaction states (hover, active, etc.)
4. **Test Browser Consistency**: Ensure the panel renders consistently across browsers

## Best Practices

1. **Run Tests Before CSS Changes**: Always run `npm run test:visual` before making styling changes
2. **Update Snapshots Carefully**: Only update snapshots when you've intentionally changed the UI
3. **Review Diffs**: When tests fail, review the visual diffs to understand what changed
4. **Test Across Viewports**: The tests include multiple viewport sizes to catch responsive issues

## Snapshot Storage

Visual snapshots are stored in:

- `tests/panel-basic.spec.ts-snapshots/`
- `tests/panel-visual.spec.ts-snapshots/`

These directories contain the reference images that new screenshots are compared against.

## CI/CD Integration

These tests are configured to work in CI environments. The configuration includes:

- Retry logic for flaky tests
- Optimized settings for headless execution
- Threshold settings for acceptable visual differences

## Troubleshooting

### Tests are flaky

- Increase wait times in the test
- Use `waitForLoadState('networkidle')` to ensure page is fully loaded
- Add explicit waits for dynamic content

### Visual differences in CI

- Check if fonts are loading correctly
- Verify CSS custom properties are being applied
- Consider browser-specific rendering differences

### Large diff files

- Check if animations are disabled in test environment
- Verify consistent viewport sizes
- Look for timing-dependent UI changes
