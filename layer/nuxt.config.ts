import { extendViteConfig, createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/config'),
    resolve('./modules/routing'),
    resolve('./modules/css'),
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/robots',
    'nuxt-og-image',
    () => {
      // Update @nuxt/content optimizeDeps options
      extendViteConfig((config) => {
        config.optimizeDeps ||= {}
        config.optimizeDeps.include ||= []
        config.optimizeDeps.include.push('@nuxt/content > slugify')
        config.optimizeDeps.include = config.optimizeDeps.include
          .map((id) => {
            return id
              .replace(/^@nuxt\/content > /, 'simple-content-site > @nuxt/content > ')
              // .replace(/^nuxt-studio > /, 'simple-content-site > nuxt-studio > ')
              // .replace(/^@nuxtjs\/i18n > /, 'simple-content-site > @nuxtjs/i18n > ')
          },
          )
      })
    },
  ],
  devtools: {
    enabled: true,
  },
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'diff', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml'],
        },
        remarkPlugins: {
          'remark-mdc': {
            options: {
              autoUnwrap: true,
            },
          },
        },
      },
    },
  },
  build: {
    transpile: ['simple-content-site'],
  },
  // future: {
  //   compatibilityVersion: 5,
  // },
  compatibilityDate: '2025-07-22',
  vite: {
    optimizeDeps: {
      include: [],
    },
    resolve: {
      dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@vue/shared'],
    },
  },
  icon: {
    provider: 'iconify',
  },
})
