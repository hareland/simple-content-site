import { defineNuxtModule, createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: {
    // todo: rename this module to fit it's purpose
    name: 'routing',
  },
  async setup(_options, nuxt) {
    console.log('content module setup -> Should bootstrap content?! or can i make it work from a separate content.config.ts?')
  },
})
