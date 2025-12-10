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
      if (imports.some(i => i.name === 'useSiteI18n')) return

      imports.push({
        name: 'useSiteI18n',
        from: resolve('../app/composables/useSiteI18n'),
      })
    })

    // might want to know about this stuff.
    if ((import.meta.dev || nuxt.options.dev) && !isI18nEnabled) {
      console.warn('[Site] I18N is not enabled - using default landing page without language prefix')
    }

    extendPages((pages) => {
      const landingTemplate = resolve('../app/templates/landing.vue')

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
