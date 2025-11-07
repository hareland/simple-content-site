import type { Collections, FooterCollectionItem } from '@nuxt/content'

export const useSiteFooter = () => {
  const { locale, isEnabled } = useSiteI18n()
  const collectionName = computed(() => isEnabled.value ? `footer_${locale.value}` : 'footer')

  return useAsyncData('footer', async () => {
    const defaultFooter = await queryCollection(collectionName.value as keyof Collections).first()
    if (!defaultFooter) {
      return <FooterCollectionItem> {
        socials: [] as FooterCollectionItem['socials'],
      }
    }

    return defaultFooter as FooterCollectionItem
  })
}
