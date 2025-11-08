import type { ClassNameValue } from 'tailwind-merge'
import { twMerge as _twMerge } from 'tailwind-merge'

export const twMerge = (...classLists: ClassNameValue[]) => {
  return _twMerge(classLists)
}
