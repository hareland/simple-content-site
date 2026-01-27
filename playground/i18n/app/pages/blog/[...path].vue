<script lang="ts" setup>
import type { Collections } from '@nuxt/content'

const route = useRoute()

const { locale } = useSiteI18n()

const { data: post } = await useAsyncData(() => `post:${route.path}`, async () => {
  return await queryCollection(`blog_${locale.value}` as keyof Collections).path(route.path).first()
})

if (!post.value) {
  throw createError({ status: 404, message: 'Post not found.' })
}
</script>

<template>
  <UPage>
    <UContainer>
      <ContentRenderer
        v-if="post"
        :value="post"
      />
    </UContainer>
  </UPage>
</template>
