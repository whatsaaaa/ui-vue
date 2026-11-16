import { themeColorMeta } from '@whatsaaaa/design-system/theme/meta'

const tags = themeColorMeta
  .map(({ name, content, media }) => `<meta name="${name}" content="${content}" media="${media}">`)
  .join('')

// The browser's bars take the theme's background in the page as sent, for a visitor without
// JavaScript and a link preview: on every page, 200.html and 404.html included, and first in the
// <head>, before the scripts that set the theme. The head script keeps the tags at the theme
// shown from then on, so they stay out of Nuxt's head, which would put back the colors as sent
// once the app hydrates.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.unshift(tags)
  })
})
