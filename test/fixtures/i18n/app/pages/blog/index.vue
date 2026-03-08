<script lang="ts" setup>
const { findByPath, getKeyForPath } = useSitePage()

const route = useRoute()
const { data: page } = await useAsyncData(() => getKeyForPath(route.path), async () => {
  return await findByPath(route.path)
})

if (!page.value) {
  throw createError({ status: 404, message: 'Page not found' })
}
</script>

<template>
  <UPage>
    <UContainer>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </UContainer>
  </UPage>
</template>
