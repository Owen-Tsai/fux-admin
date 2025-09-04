export const tryParse = (str?: string, fallbackValue?: any) => {
  try {
    return str ? JSON.parse(str) : fallbackValue
  } catch {
    return fallbackValue
  }
}
