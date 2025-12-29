export const safeClone = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    // 如果JSON克隆失败，返回空对象
    return {} as T
  }
}
