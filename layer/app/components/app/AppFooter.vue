<script setup lang="ts">
import { useSiteFooter } from '../../composables/useSiteFooter'

const { data: footer } = await useSiteFooter()
</script>

<template>
  <UFooter>
    <template
      v-if="footer && footer.left"
      #left
    >
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
    <template
      v-if="footer && footer.right"
      #right
    >
      <AppFooterRight :links="footer && footer.right" />
    </template>
  </UFooter>
</template>
