<script lang="ts" setup>
import { useSiteI18n } from '#imports'

const { t } = useSiteI18n()
</script>

<template>
  <p>{{ t('test') }}</p>
</template>
