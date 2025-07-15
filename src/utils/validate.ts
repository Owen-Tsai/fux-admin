import type { FormValidateResult } from 'tdesign-vue-next'

export const getFirstError = (result?: FormValidateResult<any>) => {
  if (result && result !== true && Object.keys(result).length) {
    const firstError = Object.values(result).find((v) => typeof v !== 'boolean')?.[0]
    return firstError
  }

  return undefined
}

export const getFirstErrorMessage = (result?: FormValidateResult<any>) => {
  const error = getFirstError(result)
  if (error) {
    return error.message
  }

  return undefined
}
