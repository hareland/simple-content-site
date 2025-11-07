export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', 'nuxt-studio'],
  i18n: {
    defaultLocale: 'en',
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'nb',
      name: 'Norsk',
    }],
  },
  studio: {
    route: '/admin',
    repository: {
      owner: 'hareland',
      repo: 'studio',
      branch: 'main',
      rootDir: 'playground/docus',
      private: false,
    },
  },
})
