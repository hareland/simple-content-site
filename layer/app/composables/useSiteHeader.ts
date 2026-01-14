import type { Collections, HeaderCollectionItem } from '@nuxt/content'
import { useSiteI18n } from '#imports'

export const useSiteHeader = () => {
  const config = useAppConfig()
  const { locale, isEnabled, defaultLocale } = useSiteI18n()
  const collectionName = computed(() => isEnabled.value ? `header_${locale.value}` : 'header')

  return useAsyncData(collectionName, async () => {
    const customHeader = await queryCollection(collectionName.value as keyof Collections).first()
    if (!customHeader) {
      if (isEnabled.value && defaultLocale.value) {
        const fallbackHeader = await queryCollection(`header_${defaultLocale.value}` as keyof Collections).first()
        if (fallbackHeader) {
          return fallbackHeader as HeaderCollectionItem
        }
      }
      return <HeaderCollectionItem> {
        title: config.header.title,
        logo: config.header.logo,
      }
    }

    return customHeader as HeaderCollectionItem
  })
}
