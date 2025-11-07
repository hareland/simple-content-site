<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem, Collections, PagesCollectionItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { addPrerenderPath } from '../../utils/prerender'

definePageMeta({
  layout: 'page',
})

const route = useRoute()
const { locale, isEnabled } = useSiteI18n()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const collectionName = computed(() => isEnabled.value ? `pages_${locale.value}` : 'pages')

const [{ data: page }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection(collectionName.value as keyof Collections).path(route.path).first() as Promise<PagesCollectionItem>),
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: import.meta.dev ? `Page ${route.path} not found in ${collectionName.value}` : 'Pages not found', fatal: true })
}

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`)

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

defineOgImageComponent('Docs', {
  headline: headline.value,
})
</script>

<template>
  <UPage v-if="page">
    <ContentRenderer
      v-if="page"
      :value="page"
      unwrap="p"
    />
  </UPage>
</template>
