import { defineNuxtModule, extendPages, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'routing',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const isI18nEnabled = !!(nuxt.options.i18n && nuxt.options.i18n.locales && nuxt.options.i18n.locales.length > 0)

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
    })

    // might want to know about this stuff.
    if ((import.meta.dev || nuxt.options.dev) && !isI18nEnabled) {
      console.warn('[Site] I18N is not enabled - using default landing page without language prefix')
    }

    extendPages((pages) => {
      const landingTemplate = resolve('../app/templates/landing.vue')

      if (pages.some(p => p.name === (isI18nEnabled ? 'lang-index' : 'index'))) {
        if (import.meta.dev) console.warn('[Site] Duplicate landing page detected - skipping')
        return
      }
      if (isI18nEnabled) {
        pages.push({
          name: 'lang-index',
          path: '/:lang([a-zA-Z]{2})?',
          file: landingTemplate,
        })
      }
      else {
        pages.push({
          name: 'index',
          path: '/',
          file: landingTemplate,
        })
      }
    })
  },
})
