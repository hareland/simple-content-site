import type { Collections, FooterCollectionItem } from '@nuxt/content'
import { useSiteI18n } from './useSiteI18n'

export const useSiteFooter = () => {
  const { locale, isEnabled, defaultLocale } = useSiteI18n()
  const collectionName = computed(() => isEnabled.value ? `footer_${locale.value}` : 'footer')

  return useAsyncData(collectionName, async () => {
    const customFooter = await queryCollection(collectionName.value as keyof Collections).first()
    if (!customFooter) {
      // attempt to find for the default language
      if (isEnabled.value && defaultLocale.value) {
        const fallbackFooter = await queryCollection(`footer_${defaultLocale.value}` as keyof Collections).first()
        if (fallbackFooter) {
          return fallbackFooter as FooterCollectionItem
        }
      }
      return <FooterCollectionItem> {
        right: [] as FooterCollectionItem['right'],
      }
    }

    return customFooter as FooterCollectionItem
  })
}
