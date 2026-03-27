import type { Collections, PagesCollectionItem } from '@nuxt/content'
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
    return `page:${withLeadingSlash(path)}`
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
