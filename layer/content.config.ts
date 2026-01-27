import type { DefinedCollection } from '@nuxt/content'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { useNuxt } from '@nuxt/kit'
import { joinURL } from 'ufo'

const { options } = useNuxt()
const cwd = joinURL(options.rootDir, 'content')

// @ts-expect-error cannot be typed?
const contentExcluded = options?.scs?.excludeContent || []

// @ts-expect-error cannot be typed?
const locales = options.i18n?.locales
// todo: might be required for diff strategies for the collections
// const defaultLocale = options.i18n?.defaultLocale
// const i18nStrategy = options.i18n?.strategy || 'prefix_except_default'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
// const orientationEnum = z.enum(['vertical', 'horizontal'])

// const createBaseSchema = () => z.object({
//   title: z.string().nonempty(),
//   description: z.string().nonempty(),
// })

// const createFeatureItemSchema = () => createBaseSchema().extend({
//   icon: z.string().nonempty().editor({ input: 'icon' }),
// })

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
    class: z.string().optional(),
  }).optional(),
  navigation: z.array(createNavigationItemSchema()).optional(),
})

const createFooterSchema = () => z.object({
  sections: z.array(z.object({
    label: z.string().nonempty(),
    children: z.array(createLinkSchema()),
  })),
  left: z.array(z.string()).optional(),
  // @deprecated Replaced by 'right'
  socials: z.array(createLinkSchema()),
  right: z.array(createLinkSchema()),
})

let collections: Record<string, DefinedCollection> = {}

const buildI18nCollections = () => {
  for (const locale of locales) {
    const code = (typeof locale === 'string' ? locale : locale.code).replace('-', '_')

    collections[`pages_${code}`] = defineCollection({
      type: 'page',
      source: {
        cwd,
        include: `${code}/**/**.{md,yml}`,
        prefix: `/${code}`,
        exclude: [
          `${code}/header.yml`,
          `${code}/footer.yml`,
          ...contentExcluded,
        ],
      },
      schema: createPageSchema(),
    })

    collections[`header_${code}`] = defineCollection({
      type: 'data',
      source: {
        cwd,
        include: `${code}/header.yml`,
      },
      schema: createHeaderSchema(),
    })

    collections[`footer_${code}`] = defineCollection({
      type: 'data',
      source: {
        cwd,
        include: `${code}/footer.yml`,
      },
      schema: createFooterSchema(),
    })
  }
}

const buildDefaultCollections = () => {
  collections = {
    pages: defineCollection({
      type: 'page',
      source: {
        cwd,
        include: '**/**.{md,yml}',
        exclude: [
          'header.yml',
          'footer.yml',
          ...contentExcluded,
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

if (locales && Array.isArray(locales)) {
  if (locales.length > 0) {
    buildI18nCollections()
  }
  else {
    console.warn('Site: There are 0 locales, building with defaults instead.')
    buildDefaultCollections()
  }
}
else {
  buildDefaultCollections()
}

export default defineContentConfig({ collections })
