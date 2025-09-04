import { MessagePlugin } from 'tdesign-vue-next'

const useMessage = () => {
  return {
    success: MessagePlugin.success,
    error: MessagePlugin.error,
    warning: MessagePlugin.warning,
    info: MessagePlugin.info,
    loading: MessagePlugin.loading,
  }
}

export default useMessage
