import { describe, expect, it } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'

mockNuxtImport('useSiteI18n', () => () => ({
  locale: ref('en'),
  isEnabled: ref(true),
  defaultLocale: ref('en'),
  strategy: ref('prefix_except_default'),
}))

describe('useSitePage', () => {
  describe('getKeyForPath', () => {
    it('returns a stable path-based cache key with page: prefix', async () => {
      const { useSitePage } = await import('../../layer/app/composables/useSitePage')
      const { getKeyForPath } = useSitePage()

      expect(getKeyForPath('/')).toBe('page:/')
      expect(getKeyForPath('/about')).toBe('page:/about')
      expect(getKeyForPath('/nb')).toBe('page:/nb')
      expect(getKeyForPath('/nb/about')).toBe('page:/nb/about')
    })

    it('adds a leading slash to paths that are missing one', async () => {
      const { useSitePage } = await import('../../layer/app/composables/useSitePage')
      const { getKeyForPath } = useSitePage()

      expect(getKeyForPath('about')).toBe('page:/about')
      expect(getKeyForPath('nb/about')).toBe('page:/nb/about')
    })

    it('does not include locale or collection name in the key', async () => {
      // Regression test: the cache key must not depend on locale.
      // Before the fix, getKeyForPath returned `pages-en:--about`, which
      // included the locale-dependent collectionName. When locale
      // initialisation timing differed between SSR and client hydration the
      // keys would not match, causing useAsyncData to resolve with null and
      // throw a fatal 404 before the page could hydrate — the "SSR flash".
      const { useSitePage } = await import('../../layer/app/composables/useSitePage')
      const { getKeyForPath } = useSitePage()

      const key = getKeyForPath('/about')

      // Must start with 'page:' followed by the path
      expect(key).toMatch(/^page:\//)

      // Must not contain any locale code or collection name
      expect(key).not.toMatch(/pages[-_]en/)
      expect(key).not.toMatch(/pages[-_]nb/)
    })

    it('produces the same key for the same path on every call (SSR/client consistency)', async () => {
      // The key must be deterministic so that data fetched on the server can
      // be matched by the exact same key on the client during hydration.
      const { useSitePage } = await import('../../layer/app/composables/useSitePage')
      const { getKeyForPath } = useSitePage()

      expect(getKeyForPath('/')).toBe(getKeyForPath('/'))
      expect(getKeyForPath('/nb/about')).toBe(getKeyForPath('/nb/about'))
    })
  })
})
