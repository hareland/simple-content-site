import type { LocaleObject } from '@nuxtjs/i18n'
import en from '../../i18n/locales/en.json'

export const useSiteI18n = () => {
  const config = useRuntimeConfig().public
  const isEnabled = ref(!!config.i18n && config.i18n.locales?.length > 0)
  // todo: reading the strategy like this might cause issues in the future.
  // @ts-expect-error Due to the above comment
  const strategy = ref(config.i18n?.strategy || 'prefix_except_default')

  if (!isEnabled.value) {
    return {
      isEnabled,
      strategy,
      locale: ref('en'),
      defaultLocale: ref('en'),
      locales: [],
      localePath: (path: string) => path,
      switchLocalePath: () => {},
      t: (key: string): string => {
        const path = key.split('.')
        return path.reduce((acc: unknown, curr) => (acc as Record<string, unknown>)?.[curr], en) as string || key as string
      },
    }
  }

  const { locale, t } = useI18n()
  const filteredLocales = (config.Site as { filteredLocales: LocaleObject<string>[] })?.filteredLocales || []

  return {
    isEnabled,
    strategy,
    locale,
    defaultLocale: ref(config.i18n.defaultLocale || 'en'),
    locales: filteredLocales,
    t,
    localePath: useLocalePath(),
    switchLocalePath: useSwitchLocalePath(),
  }
}
