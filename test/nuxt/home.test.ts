import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import App from '../../layer/app/app.vue'
import { withTrailingSlash } from 'ufo'

vi.stubGlobal('defineOgImageComponent', vi.fn())

const pagesToTest = [
  {
    path: '/',
    locale: 'en',
    contains: ['Documentation'],
    page: {
      title: 'Make your documentation in Markdown',
      seo: { title: 'simple-content-site', description: 'Test' },
      body: {
        type: 'root',
        children: [
          {
            type: 'element',
            tag: 'p',
            children: [{ type: 'text', value: 'Documentation' }],
          },
        ],
      },
    },
  },
  {
    path: '/nb',
    locale: 'nb',
    contains: ['Dokumentasjonen'],
    page: {
      title: 'Lag dokumentasjonen din i Markdown',
      seo: { title: 'simple-content-site', description: 'Test' },
      body: {
        type: 'root',
        children: [
          {
            type: 'element',
            tag: 'p',
            children: [{ type: 'text', value: 'Dokumentasjonen' }],
          },
        ],
      },
    },
  },
]

const pageMap = new Map(pagesToTest.map(p => [p.path, p.page]))

mockNuxtImport('useSitePage', () => () => ({
  getKeyForPath: (path: string) => `page:${path}`,
  findByPath: (path: string) => {
    // Normalize trailing slash to match pageMap keys
    const normalizedPath = path === '/' ? path : path.replace(/\/$/, '')
    const match = pageMap.get(normalizedPath)
    if (!match) return null
    return { _path: normalizedPath, ...match }
  },
}))

describe('routing', () => {
  it('defaults to index page', async () => {
    expect(useRoute().matched[0]!.meta).toMatchInlineSnapshot(`
      {
        "layout": "page",
      }
    `)
  })

  it('allows pushing to other pages', async () => {
    await navigateTo('/nb')
    expect(useNuxtApp().$router.currentRoute.value.path).toEqual('/nb')
    expect(useNuxtApp().$i18n.locale.value).toEqual('nb')
    await nextTick()
    expect(useRoute().path).toEqual('/nb')
  })

  it('navigation', async () => {
    const component = await mountSuspended(App, { route: '/' })
    expect(component.html()).toContain('simple-content-site')
  })

  describe.each(pagesToTest)('page $path', ({ path, contains }) => {
    it(`renders expected content`, async () => {
      const component = await mountSuspended(App, { route: path })
      expect(component.html()).toContain('simple-content-site')
      for (const text of contains) {
        expect(component.html()).toContain(text)
      }
    })

    it(`renders with trailing slash`, async () => {
      const trailingPath = withTrailingSlash(path)
      const component = await mountSuspended(App, { route: trailingPath })
      expect(component.html()).toContain('simple-content-site')
      for (const text of contains) {
        expect(component.html()).toContain(text)
      }
    })
  })
})
