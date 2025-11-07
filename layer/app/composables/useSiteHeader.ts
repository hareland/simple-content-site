import type { Collections, HeaderCollectionItem } from '@nuxt/content'

export const useSiteHeader = () => {
  const config = useAppConfig()
  const { locale, isEnabled } = useSiteI18n()
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
  const collectionName = computed(() => isEnabled.value ? `header_${locale.value}` : 'header')

  return useAsyncData(collectionName, async () => {
    const customHeader = await queryCollection(collectionName.value as keyof Collections).first()
    if (!customHeader) {
      if (isEnabled.value && defaultLocale) {
        const fallbackHeader = await queryCollection(`header_${defaultLocale}` as keyof Collections).first()
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
