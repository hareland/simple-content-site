<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const props = defineProps<{
  links?: ButtonProps[]
}>()

const appConfig = useAppConfig()

const footerLinks = computed(() => props.links || [
  ...Object.entries(appConfig.socials || {}).map(([key, url]) => ({
    'icon': `i-simple-icons-${key}`,
    'to': url,
    'target': '_blank',
    'aria-label': `${key} social link`,
  })),
  appConfig.github && appConfig.github.url && {
    'icon': 'i-simple-icons-github',
    'to': appConfig.github.url,
    'target': '_blank',
    'aria-label': 'GitHub repository',
  },
].filter(Boolean))
</script>

<template>
  <template v-if="footerLinks.length">
    <UButton
      v-for="(link, index) of footerLinks"
      :key="index"
      size="sm"
      v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
    />
  </template>
  <ClientOnly>
    <UColorModeButton />
    <template #fallback>
      <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
    </template>
  </ClientOnly>
</template>
