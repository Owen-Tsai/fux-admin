import request from '@/utils/request'
import { set } from 'lodash-es'
import { emitter, eventKeys } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks'

/**
 * 执行 appSchema 中定义的 API，将结果赋予 state 中对应的字段
 */
export const useAPI = () => {
  const rendererCtx = useRendererCtxInject()

  if (!rendererCtx) {
    return
  }

  const { appSchema, $state } = rendererCtx

  const api = appSchema.value.form.api

  if (api) {
    const promises = Object.entries(api).map(async ([, { params, url, dataIndex }]) => {
      /**
       * 判断是否需要执行 API 请求
       * 对于管理端，若 url 以`!`开头，则不执行 API 请求；
       * 否则，将 /personal-api, /company-api 或者 /open-api 前缀全部替换为 /admin-api 再执行
       */
      if (url.startsWith('!')) {
        return Promise.resolve()
      }
      const adminUrl = url.replace(/\/(personal-api|company-api|open-api)/, '/admin-api')
      const res = await request.get({
        url: adminUrl,
        params,
      })
      set($state.value, dataIndex, res)
      emitter.emit(eventKeys.FORM_$STATE_CHANGE)
    })

    Promise.all(promises).then(() => {
      emitter.emit(eventKeys.FORM_READY)
    })
  }
}
