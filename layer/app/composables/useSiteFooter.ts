import type { Collections, FooterCollectionItem } from '@nuxt/content'

export const useSiteFooter = () => {
  const { locale, isEnabled } = useSiteI18n()
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
  const collectionName = computed(() => isEnabled.value ? `footer_${locale.value}` : 'footer')

  return useAsyncData(collectionName, async () => {
    const customFooter = await queryCollection(collectionName.value as keyof Collections).first()
    if (!customFooter) {
      // attempt to find for the default language
      if (isEnabled.value && defaultLocale) {
        const fallbackFooter = await queryCollection(`footer_${defaultLocale}` as keyof Collections).first()
        if (fallbackFooter) {
          return fallbackFooter as FooterCollectionItem
        }
      }
      return <FooterCollectionItem> {
        socials: [] as FooterCollectionItem['socials'],
      }
    }

    return customFooter as FooterCollectionItem
  })
}
