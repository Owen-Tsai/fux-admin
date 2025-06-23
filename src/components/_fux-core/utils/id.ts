import { customAlphabet } from 'nanoid'

function generateId(len?: number): string
function generateId(pool: string, len?: number): string

function generateId(lenOrPool: string | number | undefined, len?: number) {
  if (typeof lenOrPool === 'string') {
    return customAlphabet(lenOrPool, len || 12)()
  }
  return customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    lenOrPool || 12,
  )()
}

export { generateId }
