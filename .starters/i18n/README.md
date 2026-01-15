# Simple Content Site — i18n Starter

A playground showing a multilingual, content-driven site. Each Markdown file is a page. Landing pages come from \`<locale>/index.md\`. All other Markdown files are pages for that locale.

## Features

- Locale-based content routing (\`/en\`, \`/nb\`, …)
- Landing pages per locale (\`en/index.md\`, \`nb/index.md\`)
- Header/Footer per locale via YAML
- Works with Nuxt Studio for visual editing

## Quick Start

```bash
# Install
npm install

# Dev server
npm run dev
```

App runs at <http://localhost:3000>. Language prefixes are added to URLs.

## Content Model

Per locale folder under \`content/\`:
- Landing page: \`<locale>/index.md\`
- Pages: any other Markdown files in \`<locale>/\`
- Exceptions (data only, not pages):
    - \`<locale>/header.yml\`: header configuration (title, logo, navigation)
    - \`<locale>/footer.yml\`: footer configuration (links, socials)

## Project Structure

```
playground/i18n/
├── content/
│   ├── en/
│   │   ├── index.md     # English landing page
│   │   ├── about.md     # English page
│   │   ├── header.yml   # English header data
│   │   └── footer.yml   # English footer data
│   └── nb/
│       ├── index.md     # Norwegian landing page
│       └── about.md     # Norwegian page
├── public/
│   ├── favicon.ico
│   └── mountains.webp
├── nuxt.config.ts       # i18n enabled, locales declared
└── package.json
```

Notes:
- URLs include a locale prefix, e.g. \`/en/about\`, \`/nb/about\`.
- Default locale appears without a prefix when configured to do so.
- \`header.yml\` and \`footer.yml\` are locale-scoped data files.

## Scripts

```bash
npm run dev   # Start dev server
npm run build # Build for production
```

## Built With

- Nuxt 4
- Nuxt Content
- Nuxt i18n
- Nuxt Studio (optional)

## License

MIT