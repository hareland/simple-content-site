<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { addPrerenderPath } from '../../utils/prerender'
import { useSitePage } from '#imports'

definePageMeta({
  layout: 'page',
})

const route = useRoute()
const { data: page, pending, collectionName } = await useSitePage()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

watchEffect(() => {
  if (pending.value) return

  if (!page.value) {
    throw createError({
      statusCode: 404,
      statusMessage: import.meta.dev ? `Page ${route.path} not found in ${collectionName.value}` : 'Pages not found',
      fatal: true,
    })
  }
})

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`)

const title = computed(() => page.value?.seo?.title || page.value?.title)
const description = computed(() => page.value?.seo?.description || page.value?.description)

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
})

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

// todo: make the landing OG component customizable.
defineOgImageComponent('Landing', {
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
