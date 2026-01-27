import { defineNuxtModule, createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)
export default defineNuxtModule({
  meta: {
    // todo: rename this module to fit it's purpose
    name: 'routing',
  },
  async setup(_options, nuxt) {
    // Ensure useSiteI18n is available in the app
    nuxt.hook('imports:extend', (imports) => {
      const loadComposableIfNotFound = (composableName: string) => {
        if (imports.some(i => i.name === composableName)) return

        imports.push({
          name: composableName,
          from: resolve(`../app/composables/${composableName}`),
        })
      }

      loadComposableIfNotFound('useSiteI18n')
      loadComposableIfNotFound('useSiteHeader')
      loadComposableIfNotFound('useSiteFooter')
      loadComposableIfNotFound('useSitePage')
    })
  },
})
