import { expect, type Locator, type Page } from '@playwright/test'
import { open } from './pages.ts'

/*
 * Forced colors, Windows' contrast themes, take box shadows away and paint every background in
 * the page color. Nuxt UI draws edges with ring, a box shadow, and icons as masks over their
 * background, so the stylesheet draws both again in the system's colors, for every component:
 * a part with a ring has an outline, and every icon is painted. These read the parts of a page
 * as the browser draws them in forced colors.
 */

declare global {
  interface Window {
    /**
     * A system color as the browser paints it where the element is: in its color scheme, which
     * the part of the gallery in the other theme changes.
     */
    systemColor(near: Element, name: string): string
    /** Whether an element has a solid border on every side, in a color other than the page's. */
    hasBorder(element: Element): boolean
    /**
     * Whether an element has an edge: such a border, or a solid outline in a color other than
     * the page's.
     */
    hasEdge(element: Element): boolean
    /** Where an element is, and which part it is, for a finding. */
    partOf(element: Element): Pick<Finding, 'where' | 'slot'>
  }
}

/** What is wrong with a part of a page. */
export interface Finding {
  /**
   * The component the part belongs to: the example it is in on the page of the others, the
   * section it is in on the gallery.
   */
  where: string | null
  /** The part, by its data-slot, or by its element where it has none. */
  slot: string
  detail: string
}

/** Opens a page of the playground, the gallery unless another is named, with the helpers above. */
export async function openWithSystemColors(page: Page, path = '/'): Promise<void> {
  await page.addInitScript(() => {
    window.systemColor = (near, name) => {
      const probe = document.createElement('span')
      probe.style.position = 'absolute'
      probe.style.backgroundColor = name
      near.append(probe)
      const color = getComputedStyle(probe).backgroundColor
      probe.remove()
      return color
    }
    window.hasBorder = (element) => {
      const style = getComputedStyle(element)
      const page = window.systemColor(element, 'Canvas')
      return ['top', 'right', 'bottom', 'left'].every(
        (side) =>
          parseFloat(style.getPropertyValue(`border-${side}-width`)) >= 1 &&
          style.getPropertyValue(`border-${side}-style`) === 'solid' &&
          style.getPropertyValue(`border-${side}-color`) !== page,
      )
    }
    window.hasEdge = (element) => {
      const style = getComputedStyle(element)
      return (
        window.hasBorder(element) ||
        (parseFloat(style.outlineWidth) >= 1 &&
          style.outlineStyle === 'solid' &&
          style.outlineColor !== window.systemColor(element, 'Canvas'))
      )
    }
    window.partOf = (element) => ({
      where:
        element.closest<HTMLElement>('[data-sample]')?.dataset.sample ??
        element.closest('section[id]')?.id ??
        null,
      slot: element.closest<HTMLElement>('[data-slot]')?.dataset.slot ?? element.localName,
    })
  })
  await open(page, path)
}

/**
 * Ends the transitions on their way, before a color is read: a state that has just changed has a
 * color between two until then, and so has an icon whose style has just come.
 */
export function settle(page: Page): Promise<void> {
  return page.evaluate(() => {
    for (const animation of document.getAnimations())
      if ('transitionProperty' in animation) animation.finish()
  })
}

/**
 * Every part with a ring has an edge: a border or an outline. The ring is still in Tailwind's
 * variable when forced colors drop the shadow.
 */
export async function edges(within: Locator): Promise<Finding[]> {
  await settle(within.page())
  return within.evaluate((root) => {
    const findings: Finding[] = []
    for (const element of [root, ...root.querySelectorAll<HTMLElement>('*')]) {
      const style = getComputedStyle(element)
      // a ring is "0 0 0 calc(<width> + <offset>) <color>", and none is "0 0 #0000"
      const ring = style.getPropertyValue('--tw-ring-shadow').trim()
      if (!/calc\((?!0px)/.test(ring) || /(#0000|transparent)$/.test(ring)) continue
      const box = element.getBoundingClientRect()
      if (box.width <= 2 || box.height <= 2 || !element.checkVisibility()) continue
      if (!window.hasEdge(element))
        findings.push({
          ...window.partOf(element),
          detail: `${element.getAttribute('class')?.slice(0, 60)}: border ${style.borderWidth} ${style.borderStyle} ${style.borderColor}, outline ${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`,
        })
    }
    return findings
  })
}

/**
 * Every icon is painted in a color other than the one behind it. An icon drawn as a mask is its
 * background; one drawn as an image, as an icon in several colors is, has the image and no fill
 * behind it; one drawn as an SVG, on Vue, is its text color, with nothing behind it.
 */
export async function icons(within: Locator): Promise<Finding[]> {
  // Nuxt UI adds an icon's style to the page as the icon is first drawn, a moment after it
  await expect
    .poll(() =>
      within.evaluate(
        (root) =>
          [...root.querySelectorAll<HTMLElement>('.iconify:not(svg)')].filter((icon) => {
            const style = getComputedStyle(icon)
            return (
              icon.checkVisibility() &&
              style.maskImage === 'none' &&
              style.backgroundImage === 'none'
            )
          }).length,
      ),
    )
    .toBe(0)
  await settle(within.page())
  return within.evaluate((root) => {
    const findings: Finding[] = []
    const transparent = 'rgba(0, 0, 0, 0)'
    const behind = (element: Element) => {
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const color = getComputedStyle(parent).backgroundColor
        if (color !== transparent) return color
      }
      return window.systemColor(element, 'Canvas')
    }
    for (const icon of root.querySelectorAll<HTMLElement | SVGElement>('.iconify')) {
      if (!icon.checkVisibility() || icon.getBoundingClientRect().width === 0) continue
      const style = getComputedStyle(icon)
      const finding = (detail: string) =>
        findings.push({
          ...window.partOf(icon),
          detail: `${icon.getAttribute('class')}: ${detail}`,
        })
      if (icon instanceof SVGElement) {
        if (style.backgroundColor !== transparent)
          finding(`a fill behind it, ${style.backgroundColor}`)
        if (style.color === behind(icon)) finding(`painted ${style.color}`)
      } else if (style.maskImage === 'none') {
        if (style.backgroundImage === 'none') finding('no image')
        if (style.backgroundColor !== transparent)
          finding(`a fill behind it, ${style.backgroundColor}`)
      } else if ([transparent, behind(icon)].includes(style.backgroundColor))
        finding(`painted ${style.backgroundColor}`)
    }
    return findings
  })
}

/**
 * Whether two elements are painted alike: every pixel of each has one like it in the other, at
 * its place or within two pixels of it. An edge that falls between two pixels is smoothed
 * otherwise from one place on the page to another, which is not a difference: a mark of a state
 * is wider than that.
 */
export async function alike(page: Page, one: Locator, other: Locator): Promise<boolean> {
  const images: string[] = []
  for (const locator of [one, other]) {
    // on whole pixels, so that the two are smoothed alike, the text in them too
    await locator.evaluate((element: HTMLElement) => {
      const { left, top } = element.getBoundingClientRect()
      element.style.translate = `${Math.round(left) - left}px ${Math.round(top) - top}px`
    })
    const image = await locator.screenshot({ animations: 'disabled', scale: 'css' })
    await locator.evaluate((element: HTMLElement) => element.style.removeProperty('translate'))
    images.push(image.toString('base64'))
  }
  return page.evaluate(async (images) => {
    const [a, b] = await Promise.all(
      images.map(async (png) => {
        const bytes = Uint8Array.from(atob(png), (character) => character.charCodeAt(0))
        const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
        const canvas = new OffscreenCanvas(image.width, image.height).getContext('2d')!
        canvas.drawImage(image, 0, 0)
        return canvas.getImageData(0, 0, image.width, image.height)
      }),
    )
    // an element between two pixels is a pixel wider or taller in one image than in the other
    if (Math.abs(a!.width - b!.width) > 1 || Math.abs(a!.height - b!.height) > 1) return false
    const like = (from: ImageData, to: ImageData, x: number, y: number) => {
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) {
          const [nx, ny] = [x + dx, y + dy]
          if (nx < 0 || ny < 0 || nx >= to.width || ny >= to.height) continue
          const [i, j] = [(y * from.width + x) * 4, (ny * to.width + nx) * 4]
          if ([0, 1, 2].every((c) => Math.abs(from.data[i + c]! - to.data[j + c]!) < 64))
            return true
        }
      return false
    }
    const within = (from: ImageData, to: ImageData) => {
      for (let y = 0; y < from.height; y++)
        for (let x = 0; x < from.width; x++) if (!like(from, to, x, y)) return false
      return true
    }
    return within(a!, b!) && within(b!, a!)
  }, images)
}
