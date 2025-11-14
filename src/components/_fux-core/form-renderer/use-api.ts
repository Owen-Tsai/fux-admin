import request from '@/utils/request'
import { set } from 'lodash-es'
import { emitter, eventKeys } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks'

/**
 * 执行 appSchema 中定义的 API，将结果赋予 state 中对应的字段
 */
const useAPI = () => {
  const rendererCtx = useRendererCtxInject()

  if (!rendererCtx) {
    return
  }

  const { appSchema, $state } = rendererCtx

  const api = appSchema.value.form.api

  if (api) {
    const promises = Object.entries(api).map(([_uid, { params, url, dataIndex }]) => {
      return request
        .get({
          url,
          params,
        })
        .then((res) => {
          set($state.value, dataIndex, res)
          emitter.emit(eventKeys.FORM_$STATE_CHANGE)
        })
    })

    Promise.all(promises).then(() => {
      emitter.emit(eventKeys.FORM_READY)
    })
  }
}

export default useAPI
