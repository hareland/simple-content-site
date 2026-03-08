import type { Collections, PagesCollectionItem } from '@nuxt/content'
import { kebabCase } from 'scule'
import { joinURL, withLeadingSlash } from 'ufo'

export const useSitePage = () => {
  const { locale, isEnabled, defaultLocale, strategy } = useSiteI18n()

  const collectionName = computed<keyof Collections>(() => {
    if (!isEnabled.value || !defaultLocale.value || !locale.value) {
      return 'pages' as keyof Collections
    }
    return `pages_${locale.value}` as keyof Collections
  })

  const getKeyForPath = (path: string) => {
    const prefix = toValue(collectionName.value).replaceAll('_', '-')
    const suffix = kebabCase(withLeadingSlash(path).replaceAll('/', '--'))
    return `${prefix}:${suffix}`
  }

  const findByPath = async (path: string) => {
    if (isEnabled.value && strategy.value === 'prefix_except_default' && locale.value === defaultLocale.value) {
      const localePrefix = withLeadingSlash(locale.value)
      if (path !== localePrefix && !path.startsWith(`${localePrefix}/`)) {
        path = joinURL(localePrefix, path)
      }
    }
    return await queryCollection(collectionName.value).path(withLeadingSlash(path)).first() as PagesCollectionItem
  }

  return {
    collectionName,
    findByPath,
    getKeyForPath,
  }
}
