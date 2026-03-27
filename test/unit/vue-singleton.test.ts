/**
 * Regression tests for: duplicate Vue instances causing HTTP 500 on SSR
 *
 * Root cause: when two versions of vue are installed side-by-side (e.g.
 * vue@3.5.27 via a consumer's `@vue/compiler-sfc` devDep alongside
 * vue@3.5.31 required by Nuxt/UI), each copy carries its own module-scoped
 * `currentRenderingInstance`. Any component that calls `renderSlot` /
 * `createVNode` from one copy while the active instance lives in the other
 * copy sees `null` and throws
 * "TypeError: Cannot read properties of null (reading 'ce')", which Nitro
 * converts to HTTP 500.
 *
 * The fix: declare `vue` as a direct `dependency` in `layer/package.json`.
 * pnpm's deduplication algorithm sees that the layer requires `vue@^3.5.x`
 * and resolves ALL packages in the consumer's tree to the same compatible
 * version — no Vite-level workarounds needed.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')

const layerPackageJson = JSON.parse(readFileSync(resolve(root, 'layer/package.json'), 'utf-8'))
const lockfileText = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf-8')

const VUE_PACKAGES = [
  'vue',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/reactivity',
  '@vue/shared',
] as const

describe('layer/package.json (vue declared as a dependency)', () => {
  // Declaring `vue` in the layer's dependencies forces pnpm to include it in
  // the unified version-resolution pass. Because every other Vue constraint in
  // the consumer's tree (e.g. @vue/compiler-sfc@^3.5.27) uses a compatible
  // range, pnpm resolves them all to the same single version and installs one
  // copy — eliminating the duplicate-instance error without any Vite overrides.
  it('vue is listed in layer dependencies', () => {
    expect(
      layerPackageJson.dependencies?.vue,
      'expected "vue" to be listed in layer/package.json dependencies',
    ).toBeDefined()
  })

  it('vue dependency uses a valid semver range', () => {
    const version = layerPackageJson.dependencies?.vue ?? ''
    expect(version, 'expected vue dependency to be a non-empty semver range').toMatch(/^\^?\d+\.\d+\.\d+$/)
  })

  it('vue version floor is >= 3.5.31 so pnpm cannot resolve to the stale 3.5.27 copy', () => {
    // @nuxt/test-utils@4.0.0 declares "vue": "^3.5.27" as a direct dep.
    // If the layer only required "^3.5.0", pnpm would happily keep a consumer's
    // stale lockfile resolution at 3.5.27 (which satisfies both ranges).
    // "^3.5.31" cannot be satisfied by 3.5.27, so pnpm is forced to upgrade
    // the consumer's vue to 3.5.31+ — resolving to one copy.
    const version = (layerPackageJson.dependencies?.vue ?? '').replace(/^\^/, '')
    const [major, minor, patch] = version.split('.').map(Number)
    expect(major, 'vue major must be 3').toBe(3)
    expect(minor, 'vue minor must be at least 5').toBeGreaterThanOrEqual(5)
    expect(patch, 'vue patch must be at least 31 to exclude the stale 3.5.27 copy').toBeGreaterThanOrEqual(31)
  })

  it('vue is not in peerDependencies (no longer needed there)', () => {
    expect(
      layerPackageJson.peerDependencies?.['@vue/runtime-core'],
      '@vue/runtime-core peerDep is superseded by the vue dependency and should be removed',
    ).toBeUndefined()
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
