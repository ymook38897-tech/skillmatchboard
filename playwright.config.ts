import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

const fakeMicrophonePath = path
  .resolve('tests/fixtures/fake-microphone.wav')
  .replaceAll('\\', '/')

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 110_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173/skillmatchboard/',
    viewport: { width: 800, height: 1280 },
    permissions: ['microphone'],
    launchOptions: {
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        `--use-file-for-fake-audio-capture=${fakeMicrophonePath}`,
      ],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 800, height: 1280 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173/skillmatchboard/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      VITE_API_BASE_URL: 'https://job-db-api.onrender.com',
    },
  },
})
