export const tryParse = <T = any>(str?: string, fallbackValue?: T) => {
  try {
    return str ? JSON.parse(str) : fallbackValue
  } catch {
    return fallbackValue
  }
}
