/**
 * Regression tests for: duplicate Vue instances causing HTTP 500 on SSR
 *
 * Root cause: when two versions of @vue/runtime-core are installed
 * side-by-side (e.g. 3.5.27 via a consumer's `@vue/compiler-sfc` devDep
 * alongside 3.5.31 from the workspace root), each copy carries its own
 * module-scoped `currentRenderingInstance`. Any component that calls
 * `renderSlot` / `createVNode` from one copy while the active instance lives
 * in the other copy sees `null` and throws
 * "TypeError: Cannot read properties of null (reading 'ce')", which Nitro
 * converts to HTTP 500.
 *
 * Two guards are in place (both required):
 *
 *  1. `pnpm.overrides` in root package.json — pins every Vue package to a
 *     single version for this workspace so pnpm never installs a second copy.
 *
 *  2. `vite.ssr.noExternal` in layer/nuxt.config.ts — forces Vite to *bundle*
 *     (not externalise) the Vue packages in the SSR build.  Without this,
 *     Nitro externalises them, Node.js module resolution runs at runtime and
 *     can resolve a consumer's stale nested copy (e.g. vue@3.5.27 installed
 *     by `@vue/compiler-sfc@^3.5.27`), reintroducing the duplicate instance.
 *     Combined with `vite.resolve.dedupe`, the bundled copy is always taken
 *     from the project root.
 *
 * These tests verify both guards are in place.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'))
const lockfileText = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf-8')
const layerNuxtConfig = readFileSync(resolve(root, 'layer/nuxt.config.ts'), 'utf-8')

const VUE_PACKAGES = [
  'vue',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/reactivity',
  '@vue/shared',
] as const

describe('pnpm overrides (prevent duplicate Vue instances)', () => {
  it('root package.json defines pnpm.overrides', () => {
    expect(packageJson.pnpm?.overrides).toBeDefined()
  })

  it.each(VUE_PACKAGES)(
    'pnpm.overrides pins %s to a fixed version',
    (pkg) => {
      const overrides = packageJson.pnpm?.overrides ?? {}
      expect(overrides[pkg], `expected pnpm.overrides["${pkg}"] to be set`).toBeDefined()
      // Must be an exact version string (no range operators)
      expect(overrides[pkg]).toMatch(/^\d+\.\d+\.\d+$/)
    },
  )

  it('all pinned Vue packages target the same version', () => {
    const overrides = packageJson.pnpm?.overrides ?? {}
    const versions = VUE_PACKAGES.map(pkg => overrides[pkg]).filter(Boolean)
    const unique = new Set(versions)
    expect(unique.size).toBe(1)
  })
})

describe('pnpm-lock.yaml (no duplicate Vue versions installed)', () => {
  it.each(VUE_PACKAGES)(
    'only one version of %s is present in the lockfile',
    (pkg) => {
      const escapedPkg = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Top-level lockfile entries look like:
      //   '@vue/runtime-core@3.5.31':
      //   'vue@3.5.31(typescript@5.9.3):'   ← pnpm peer-dep suffix, same version
      const re = new RegExp(`^  '?${escapedPkg}@(\\d[^(':]+)`, 'gm')
      const versions = new Set<string>()
      for (const m of lockfileText.matchAll(re)) {
        versions.add(m[1]!)
      }
      expect(
        versions.size,
        `expected only one version of ${pkg} in pnpm-lock.yaml but found: ${[...versions].join(', ')}`,
      ).toBe(1)
    },
  )
})

describe('layer/nuxt.config.ts (SSR bundle deduplication)', () => {
  // Extract the noExternal array content from the config file for precise matching
  const noExternalMatch = layerNuxtConfig.match(/noExternal\s*:\s*\[([^\]]+)\]/)
  const noExternalContent = noExternalMatch?.[1] ?? ''

  const dedupeMatch = layerNuxtConfig.match(/dedupe\s*:\s*\[([^\]]+)\]/)
  const dedupeContent = dedupeMatch?.[1] ?? ''

  // vite.ssr.noExternal forces Vue to be *bundled* (not require()'d at runtime)
  // in the Nitro SSR output. Without this, a consumer that has a stale vue@3.5.27
  // installed (e.g. via @vue/compiler-sfc devDep) will have Node.js pick that
  // copy at runtime, recreating the duplicate-instance 500 error.
  it('vite.ssr.noExternal block is present in config', () => {
    expect(noExternalMatch, 'expected a noExternal: [...] block in layer/nuxt.config.ts').not.toBeNull()
  })

  it.each(VUE_PACKAGES)(
    'vite.ssr.noExternal includes %s',
    (pkg) => {
      expect(
        noExternalContent,
        `expected vite.ssr.noExternal to contain '${pkg}' in layer/nuxt.config.ts`,
      ).toContain(`'${pkg}'`)
    },
  )

  it('vite.resolve.dedupe block is present in config', () => {
    expect(dedupeMatch, 'expected a dedupe: [...] block in layer/nuxt.config.ts').not.toBeNull()
  })

  it.each(VUE_PACKAGES)(
    'vite.resolve.dedupe includes %s',
    (pkg) => {
      expect(
        dedupeContent,
        `expected vite.resolve.dedupe to contain '${pkg}' in layer/nuxt.config.ts`,
      ).toContain(`'${pkg}'`)
    },
  )
})
