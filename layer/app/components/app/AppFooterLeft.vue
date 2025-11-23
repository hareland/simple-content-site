<script setup lang="ts">
import { defu } from 'defu'

const props = withDefaults(defineProps<{
  parts?: string[]
  replacements?: Record<string, string>
}>(), {
  parts: () => ['Copyright ©', '{fullYear}'],

})

const replaceParams = (text: string, params: Record<string, string>) => text.replace(/\{([^}]+)\}/g, (_, key) => params[key])

const rawItems = computed(() => {
  if (!props.parts || props.parts.length === 0) return ['']

  return props.parts
})

const text = computed(() => {
  return replaceParams([...toValue(rawItems)].join(' '), defu(props.replacements || {}, {
    fullYear: new Date().getFullYear(),
  }))
})
</script>

<template>
  <div class="text-sm text-muted">
    {{ text }}
  </div>
</template>
