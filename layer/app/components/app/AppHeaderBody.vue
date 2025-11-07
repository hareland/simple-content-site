<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { useSiteHeader } from '#imports'

const { data: header } = await useSiteHeader()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UNavigationMenu
    v-if="header?.navigation"
    :items="header?.navigation"
    orientation="vertical"
    class="-mx-2.5"
  />
  <UContentNavigation
    v-else
    highlight
    variant="link"
    :navigation="navigation"
  />
</template>
