import { createResolver, defineNuxtModule, addPlugin, logger } from '@nuxt/kit'
import { defu } from 'defu'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { inferSiteURL, getPackageJsonMetadata } from '../utils/meta'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'

interface SimpleContentSiteOptions {
  excludeContent?: string[]
  experimental?: {
    prerender?: boolean
  }
}

const log = logger.withTag('SimpleContentSite')

export default defineNuxtModule<SimpleContentSiteOptions>({
  meta: {
    name: 'scs',
  },
  defaults: {
    excludeContent: [],
    experimental: {
      prerender: false,
    },
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()
    const siteName = (typeof nuxt.options.site === 'object' && nuxt.options.site?.name) || meta.name || gitInfo?.name || ''

    nuxt.options.site = defu(nuxt.options.site, {
      url,
      name: siteName,
      debug: false,
    })

    nuxt.options.appConfig.header = defu(nuxt.options.appConfig.header, {
      title: siteName,
    })

    nuxt.options.appConfig.seo = defu(nuxt.options.appConfig.seo, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || '',
    })

    nuxt.options.appConfig.github = defu(nuxt.options.appConfig.github, {
      owner: gitInfo?.owner,
      name: gitInfo?.name,
      url: gitInfo?.url,
      branch: getGitBranch(),
    })

    // ...
    nuxt.options.i18n = defu(nuxt.options.i18n, {
      strategy: 'prefix_except_default',
    }) as typeof nuxt.options.i18n

    // ensure we redirect from index if the strategy requires.

    // todo: exposing the strategy like this might cause issues in the future.
    //  So it will be better to expose the i18n redirect plugin instead from a module.
    nuxt.options.runtimeConfig.public.i18n = defu(nuxt.options.runtimeConfig.public.i18n, {
      strategy: (nuxt.options.i18n ? nuxt.options.i18n.strategy : undefined) || 'prefix_except_default',
    })

    const i18nStrategy = nuxt.options.runtimeConfig.public.i18n.strategy as string

    if (i18nStrategy && !['prefix_except_default', 'no_prefix'].includes(i18nStrategy)) {
      console.log(`[I18n] Adding redirect plugin for root since strategy is: ${i18nStrategy}`)
      addPlugin({
        src: resolve('../runtime/plugins/i18n-redirect'),
        mode: 'client',
      })
    }

    if (nuxt.options.i18n && nuxt.options.i18n.locales) {
      const { resolve } = createResolver(import.meta.url)

      // Filter locales to only include existing ones
      const filteredLocales = nuxt.options.i18n.locales.filter((locale) => {
        const localeCode = typeof locale === 'string' ? locale : locale.code

        // Check for JSON locale file
        const localeFilePath = resolve('../i18n/locales', `${localeCode}.json`)
        const hasLocaleFile = existsSync(localeFilePath)

        // Check for content folder
        const contentPath = join(nuxt.options.rootDir, 'content', localeCode)
        const hasContentFolder = existsSync(contentPath)

        if (!hasLocaleFile) {
          log.warn(`Locale file not found: ${localeCode}.json - skipping locale "${localeCode}"`)
        }

        if (!hasContentFolder) {
          log.warn(`Content folder not found: content/${localeCode}/ - skipping locale "${localeCode}"`)
        }

        return hasLocaleFile && hasContentFolder
      })

      // Expose filtered locales
      nuxt.options.runtimeConfig.public.scs = {
        filteredLocales,
      }

      // @ts-expect-error This is messed up...
      nuxt.hook('i18n:registerModule', (register: never) => {
        const langDir = resolve('../i18n/locales')

        const locales = filteredLocales?.map((locale) => {
          return typeof locale === 'string'
            ? {
                code: locale,
                name: locale,
                file: `${locale}.json`,
              }
            : {
                code: locale.code,
                name: locale.name || locale.code,
                file: `${locale.code}.json`,
              }
        })

        // @ts-expect-error This is amessed up too
        register({
          langDir,
          locales,
        })
      })
    }
  },
})
