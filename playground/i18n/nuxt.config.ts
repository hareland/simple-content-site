export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', 'nuxt-studio'],
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
    excludeContent: ['*/1.blog/**'],
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
