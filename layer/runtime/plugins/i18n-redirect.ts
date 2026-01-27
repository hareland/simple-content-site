// @ts-expect-error This is a virtual import that is done in the consuming app.
import { defineNuxtPlugin, useNuxtApp, addRouteMiddleware, useCookie, navigateTo } from '#imports'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  const i18nConfig = nuxtApp.$config.public.i18n
  if (!i18nConfig || i18nConfig?.locales?.length === 0) {
    console.warn('[I18N] No locales defined in config - skipping redirect middleware')
    return
  }

  addRouteMiddleware((to) => {
    if (to.path === '/') {
      // @ts-expect-error Typed expose strategy
      if (false) {
        console.log(`[I18N] Redirecting to default locale using ${i18nConfig.strategy}`)
      }
      const cookieLocale = useCookie('i18n_redirected').value || i18nConfig?.defaultLocale || 'en'

      return navigateTo(`/${cookieLocale}`)
    }
  })
})
