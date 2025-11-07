<script setup lang="ts">
import { useSiteHeader } from '#imports'

const appConfig = useAppConfig()
const { data: header } = await useSiteHeader()
</script>

<template>
  <UColorModeImage
    v-if="header?.logo || appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :light="header?.logo?.light || appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
    :dark="header?.logo?.dark || appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :alt="header?.logo?.alt || appConfig.header?.logo?.alt || appConfig.header?.title"
    class="h-6 w-auto shrink-0"
  />
  <span v-else>
    {{ header?.title || appConfig.header?.title || '{appConfig.header.title}' }}
  </span>
</template>
