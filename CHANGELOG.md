# Changelog

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
