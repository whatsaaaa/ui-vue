import { en } from '@nuxt/ui/locale'

/**
 * Serbian in Latin script, for what the gallery's components say themselves. Nuxt UI has no
 * Serbian locale: this takes the English one and puts in what these components use.
 */
export const sr = extendLocale(en, {
  name: 'Srpski',
  code: 'sr-Latn',
  messages: {
    modal: { close: 'Zatvori' },
    selectMenu: {
      create: 'Dodaj „{label}“',
      noData: 'Nema podataka',
      noMatch: 'Nema poklapanja',
      search: 'Pretraga…',
    },
    table: { noData: 'Nema podataka' },
  },
})
