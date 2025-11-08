import type { LocaleObject } from '@nuxtjs/i18n'
import en from '../../i18n/locales/en.json'

export const useSiteI18n = () => {
  const config = useRuntimeConfig().public
  const isEnabled = ref(!!config.i18n && config.i18n.locales?.length > 0)

  if (!isEnabled.value) {
    return {
      isEnabled,
      locale: ref('en'),
      defaultLocale: ref('en'),
      locales: [],
      localePath: (path: string) => path,
      switchLocalePath: () => {},
      t: (key: string): string => {
        const path = key.split('.')
        return path.reduce((acc: unknown, curr) => (acc as Record<string, unknown>)?.[curr], en) as string
      },
    }
  }

  const { locale, t } = useI18n()
  const filteredLocales = (config.Site as { filteredLocales: LocaleObject<string>[] })?.filteredLocales || []

  return {
    isEnabled,
    locale,
    defaultLocale: ref(config.i18n.defaultLocale || 'en'),
    locales: filteredLocales,
    t,
    localePath: useLocalePath(),
    switchLocalePath: useSwitchLocalePath(),
  }
}
