import { defineConfig } from 'oxfmt'
import whatsaaaa from '@whatsaaaa/format-config/oxfmt'

export default defineConfig({
  ...whatsaaaa,
  // Copier writes .copier-answers.yml, wrapping a long answer at 80 columns, and rewrites it on
  // every update
  ignorePatterns: ['pnpm-lock.yaml', '.github/assets', '.copier-answers.yml'],
})
