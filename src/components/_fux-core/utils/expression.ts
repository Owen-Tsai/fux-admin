import { get } from 'lodash-es'

/**
 * evaluate expression with given context
 */
function evalExpression(expression: string, context: Record<string, any>): any {
  // 移除模板表达式中的双花括号
  const cleanedExpression = expression.replace(/\{\{(.*?)\}\}/, (_, expr) => expr.trim())

  try {
    // 替换嵌套路径的表达式，以支持路径解析
    const pathExpression = cleanedExpression.replace(
      /([a-zA-Z_$][\w$]*(?:\.[\w$]+)*)/g,
      (match) => {
        const value = get(context, match)
        return value !== undefined ? JSON.stringify(value) : match
      },
    )

    // 使用 Function 执行表达式并返回值
    const result = new Function(`return ${pathExpression};`)()
    return result
  } catch (error) {
    console.error(`Error evaluating expression: ${expression}`, error)
    return undefined
  }
}

const runInSandbox = (code: string, context: Record<string, any> = {}) => {
  const ctxKeys = Object.keys(context)
  const ctxValues = Object.values(context)

  const sandboxedFn = new Function(...ctxKeys, code)

  return sandboxedFn(...ctxValues)
}

const safeEval = (code: string, context: Record<string, any> = {}) => {
  const forbiddenKeywords = ['window', 'document', 'eval', 'Function', 'constructor']
  const forbiddenRegex = new RegExp(`\\b(${forbiddenKeywords.join('|')})\\b`, 'g')

  if (forbiddenRegex.test(code)) {
    throw new Error('包含禁止使用的对象（DOM、BOM等）')
  }

  return runInSandbox(code, context)
}

export { evalExpression, safeEval }
