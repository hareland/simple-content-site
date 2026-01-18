export default defineNuxtConfig({
  modules: ['nuxt-studio'],
  i18n: false,
  studio: {
    // route: '/admin',
    repository: {
      owner: 'hareland',
      repo: 'simple-content-site',
      branch: 'main',
      rootDir: 'playground/minimal',
    },
  },
})
