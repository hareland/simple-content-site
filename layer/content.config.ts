import type { DefinedCollection } from '@nuxt/content'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { NavigationMenuItem } from '@nuxt/ui'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')
const locales = options.i18n?.locales

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const orientationEnum = z.enum(['vertical', 'horizontal'])

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
})

const createFeatureItemSchema = () => createBaseSchema().extend({
  icon: z.string().nonempty().editor({ input: 'icon' }),
})

const createLinkSchema = () => z.object({
  class: z.string().optional(),
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  trailingIcon: z.string().optional().editor({ input: 'icon' }),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional(),
})

const createNavigationSchema = () => z.object({
  label: z.string().nonempty(),
  class: z.string().optional(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  trailingIcon: z.string().optional().editor({ input: 'icon' }),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional(),
})

const createNavigationItemSchema = () => createNavigationSchema().extend({
  children: z.array(createNavigationSchema()).optional(),
})

const createPageSchema = () => z.object({
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional(),
  })).optional(),
})

const createHeaderSchema = () => z.object({
  title: z.string().optional(),
  logo: z.object({
    light: z.string(),
    dark: z.string().optional(),
    alt: z.string().optional(),
  }).optional(),
  navigation: z.array(createNavigationItemSchema()).optional(),
})

const createFooterSchema = () => z.object({
  sections: z.array(z.object({
    label: z.string().nonempty(),
    children: z.array(createLinkSchema()),
  })),
  socials: z.array(createLinkSchema()),
})

let collections: Record<string, DefinedCollection>

if (locales && Array.isArray(locales)) {
  collections = {}
  for (const locale of locales) {
    const code = typeof locale === 'string' ? locale : locale.code

    collections[`landing_${code}`] = defineCollection({
      type: 'page',
      source: {
        cwd,
        include: `${code}/index.md`,
      },
    })

    collections[`pages_${code}`] = defineCollection({
      type: 'page',
      source: {
        cwd,
        include: `${code}/**/*`,
        prefix: `/${code}`,
        exclude: [
          `${code}/index.md`,
          `${code}/header.yml`,
          `${code}/footer.yml`,
        ],
      },
      schema: createPageSchema(),
    })

    collections[`header_${code}`] = defineCollection({
      type: 'data',
      source: {
        cwd,
        include: `${code}/header.yml`,
        prefix: `/${code}`,
      },
      schema: createHeaderSchema(),
    })

    collections[`footer_${code}`] = defineCollection({
      type: 'data',
      source: {
        cwd,
        include: `${code}/footer.yml`,
        prefix: `/${code}`,
      },
      schema: createFooterSchema(),
    })
  }
}
else {
  collections = {
    landing: defineCollection({
      type: 'page',
      source: {
        cwd,
        include: 'index.md',
      },
    }),
    pages: defineCollection({
      type: 'page',
      source: {
        cwd,
        include: '**',
        exclude: [
          'index.md',
          'header.yml',
          'footer.yml',
        ],
      },
      schema: createPageSchema(),
    }),
    header: defineCollection({
      type: 'data',
      source: {
        cwd,
        include: 'header.yml',
      },
      schema: createHeaderSchema(),
    }),
    footer: defineCollection({
      type: 'data',
      source: {
        cwd,
        include: 'footer.yml',
      },
      schema: createFooterSchema(),
    }),
  }
}

export default defineContentConfig({ collections })
