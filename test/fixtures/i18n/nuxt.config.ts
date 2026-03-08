export default defineNuxtConfig({
  extends: ['../../../layer/'],
  modules: ['@nuxtjs/i18n'],
  experimental: {
    asyncContext: true,
  },
  compatibilityDate: '2025-07-22',
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'nb',
      name: 'Norsk',
    }],
  },
  scs: {
    excludeContent: ['*/blog/**'],
  },
})
