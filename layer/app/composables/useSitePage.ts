import type { Collections, PagesCollectionItem } from '@nuxt/content'
import { kebabCase } from 'scule'

export const useSitePage = () => {
  const { locale, isEnabled, defaultLocale, strategy } = useSiteI18n()

  const collectionName = computed(() => {
    if (!isEnabled.value || !defaultLocale.value || !locale.value) {
      return 'pages'
    }
    return `pages_${locale.value}`
  })

  const getKeyForPath = (path: string) => {
    const prefix = toValue(collectionName.value).replaceAll('_', '-')
    const suffix = kebabCase(path.replaceAll('/', '--'))
    return `${prefix}:${suffix}`
  }

  // const page = ref<PagesCollectionItem | undefined>()

  const findByPath = async (path: string) => {
    if (isEnabled.value && strategy.value === 'prefix_except_default' && locale.value === defaultLocale.value) {
      const prefix = `/${locale.value}`
      if (path !== prefix && !path.startsWith(`${prefix}/`)) {
        // we need to inject a virtual path to find the page in the collection
        path = `${prefix}${path}`
      }
    }
    return await queryCollection(collectionName.value as keyof Collections).path(path).first() as PagesCollectionItem
  }

  // watch(() => route.path, async (path) => {
  //   const match = await findByPath(path)
  //   page.value = match ? match : undefined
  // })

  return {
    collectionName,
    findByPath,
    getKeyForPath,
  }
}
