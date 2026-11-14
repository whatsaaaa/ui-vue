import { expect, test } from '@playwright/test'
import { open, pageColor, reportsOf, resolveColor, themeState } from './pages.ts'

/** Nuxt UI's variables and the design system's roles they are pointed at. */
const BRIDGE = [
  ['--ui-bg', '--ws-color-bg'],
  ['--ui-bg-muted', '--ws-color-surface'],
  ['--ui-bg-elevated', '--ws-color-raised'],
  ['--ui-text', '--ws-color-text'],
  ['--ui-text-muted', '--ws-color-text-secondary'],
  ['--ui-text-dimmed', '--ws-color-text-faint'],
  ['--ui-border', '--ws-color-border'],
  ['--ui-border-accented', '--ws-color-field-border'],
  ['--ui-primary', '--ws-color-interactive'],
  ['--ui-success', '--ws-color-tip'],
  ['--ui-info', '--ws-color-note'],
  ['--ui-warning', '--ws-color-warning'],
  ['--ui-error', '--ws-color-danger'],
] as const

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`on a ${colorScheme} system`, () => {
    test.use({ colorScheme })

    test('loads without an error or a warning', async ({ page }) => {
      const reports = reportsOf(page)
      await open(page)
      expect(reports).toEqual([])
    })

    test('follows the system, and Nuxt UI reads the design system', async ({ page }) => {
      await open(page)
      expect(await themeState(page)).toEqual({
        theme: null,
        dark: colorScheme === 'dark',
        light: colorScheme === 'light',
      })
      expect(await pageColor(page)).toBe(await resolveColor(page, 'var(--ws-color-bg)'))
      for (const [ui, role] of BRIDGE) {
        expect(await resolveColor(page, `var(${ui})`), `${ui} is ${role}`).toBe(
          await resolveColor(page, `var(${role})`),
        )
      }
    })
  })
}

test('asks no other host for anything: the fonts and the icons are in the build', async ({
  page,
  baseURL,
}) => {
  const elsewhere: string[] = []
  page.on('request', (request) => {
    if (!request.url().startsWith(baseURL!) && !request.url().startsWith('data:'))
      elsewhere.push(request.url())
  })
  await open(page)
  await page.waitForLoadState('networkidle')
  expect(elsewhere).toEqual([])
})

test('the two themes differ', async ({ page }) => {
  await open(page)
  expect(await resolveColor(page, 'var(--ui-bg)', 'dark')).not.toBe(
    await resolveColor(page, 'var(--ui-bg)', 'light'),
  )
  expect(await resolveColor(page, 'var(--ui-primary)', 'dark')).not.toBe(
    await resolveColor(page, 'var(--ui-primary)', 'light'),
  )
})
