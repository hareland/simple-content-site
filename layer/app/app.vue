<script setup lang="ts">
import type { PageCollections } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'
import type { ResolvableArray, ResolvableLink } from '@unhead/vue'

const { seo } = useAppConfig()
const site = useSiteConfig()
const { locale, locales, isEnabled, switchLocalePath } = useSiteI18n()

const lang = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales]?.code || 'en')
const dir = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales]?.dir || 'ltr')
const collectionName = computed(() => isEnabled.value ? `pages_${locale.value}` : 'pages')
const headLinks: ResolvableArray<ResolvableLink> = []

if (isEnabled.value) {
  const route = useRoute()
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
  headLinks.push({
    rel: 'canonical',
    href: `/${locale.value}${route.path}`,
  })
  headLinks.push(...locales.map((l) => {
    return {
      rel: 'alternate',
      hreflang: l.code,
      href: `/${l.code}${route.path}`,
    }
  }))

  // Handle redirect to correct locale if enabled.
  onMounted(() => {
    const currentLocale = route.path.split('/')[1]
    if (!locales.some(locale => locale.code === currentLocale)) {
      return navigateTo(switchLocalePath(defaultLocale) as string)
    }
  })
}

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    ...headLinks,
  ],
  htmlAttrs: {
    lang,
    dir,
  },
})

useSeoMeta({
  titleTemplate: seo.titleTemplate,
  title: seo.title,
  description: seo.description,
  ogSiteName: site.name,
  twitterCard: 'summary_large_image',
})

const { data: navigation } = await useAsyncData(() => `navigation_${collectionName.value}`, () => queryCollectionNavigation(collectionName.value as keyof PageCollections), {
  transform: (data) => {
    const rootResult = data.find(item => item.path === '/pages')?.children || data || []

    return rootResult.find(item => item.path === `/${locale.value}`)?.children || rootResult
  },
  watch: [locale],
})
const { data: files } = useLazyAsyncData(`search_${collectionName.value}`, () => queryCollectionSearchSections(collectionName.value as keyof PageCollections), {
  server: false,
})

provide('navigation', navigation)
</script>

<template>
  <UApp :locale="nuxtUiLocales[locale as keyof typeof nuxtUiLocales]">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <AppHeader v-if="$route.meta.header !== false" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter v-if="$route.meta.footer !== false" />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
