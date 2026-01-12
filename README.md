# simple-content-site layer

A simple layer for setting up a simple website using Nuxt, Nuxt UI and Nuxt Content.

## Installation
> You can add the layer to an existing project, or create a fresh one following the methods below.

### Create a new project

Minimal version

```bash
npx nuxi init -t gh:hareland/simple-content-site/playground/minimal
```

I18n version
```bash
npx nuxi init -t gh:hareland/simple-content-site/playground/i18n
```

### Add to existing nuxt app
> This should be done inside a nuxt app.

```bash
npm i simple-content-site
```
or

```bash
pnpm add simple-content-site
```

### Extend the layer

```ts nuxt.config.ts
export default defineNuxtConfig({
    extends: ['simple-content-site'],
})
```

### Running with the layer

```bash
pnpm dev
```

### Adding pages

There are two types of pages, `landing` and `page`, in a future version they will be the same.

#### Landing page

This only covers the front page, either with i18n or without, see examples in the [./playground](./playground) folder.
This is always the `content/index.md` or `content/[lang]/index.md`.

Supports full MDC syntax, and you can implement custom components.

#### Page

Can more or less do exactly the same as a landing page.


## 🛠️ Development

### Local Development

To contribute to the CLI tool:

```bash
# Clone this repository...

# Install dependencies
pnpm install

# Run the dev server
pnpm run dev
```

### Package Structure

This is a monorepo containing:

- [**`/layer`**](./layer) - Content Site Nuxt layer (`simple-content-site`)
- [**`/playground/minimal`**](./playground/minimal) - Minimal example project.
- [**`/playground/i18n`**](./playground/i18n) - I18n example project

## TODO's

- [X] Base structure and functionality
- [X] Support i18n
- [ ] Find a shared setup for landing and page

## Contributions

Contributions are welcome.

## 📄 License

Published under the [MIT](LICENSE) license.

---

Heavily inspired by [Docus](https://docus.dev)