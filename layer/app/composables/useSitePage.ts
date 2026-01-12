import type { ContentNavigationItem, Collections, PagesCollectionItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

export const useSitePage = () => {
  const route = useRoute()
  const { locale, isEnabled, defaultLocale } = useSiteI18n()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

  const collectionName = computed(() => {
    if (!isEnabled.value || !defaultLocale.value) {
      return 'pages'
    }
    return `pages_${locale.value}`
  })

  const page = ref<PagesCollectionItem | undefined>()

  watch(() => route.path, async (path) => {
    const match = await queryCollection(collectionName.value as keyof Collections).path(path).first() as PagesCollectionItem
    page.value = match ? match : undefined
  })

  const title = computed(() => page.value?.seo?.title || page.value?.title || undefined)
  const description = computed(() => page.value?.seo?.description || page.value?.description || undefined)
  const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))
  const exists = computed(() => page.value !== undefined)

  return {
    page,
    title,
    description,
    headline,
    exists,
  }
}
