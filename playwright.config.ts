import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, ENV } from './utils/environnement';

console.log(`Environnement : ${ENV.toUpperCase()} → ${BASE_URL}`);

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
    baseURL: BASE_URL,          // URL de l'environnement choisi (QA, PP ou PROD)
    locale: 'en-US',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
