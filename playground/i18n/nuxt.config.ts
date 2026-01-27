export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', 'nuxt-studio'],
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
  studio: {
    // route: '/admin',
    repository: {
      provider: 'github',
      owner: 'hareland',
      repo: 'simple-content-site',
      branch: 'main',
      rootDir: 'playground/i18n',
      private: false,
    },
  },
})
