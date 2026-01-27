export default defineNuxtConfig({
  modules: ['nuxt-studio'],
  i18n: false,
  scs: {
    excludeContent: ['1.blog/'],
  },
  studio: {
    repository: {
      provider: 'github',
      owner: 'hareland',
      repo: 'simple-content-site',
      branch: 'main',
      rootDir: 'playground/minimal',
    },
  },
})
