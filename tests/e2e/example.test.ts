import { test, expect } from '@playwright/test'

test.describe('Basic E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    // Just check that something rendered
    const body = await page.locator('body')
    await expect(body).toBeVisible()
  })
})