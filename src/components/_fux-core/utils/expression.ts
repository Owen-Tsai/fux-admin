import { get } from 'lodash-es'

const parseExpression = (expression: string, context: Record<string, any>) => {
  const isExpression = /\{\{(.*?)\}\}/.test(expression)
  if (isExpression) {
    // 1. 如果包含双花括号，说明是表达式
    const str = expression.replace(/\{\{(.*?)\}\}/, (_, expr) => expr.trim())
    // 1.1 如果包含 $state，从 context 中取值
    if (str.includes('$state')) {
      const key = str.split('$state.')[1]
      return get(context, key)
    }
    // 1.2 如果表达式不包含 $state，如 {{0}}、{{['an', 'array']}} 等，解析为 js 表达式
    return safeEval(`return ${str}`, context)
  } else {
    // 2. 如果不是表达式，直接返回原始值
    return expression
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

export { parseExpression, safeEval }
