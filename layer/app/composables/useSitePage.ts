import type { ContentNavigationItem, Collections, PagesCollectionItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { kebabCase } from 'scule'

type SitePageOptions = {
  immediate?: boolean
}
export const useSitePage = async (opts?: SitePageOptions) => {
  const route = useRoute()
  const { locale, isEnabled, defaultLocale, strategy } = useSiteI18n()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

  const collectionName = computed(() => {
    if (!isEnabled.value || !defaultLocale.value) {
      return 'pages'
    }
    return `pages_${locale.value}`
  })

  // const page = ref<PagesCollectionItem | undefined>()

  const findByPath = async (path: string) => {
    if (strategy.value === 'prefix_except_default' && locale.value === defaultLocale.value) {
      const prefix = `/${locale.value}`
      if (path !== prefix && !path.startsWith(`${prefix}/`)) {
        // we need to inject a virtual path to find the page in the collection
        path = `${prefix}${path}`
      }
    }
    return await queryCollection(collectionName.value as keyof Collections).path(path).first() as PagesCollectionItem
  }

  const { data: page, refresh } = await useAsyncData(() => kebabCase(route.path), async () => {
    const match = await findByPath(route.path)
    return match ? match : undefined
  }, {
    immediate: opts?.immediate,
  })
  // watch(() => route.path, async (path) => {
  //   const match = await findByPath(path)
  //   page.value = match ? match : undefined
  // })

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
    collectionName,
    findByPath,
    refresh,
  }
}
