import type { Collections, PagesCollectionItem } from '@nuxt/content'
import { kebabCase } from 'scule'

type SitePageOptions = {
  immediate?: boolean
}
export const useSitePage = async (opts?: SitePageOptions) => {
  const route = useRoute()
  const { locale, isEnabled, defaultLocale, strategy } = useSiteI18n()

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

  return {
    ...useAsyncData(
      () => `site-page:${collectionName.value}:${kebabCase(route.path)}`,
      async () => {
        const match = await findByPath(route.path)
        return match ? match : null
      }, {
        immediate: opts?.immediate,
        watch: [collectionName, locale, () => route.path],
      }),
    collectionName,
    findByPath,
  }
}
