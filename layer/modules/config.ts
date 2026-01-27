import { createResolver, defineNuxtModule, addPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { inferSiteURL, getPackageJsonMetadata } from '../utils/meta'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'

interface SimpleContentSiteOptions {
  excludeContent?: string[]
}

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<SimpleContentSiteOptions>({
  meta: {
    name: 'scs',
  },
  defaults: {
    excludeContent: [],
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()
    // @ts-expect-error This is not typed.
    const siteName = nuxt.options?.site?.name || meta.name || gitInfo?.name || ''

    // nuxt.options.llms = defu(nuxt.options.llms, {
    //   domain: url,
    //   title: siteName,
    //   description: meta.description || '',
    //   full: {
    //     title: siteName,
    //     description: meta.description || '',
    //   },
    // })

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

    /*
        ** I18N
        */
    if (nuxt.options.i18n && nuxt.options.i18n.locales) {
      const { resolve: resolveRoot } = createResolver(dir)

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
          console.warn(`[Site] Locale file not found: ${localeCode}.json - skipping locale "${localeCode}"`)
        }

        if (!hasContentFolder) {
          console.warn(`[Site] Content folder not found: content/${localeCode}/ - skipping locale "${localeCode}"`)
        }

        return hasLocaleFile && hasContentFolder
      })

      //
      nuxt.options.i18n = defu(nuxt.options.i18n, {
        strategy: 'prefix_except_default',
      }) as typeof nuxt.options.i18n

      // todo: exposing the strategy like this might cause issues in the future.
      //  So it will be better to expose the i18n redirect plugin instead from a module.
      nuxt.options.runtimeConfig.public.i18n = defu(nuxt.options.runtimeConfig.public.i18n, {
        strategy: nuxt.options.i18n.strategy,
      })

      // Expose filtered locales
      nuxt.options.runtimeConfig.public.Site = {
        filteredLocales,
      }

      // ensure we redirect from index if the strategy requires.
      if (nuxt.options.i18n.strategy && !['prefix_except_default', 'no_prefix'].includes(nuxt.options.i18n.strategy)) {
        console.log(`[I18n] Adding redirect plugin for root since strategy is: ${nuxt.options.i18n.strategy}`)
        addPlugin({
          src: resolve('../runtime/plugins/i18n-redirect'),
          mode: 'client',
        })
      }

      // @ts-expect-error This is not properly typed after updates.
      nuxt.hook('i18n:registerModule', (register) => {
        const langDir = resolve('../i18n/locales')

        const locales = filteredLocales?.map((locale) => {
          // Possibly load custom translations.
          const localeCode = typeof locale === 'string' ? locale : locale.code
          const customLocalePath = resolveRoot('i18n/locales', `${localeCode}.json`)
          const hasCustomLocale = existsSync(customLocalePath)
          const files = hasCustomLocale ? [customLocalePath, `${localeCode}.json`] : [`${localeCode}.json`]
          return typeof locale === 'string'
            ? {
                code: locale,
                name: locale,
                files,
              }
            : {
                code: locale.code,
                name: locale.name || locale.code,
                files,
              }
        })

        register({
          langDir,
          locales,
        })
      })
    }
  },
})
