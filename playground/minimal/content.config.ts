import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: {
        include: '1.blog/**/*.md',
      },
    }),
  },
})
