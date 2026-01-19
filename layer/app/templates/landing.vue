<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const route = useRoute()
const { locale, isEnabled, defaultLocale, strategy } = useSiteI18n()

// Dynamic collection name based on i18n status
const collectionName = computed(() => isEnabled.value ? `landing_${locale.value}` : 'landing')

const { data: page } = await useAsyncData(collectionName.value, () => {
  const collection = collectionName.value as keyof Omit<Collections, 'header' | 'footer'>

  // TODO: Move to useSitePage composable in the future
  let path = route.path
  // we need to inject a virtual path to find the page in the collection
  if (strategy.value === 'prefix_except_default' && locale.value === defaultLocale.value) {
    const prefix = `/${locale.value}`
    if (path !== prefix && !path.startsWith(`${prefix}/`)) {
      // we need to inject a virtual path to find the page in the collection
      path = `${prefix}${path}`
    }
  }
  return queryCollection(collection).path(path).first()
})
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: import.meta.dev ? `Page ${route.path} not found in ${collectionName.value}` : 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})

if (page.value?.seo?.ogImage) {
  useSeoMeta({
    ogImage: page.value.seo.ogImage,
    twitterImage: page.value.seo.ogImage,
  })
}
else {
  defineOgImageComponent('Landing', {
    title,
    description,
  })
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>
