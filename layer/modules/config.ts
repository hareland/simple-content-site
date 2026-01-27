import { createResolver, defineNuxtModule, addPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { inferSiteURL, getPackageJsonMetadata } from '../utils/meta'
import { getGitBranch, getGitEnv, getLocalGitInfo } from '../utils/git'

export default defineNuxtModule({
  meta: {
    name: 'config',
  },
  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir
    const url = inferSiteURL()
    const meta = await getPackageJsonMetadata(dir)
    const gitInfo = await getLocalGitInfo(dir) || getGitEnv()
    const siteName = nuxt.options?.site?.name || meta.name || gitInfo?.name || ''

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

    /**
     * I18n
     */
    if (nuxt.options.i18n && nuxt.options.i18n.locales) {
      const { resolve } = createResolver(import.meta.url)
      const { resolve: resolveRoot } = createResolver(dir)

      const getLocaleCode = (locale: string | { code: string }) => typeof locale === 'string' ? locale : locale.code

      const fileNamesForLocale = (locale: string | { code: string }) => {
        const localeCode = getLocaleCode(locale)
        return [
          `${localeCode}.json`,
          // `${localeCode}.ts|.mjs`,
        ]
      }

      // Filter locales to only include existing ones
      const filteredLocales = nuxt.options.i18n.locales.filter((locale) => {
        const localeCode = getLocaleCode(locale)

        // Check for JSON locale file
        const possibleLocaleFiles = fileNamesForLocale(locale)
        const hasAnyLocaleFile = possibleLocaleFiles.some((fileName) => {
          return existsSync(resolve('../i18n/locales', fileName)) || existsSync(resolveRoot('i18n/locales', fileName))
        })

        // Ensure we have a folder for the pages for this locale
        // - otherwise there is no point in enabling it.
        const contentPath = join(nuxt.options.rootDir, 'content', localeCode)
        const hasContentFolder = existsSync(contentPath)

        if (!hasAnyLocaleFile) {
          console.warn(`[Site] Locale file not found: ${possibleLocaleFiles.join('| ')} - skipping locale "${localeCode}"`)
        }

        if (!hasContentFolder) {
          console.warn(`[Site] Content folder not found: content/${localeCode}/ - skipping locale "${localeCode}"`)
        }

        return hasContentFolder && hasAnyLocaleFile
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

      nuxt.hook('i18n:registerModule', (register) => {
        const langDir = resolve('../i18n/locales')

        //
        const locales = filteredLocales?.map((locale) => {
          // Possibly load custom translations.
          const localeCode = getLocaleCode(locale)
          const customLocaleFiles = fileNamesForLocale(locale).map(f => ([
            resolveRoot('i18n/locales', f),
            resolve('../i18n/locales', f),
          ])).flat().filter(p => existsSync(p))

          // ensure we can use all files in the consuming app.
          const files = [
            ...customLocaleFiles,
            `${localeCode}.json`, // default: this gets the lowest priority
          ]

          //
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

        //
        register({
          langDir,
          locales,
        })
      })
    }
  },
})
