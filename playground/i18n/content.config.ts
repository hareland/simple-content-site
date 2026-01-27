import { defineContentConfig, defineCollection, type DefinedCollection } from '@nuxt/content'

import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

const locales = options.i18n?.locales || []

const collections: Record<string, DefinedCollection> = {}

for (const locale of locales) {
  const code = (typeof locale === 'string' ? locale : locale.code).replace('-', '_')

  collections[`blog_${code}`] = defineCollection({
    type: 'page',
    source: {
      cwd,
      include: `${code}/blog/**`,
      prefix: `/blog`,
    },
  })
}
export default defineContentConfig({
  collections,
})
