import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,

  // Toutes les SORTIES sont regroupées dans output/
  outputDir: 'output/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'output/rapport-html', open: 'never' }],
    ['junit', { outputFile: 'output/junit.xml' }],
    ['json', { outputFile: 'output/playwright-results.json' }],
  ],

  use: {
    locale: 'en-US',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
