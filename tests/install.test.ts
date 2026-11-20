import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

// An app installs Nuxt UI and the design system at the versions the package works with, its peer
// ranges: the latest of either can be a minor ahead of them
test.each(['README.md', 'packages/ui-vue/README.md'])(
  "the install command of %s names the package's peer ranges",
  (readme) => {
    const { peerDependencies: peers } = JSON.parse(
      readFileSync('packages/ui-vue/package.json', 'utf8'),
    )
    const command = /^pnpm add .*$/m.exec(readFileSync(readme, 'utf8'))?.[0]
    expect(command).toBe(
      `pnpm add @whatsaaaa/ui-vue '@whatsaaaa/design-system@${peers['@whatsaaaa/design-system']}' '@nuxt/ui@${peers['@nuxt/ui']}' tailwindcss`,
    )
  },
)
