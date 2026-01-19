export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  const i18nConfig = nuxtApp.$config.public.i18n
  if (!i18nConfig || i18nConfig?.locales?.length === 0) {
    return
  }

  // todo: This could probably be injected by a module that has access to the nuxtApp.,
  const withoutRedirect = ['no_prefix', 'prefix_except_default']
  // @ts-expect-error This is not typed, but might need to move this config later.
  if (i18nConfig.strategy && withoutRedirect.includes(i18nConfig.strategy)) {
    return
  }

  addRouteMiddleware((to) => {
    if (to.path === '/') {
      if (import.meta.dev) {
        // @ts-expect-error Typed expose strategy
        console.log(`[I18N] Redirecting to default locale using ${i18nConfig.strategy}`)
      }
      const cookieLocale = useCookie('i18n_redirected').value || i18nConfig?.defaultLocale || 'en'

      return navigateTo(`/${cookieLocale}`)
    }
  })
})
