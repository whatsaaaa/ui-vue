import { expect, test, type Page } from '@playwright/test'
import { colorModeOption, open, playground, resolveColor } from './pages.ts'

/*
 * The gallery's part in the other theme: a dark or light class on it puts what is inside it in
 * that theme, the tokens, the dark: and light: variants and Nuxt UI's colors alike.
 */

/** The part on show, and how it is drawn. */
async function shownPart(page: Page) {
  const part = page.getByTestId('theme-part').filter({ visible: true })
  await expect(part).toHaveCount(1)
  return part.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      class: element.classList.contains('dark') ? 'dark' : 'light',
      background: style.backgroundColor,
      nuxtUi: style.getPropertyValue('--ui-bg') === style.getPropertyValue('--ws-color-bg'),
      // drawn with the dark: and light: variants
      label: element.querySelector<HTMLElement>('p')!.innerText.replace(/\s+/g, ' ').trim(),
    }
  })
}

for (const colorScheme of ['dark', 'light'] as const) {
  const other = colorScheme === 'dark' ? 'light' : 'dark'

  test.describe(`on a ${colorScheme} system`, () => {
    test.use({ colorScheme })

    test(`the part is in the ${other} theme, and switches with the page`, async ({
      page,
    }, testInfo) => {
      test.skip(playground(testInfo) !== 'nuxt', 'The gallery has the part')
      await open(page)
      expect(await shownPart(page)).toEqual({
        class: other,
        background: await resolveColor(page, 'var(--ws-color-bg)', other),
        nuxtUi: true,
        label: `class="${other}", in the ${other} theme`,
      })

      // the page in the other theme, chosen with Nuxt UI's color mode
      await colorModeOption(page, other).click()
      await expect.poll(async () => (await shownPart(page)).class).toBe(colorScheme)
      expect(await shownPart(page)).toEqual({
        class: colorScheme,
        background: await resolveColor(page, 'var(--ws-color-bg)', colorScheme),
        nuxtUi: true,
        label: `class="${colorScheme}", in the ${colorScheme} theme`,
      })
    })
  })
}
