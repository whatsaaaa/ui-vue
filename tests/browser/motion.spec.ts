import { expect, test } from '@playwright/test'
import { open, playground } from './pages.ts'

/*
 * Motion runs on the design system's tokens, and only for a reader who has not asked for less:
 * colors change at once, and a list that opens fades in place instead of growing.
 */

/** A CSS time in milliseconds: the browser can write 120ms as 0.12s. */
const milliseconds = (time: string) =>
  time.trim().endsWith('ms') ? parseFloat(time) : parseFloat(time) * 1000

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion })

    test('a button changes color at the fast duration, or at once', async ({ page }) => {
      await open(page)
      const button = page.getByRole('button', { name: 'Prijavi se' }).first()
      const transition = await button.evaluate((element) => {
        const style = getComputedStyle(element)
        return { property: style.transitionProperty, duration: style.transitionDuration }
      })
      const fast = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--ws-motion-duration-fast'),
      )
      if (reducedMotion === 'reduce') expect(transition.property).toBe('none')
      else {
        expect(transition.property).toContain('color')
        expect(milliseconds(transition.duration)).toBe(milliseconds(fast))
      }
    })

    test('an open list grows, or only fades', async ({ page }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The list is in the gallery')
      await open(page)
      await page.getByTestId('select-days').click()
      const list = page.getByRole('listbox')
      await expect(list).toBeVisible()
      const animation = await page.evaluate(() => {
        const content = document.querySelector('[role=listbox]')!.closest('[data-state]')!
        return getComputedStyle(content).animationName
      })
      expect(animation).toBe(reducedMotion === 'reduce' ? 'fade-in' : 'scale-in')
    })
  })
}
