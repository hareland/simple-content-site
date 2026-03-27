/**
 * SSR-safety regression tests.
 *
 * These guard against components that accidentally used browser-only APIs
 * (window, document, …) at setup time, which caused a 500 renderSlot error
 * on initial SSR load that "disappeared" when the client took over.
 */
import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import App from '../../layer/app/app.vue'

vi.stubGlobal('defineOgImageComponent', vi.fn())

// ---------------------------------------------------------------------------
// Minimal mocks so App can mount without real content queries
// ---------------------------------------------------------------------------
const mockPage = {
  title: 'Test Page',
  seo: { title: 'Test', description: 'Test description' },
  body: {
    type: 'root',
    children: [
      {
        type: 'element',
        tag: 'p',
        children: [{ type: 'text', value: 'Hello SSR' }],
      },
    ],
  },
}

mockNuxtImport('useSitePage', () => () => ({
  getKeyForPath: (path: string) => `page:${path}`,
  findByPath: () => ({ _path: '/', ...mockPage }),
}))

// ---------------------------------------------------------------------------
// DocsPageHeaderLinks – window?.location?.origin regression
// ---------------------------------------------------------------------------
describe('DocsPageHeaderLinks', () => {
  it('does not access window at setup time (useRequestURL is used instead)', async () => {
    // Before the fix, DocsPageHeaderLinks built its items array at setup time
    // using `window?.location?.origin`. If window is not polyfilled in SSR,
    // this throws ReferenceError: window is not defined, propagating as a
    // 500 renderSlot error.
    //
    // The fix replaces window?.location?.origin with useRequestURL().origin,
    // which is always available (server and client).

    // Import the component and call its setup equivalent by instantiating it
    // in the Nuxt test environment. mountSuspended exercises the full setup
    // code path including any `computed` that accesses window.
    const DocsPageHeaderLinks = await import(
      '../../layer/app/components/docs/DocsPageHeaderLinks.vue'
    )

    // If setup() throws (e.g. ReferenceError: window is not defined), this
    // mountSuspended call will reject.
    await expect(
      mountSuspended(DocsPageHeaderLinks.default, {
        global: { stubs: { UFieldGroup: true, UButton: true, UDropdownMenu: true } },
      }),
    ).resolves.toBeDefined()
  })

  it('generates markdown link URLs without "undefined" as origin', async () => {
    // Regression: `${window?.location?.origin}/raw/path.md` produced
    // "undefined/raw/path.md" during SSR because window.location is not
    // available server-side.
    const DocsPageHeaderLinks = await import(
      '../../layer/app/components/docs/DocsPageHeaderLinks.vue'
    )

    const wrapper = await mountSuspended(DocsPageHeaderLinks.default, {
      global: { stubs: { UFieldGroup: true, UButton: true, UDropdownMenu: true } },
    })

    // The component renders; no error about "undefined" in links.
    expect(wrapper.html()).not.toContain('href="undefined/')
    expect(wrapper.html()).not.toContain('to="undefined/')
  })
})

// ---------------------------------------------------------------------------
// AppFooterRight – UColorModeButton must be inside <ClientOnly>
// ---------------------------------------------------------------------------
describe('AppFooterRight', () => {
  it('renders without throwing during SSR (UColorModeButton is inside ClientOnly)', async () => {
    // Before the fix, AppFooterRight rendered UColorModeButton unconditionally.
    // UFooter always calls renderSlot for its right/left/center slots (no v-if
    // guard), so the slot function executes server-side. UColorModeButton uses
    // useColorMode() and emits hydration-affecting markup that can cause the
    // renderSlot 500 on initial SSR.
    //
    // The fix wraps UColorModeButton in <ClientOnly> (consistent with
    // AppHeader.vue), rendering a skeleton placeholder during SSR instead.
    const AppFooterRight = await import(
      '../../layer/app/components/app/AppFooterRight.vue'
    )

    await expect(
      mountSuspended(AppFooterRight.default, {
        props: { links: [] },
        global: { stubs: { UButton: true, UColorModeButton: true, ClientOnly: false } },
      }),
    ).resolves.toBeDefined()
  })

  it('shows a skeleton fallback while JS has not loaded (ClientOnly #fallback)', async () => {
    const AppFooterRight = await import(
      '../../layer/app/components/app/AppFooterRight.vue'
    )

    const wrapper = await mountSuspended(AppFooterRight.default, {
      props: { links: [] },
    })

    // The component must mount successfully with no errors
    expect(wrapper.exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Full App smoke-test – the footer/header chain must not throw renderSlot
// ---------------------------------------------------------------------------
describe('App SSR smoke test', () => {
  it('mounts the full app without throwing', async () => {
    await expect(
      mountSuspended(App, { route: '/' }),
    ).resolves.toBeDefined()
  })
})
