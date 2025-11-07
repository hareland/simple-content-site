<script setup lang="ts">
import { useSiteFooter } from '#imports'

const { data: footer } = await useSiteFooter()

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.',
  })
}
</script>

<template>
  <UFooter>
    <template #left>
      <AppFooterLeft />
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
      <AppFooterRight :links="footer && footer.socials" />
    </template>
  </UFooter>
</template>
