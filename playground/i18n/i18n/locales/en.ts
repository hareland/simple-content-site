import type { Messages } from '../types'

export default defineLocale<Messages>({
  name: 'English',
  code: 'en',
  messages: {
    foo: { bar: 'This is foo.bar from en.ts' },
    test2: 'This is test2 from en.ts',
    i18n: {
      title: 'Internationalization',
    },
  },
})
