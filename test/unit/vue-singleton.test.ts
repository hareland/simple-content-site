/**
 * Regression tests for: duplicate Vue instances causing HTTP 500 on SSR
 *
 * Root cause: when two versions of @vue/runtime-core are installed
 * side-by-side in the pnpm workspace (e.g. 3.5.27 from @nuxt/ui's peer dep
 * alongside 3.5.31 from the workspace root), each copy carries its own
 * module-scoped `currentRenderingInstance`. Any component that calls
 * `renderSlot` / `createVNode` from one copy while the active instance lives
 * in the other copy sees `null` and throws
 * "TypeError: Cannot read properties of null (reading 'ce')", which Nitro
 * converts to HTTP 500.
 *
 * The fix adds `pnpm.overrides` in the root package.json to pin every Vue
 * package to a single version so pnpm never installs a second copy.
 *
 * These tests verify that guarantee is in place and will catch any future
 * regression where the overrides are removed or the lockfile drifts.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'))
const lockfileText = readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf-8')

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
