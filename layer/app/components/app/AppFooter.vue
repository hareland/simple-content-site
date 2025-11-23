<script setup lang="ts">
import { useSiteFooter } from '../../composables/useSiteFooter'

const { data: footer } = await useSiteFooter()
</script>

<template>
  <UFooter>
    <template #left>
      <AppFooterLeft
        :parts="footer.left"
      />
    </template>
    <template
      v-if="footer && footer.sections && footer.sections.length"
      #top
    >
      <UContainer>
        <UFooterColumns
          :columns="footer.sections"
        />
      </UContainer>
    </template>
    <template #right>
      <AppFooterRight :links="footer.socials || footer.right" />
    </template>
  </UFooter>
</template>
