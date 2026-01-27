<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
// import { addPrerenderPath } from '../../utils/prerender'
import { useSitePage } from '#imports'

definePageMeta({
  layout: 'page',
})

const route = useRoute()
const { findByPath, getKeyForPath } = useSitePage()

const { data: page } = await useAsyncData(() => getKeyForPath(route.path), async () => {
  return await findByPath(route.path)
}, {
  immediate: true,
})

if (!page.value) {
  throw createError({
    status: 404,
    message: 'Page not found',
    fatal: true,
  })
}

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Add the page path to the prerender list
// addPrerenderPath(`/raw${route.path}.md`)

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
