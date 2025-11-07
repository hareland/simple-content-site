<script setup lang="ts">
import { useSiteHeader } from '#imports'

const { data: header } = await useSiteHeader()
</script>

<template>
  <UNavigationMenu
    v-if="header?.navigation"
    :items="header?.navigation"
    variant="link"
  />
  <UContentSearchButton
    v-else
    :collapsed="false"
    class="w-full"
    variant="soft"
    :ui="{
      leadingIcon: 'size-4 mr-1',
    }"
  />
</template>
