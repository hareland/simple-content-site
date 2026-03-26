import { defineNuxtModule, createResolver, useNuxt } from '@nuxt/kit'

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
  hooks: {
    'nitro:config'(nitroConfig) {
      const nuxt = useNuxt()

      // @ts-expect-error this cannot be typed from sibling module...
      if (nuxt.options.runtimeConfig?.scs?.experimental?.prerender !== true) {
        return
      }

      const i18nOptions = nuxt.options.i18n

      const routes: string[] = []
      if (!i18nOptions) {
        routes.push('/')
      }
      else {
        routes.push(...(i18nOptions.locales?.map(locale => typeof locale === 'string' ? `/${locale}` : `/${locale.code}`) || []))
      }

      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
      nitroConfig.prerender.routes.push(...(routes || []))
    },
  },
})
