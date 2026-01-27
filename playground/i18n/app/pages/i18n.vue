<script lang="ts" setup>
import { useSiteI18n } from '#imports'

const { t } = useSiteI18n()
</script>

<template>
  <UPageHeader :title="t('i18n.title')">
    <template #links>
      <UButton
        variant="ghost"
        to="https://i18n.nuxtjs.org"
        :external="true"
      >
        @nuxt/i18n
      </UButton>
    </template>
  </UPageHeader>
  <UPageBody>
    <UPageCard title="Typescript support">
      <UFormField label="foo.bar">
        {{ t('foo.bar') }}
      </UFormField>
      <UFormField label="test2">
        {{ t('test2') }}
      </UFormField>
    </UPageCard>
  </UPageBody>
</template>
