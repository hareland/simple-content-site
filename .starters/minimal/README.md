# Simple Content Site — Minimal Starter

A tiny playground showing how to build a content-driven site where each Markdown file is a page. No i18n by default. Perfect for quick prototypes or small sites.

## Features

- File-based pages with Markdown (MDC ready)
- Landing page from \`index.md\`
- Header/Footer content from YAML
- Zero boilerplate Nuxt setup (extends the main layer)
- Works with Nuxt Studio for visual editing

## Quick Start

```bash
# Install
npm install

# Dev server
npm run dev
```

App runs at <http://localhost:3000>

## Content Model

- Landing page: \`content/index.md\`
- Pages: any other Markdown files under \`content/\`
- Exceptions:
    - \`/header.yml\`: header configuration (see example in \`content/header.yml\`)
    - \`/footer.yml\`: footer configuration (not used in this minimal example)

## Project Structure

```
playground/minimal/
├── content/
│   ├── index.md       # Landing page
│   └── header.yml     # Header data (title, logo, navigation)
├── public/
│   └── logo.png
├── nuxt.config.ts     # Extends the main layer; i18n disabled here
└── package.json
```

Notes:
- There is no locale prefixing. \`index.md\` is the root “/”.
- All Markdown files except \`index.md\` are treated as pages and routed automatically.
- Header/Footer YAML are data files, not pages.

## Scripts

```bash
npm run dev   # Start dev server
npm run build # Build for production
```

## Built With

- Nuxt 4
- Nuxt Content
- Nuxt Studio (optional)

## License

MIT