# Changelog

## [2.3.0](https://github.com/hareland/simple-content-site/compare/v2.2.2...v2.3.0) (2026-01-19)

### Features

* merge landing and pages collections into pages for less complexity ([193da66](https://github.com/hareland/simple-content-site/commit/193da661cbe8726d3a057e8d612719034c35745b))
* refactor `useSitePage` composable to enhance flexibility and streamline page retrieval logic ([a41bf3a](https://github.com/hareland/simple-content-site/commit/a41bf3ab8623ace8919003cc13226f7b601b54e0))
* useSitePage composable ([3398028](https://github.com/hareland/simple-content-site/commit/339802851f134928a3d9efdcbdcdfbe9ffa4b7cb))

### Bug Fixes

* **i18n:** add `strategy` ref to composable with caution note ([63375f2](https://github.com/hareland/simple-content-site/commit/63375f2b74c182e2ad8d0de6f25bc8dda7e8abc0))
* **i18n:** add null-safe check for `locales` in plugin configuration ([2ca78b0](https://github.com/hareland/simple-content-site/commit/2ca78b0facde5c4d9ff6847a606c51b8c2dcf80e))
* **i18n:** adjust path resolution for `prefix_except_default` strategy in landing page query ([6348f56](https://github.com/hareland/simple-content-site/commit/6348f5661c81de1c8186cb5ab1998851b51f4b22))
* **i18n:** enhance path resolution logic for `prefix_except_default` strategy in landing page query ([1b075f5](https://github.com/hareland/simple-content-site/commit/1b075f5b33a85c3e2051bdb9325713980955c8d1))
* **i18n:** expose locale strategy in runtime config with caution note ([f2893c2](https://github.com/hareland/simple-content-site/commit/f2893c2c924b471674a1b007fc40c455f950ac47))
* **i18n:** handle default locale path resolution for `prefix_except_default` strategy ([f85d357](https://github.com/hareland/simple-content-site/commit/f85d35756699d31d0e68464e1b1670fd04f7ee57))
* **i18n:** move redirect logic to `i18n-redirect` plugin and refactor module setup ([9b2c8e1](https://github.com/hareland/simple-content-site/commit/9b2c8e1b085746747e3fb9d21ca2ed3f38732f12))
* **i18n:** prevent redirect for strategies without prefix and log strategy in dev mode ([e528267](https://github.com/hareland/simple-content-site/commit/e5282679f8bf7aecd9cbe1b81ce849a9a3ce89fe))
* **i18n:** refine path resolution for `prefix_except_default` strategy and remove debug log ([971935d](https://github.com/hareland/simple-content-site/commit/971935d0ea230cd82e381e8756aa722e9f30451f))
* **i18n:** suppress TypeScript error for virtual import in `i18n-redirect` plugin ([74758fc](https://github.com/hareland/simple-content-site/commit/74758fcdbab7287c1c56d22ec46823dca19aaf96))
* **i18n:** use `prefix_except_default` strategy and remove `@nuxtjs/i18n` module ([47348f7](https://github.com/hareland/simple-content-site/commit/47348f77f2e2ab0ffa82bdd04ad3984c6d98bb83))

## [2.2.2](https://github.com/hareland/simple-content-site/compare/v2.2.1...v2.2.2) (2026-01-18)

### Features

* **i18n:** add example i18n setup with test translation and content integration ([9fe7ef0](https://github.com/hareland/simple-content-site/commit/9fe7ef09b189b6f58f7247838b7d1436b8bd84ae))

### Bug Fixes

* **config:** move `resolveRoot` creation to i18n-specific block ([57a9217](https://github.com/hareland/simple-content-site/commit/57a921762fa50dc2266693df3052912bdb35c9f3))
* **i18n:** refine locale strategy and support custom translations ([effd067](https://github.com/hareland/simple-content-site/commit/effd067d8d965da5cc8392b38f5f936c9c2a3953))
* **types:** cast i18n config to resolve TypeScript error ([f98c85c](https://github.com/hareland/simple-content-site/commit/f98c85c080983b9527eb373360830b846c0285c4))

## [2.2.1](https://github.com/hareland/simple-content-site/compare/v2.2.0...v2.2.1) (2026-01-18)

### Features

* add minimal and i18n starters with content structure, Nuxt configurations, and example files ([cd26f06](https://github.com/hareland/simple-content-site/commit/cd26f0657265fb59e36e24832a8189882efbe8a1))

### Bug Fixes

* fetch search files when locale changes. ([168e59e](https://github.com/hareland/simple-content-site/commit/168e59ee14d682b3e345d09a9901ec91ba9d767d))
* **i18n:** return key as fallback when translation is missing ([4c8d518](https://github.com/hareland/simple-content-site/commit/4c8d518c71ed79aee5773e46f531b8af5a95fc65))

## [2.2.0](https://github.com/hareland/simple-content-site/compare/v2.1.1...v2.2.0) (2026-01-14)

### Features

* enhance composable imports and prevent duplicate landing page injection ([5e35418](https://github.com/hareland/simple-content-site/commit/5e35418282f18133932b75e80aabea9bcd1c514f))

## [2.1.1](https://github.com/hareland/simple-content-site/compare/v2.1.0...v2.1.1) (2026-01-14)

### Features

* normalize collection name ([4f3fa7c](https://github.com/hareland/simple-content-site/commit/4f3fa7c70dc0f352520c80dea5fad1fe7743dbd4))

## [2.1.0](https://github.com/hareland/simple-content-site/compare/v2.0.1...v2.1.0) (2026-01-12)

### Features

* Add .env.example to starter ([c4fff84](https://github.com/hareland/simple-content-site/commit/c4fff849650c500405afcf7a1d3de1ee6f8415c0))
* Add commands to create new project to README.md ([5f7cd15](https://github.com/hareland/simple-content-site/commit/5f7cd15929ab9e52c2cb72bbd2eab4ce71dae4f8))
* make footer replacements better ([918e9f9](https://github.com/hareland/simple-content-site/commit/918e9f9542d4a13c1c0c6c5d06b4baace71814c5))
* make footer replacements better ([cb1d511](https://github.com/hareland/simple-content-site/commit/cb1d51181624ec0a5b4fe715725d9907b2a5341a))

### Bug Fixes

* useRequestURL should be called as a top-level item in script setup. ([afdd408](https://github.com/hareland/simple-content-site/commit/afdd40867c66ba22652ae37aed727f630bc4c8d4))

## [2.0.1](https://github.com/hareland/simple-content-site/compare/v2.0.0...v2.0.1) (2026-01-06)

## [2.0.0](https://github.com/hareland/simple-content-site/compare/v1.3.1...v2.0.0) (2026-01-06)

### Features

* stable nuxt studio ([1cf3a5d](https://github.com/hareland/simple-content-site/commit/1cf3a5df69f883f4457baa650a1c605193eebdec))
* stable nuxt studio ([f011369](https://github.com/hareland/simple-content-site/commit/f011369fad9a81deec6e10daf166ec8e297afbcf))

## [1.3.1](https://github.com/hareland/simple-content-site/compare/v1.3.0...v1.3.1) (2025-12-10)

## [1.3.0](https://github.com/hareland/simple-content-site/compare/v1.2.0...v1.3.0) (2025-12-10)

## [1.2.0](https://github.com/hareland/simple-content-site/compare/v1.1.2...v1.2.0) (2025-11-25)

## [1.1.2](https://github.com/hareland/simple-content-site/compare/v1.1.1...v1.1.2) (2025-11-24)

## [1.1.1](https://github.com/hareland/simple-content-site/compare/v1.1.0...v1.1.1) (2025-11-24)

### Features

* add `AppHeader` component to minimal playground with dynamic slots and i18n support ([90a895e](https://github.com/hareland/simple-content-site/commit/90a895e92621e7783baa08329be11ae2ced81f4d))

## [1.1.0](https://github.com/hareland/simple-content-site/compare/v1.0.9...v1.1.0) (2025-11-23)

### Features

* add `footer.yml` to define configurable footer structure for minimal playground ([4ed6f82](https://github.com/hareland/simple-content-site/commit/4ed6f82abd6efde243924a6288724be984c10d0e))
* add pricing page with structured plans and SEO enhancements in minimal playground ([5def9a9](https://github.com/hareland/simple-content-site/commit/5def9a915c2dbf6ab984eabf20409ac124492d35))
* enhance `AppFooter` with props for configurable sections and layout adjustments ([b8ede4e](https://github.com/hareland/simple-content-site/commit/b8ede4e144b95b774834280f9989d3e8f248e4f1))
* enhance `AppFooterLeft` with dynamic `parts` and `replacements` props for flexible text rendering ([195d88c](https://github.com/hareland/simple-content-site/commit/195d88c2e16556eb9829c7bb547b1fd074082361))
* make `AppFooter` more flexible by adding support for dynamic `left` and `right` props ([d5675f6](https://github.com/hareland/simple-content-site/commit/d5675f69ffd482beec3607fe2126731f9cadbb8c))

### Bug Fixes

* add conditional rendering for `left` and `right` slots in `AppFooter` to prevent errors with missing data ([de5c3a8](https://github.com/hareland/simple-content-site/commit/de5c3a83dcf07c34b703e650ad928686a9d15c46))
* ensure `replaceParams` returns empty string for missing keys in `AppFooterLeft` ([1b283e1](https://github.com/hareland/simple-content-site/commit/1b283e124682158e2c76784e285cf323bc25a791))

## [1.0.9](https://github.com/hareland/simple-content-site/compare/v1.0.8...v1.0.9) (2025-11-10)

### Features

* add `titleTemplate` field to `nuxt.schema.ts` configuration ([6cc708f](https://github.com/hareland/simple-content-site/commit/6cc708faff6c70144b8b398448fdc5df2bb6e2fe))

## [1.0.8](https://github.com/hareland/simple-content-site/compare/v1.0.7...v1.0.8) (2025-11-08)

## [1.0.7](https://github.com/hareland/simple-content-site/compare/v1.0.6...v1.0.7) (2025-11-08)

### Features

* add props definition for class handling in `AppHeaderLogo.vue` and refine `class` binding using `$props` for improved reactivity ([f3443e2](https://github.com/hareland/simple-content-site/commit/f3443e22eb02a2209b372bb8d936109883642f17))
* integrate tailwind-merge for dynamic class composition, enhance logo configuration, and update schemas accordingly ([ed15952](https://github.com/hareland/simple-content-site/commit/ed15952b9c67ad387ef216b7d60d452065c33afb))

## [1.0.6](https://github.com/hareland/simple-content-site/compare/v1.0.5...v1.0.6) (2025-11-07)

## [1.0.5](https://github.com/hareland/simple-content-site/compare/v0.0.1...v1.0.5) (2025-11-07)

### Bug Fixes

* ensure fallback header/footer queries include `defaultLocale` check in `useSiteHeader` and `useSiteFooter`. ([09cbf4f](https://github.com/hareland/simple-content-site/commit/09cbf4fa3f60fde8b4a22261ac19f24d0e413e29))

## 1.0.4 (2025-11-07)
