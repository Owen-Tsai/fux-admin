import { DialogPlugin, type DialogInstance, type DialogOptions } from 'tdesign-vue-next'

const _dialogInstances: DialogInstance[] = []

const useDialog = () => {
  // create dialog
  const dialog = {
    confirm: (options: DialogOptions) => {
      const instance = DialogPlugin.confirm({
        ...options,
        onClosed() {
          instance?.destroy()
        },
      })
      return instantiate(instance)
    },
    alert: (options: DialogOptions) => {
      const instance = DialogPlugin.alert({
        ...options,
        onClosed() {
          instance?.destroy()
        },
      })
      return instantiate(instance)
    },
    info: (options: DialogOptions) => {
      const instance = DialogPlugin({
        ...options,
        onClosed() {
          instance?.destroy()
        },
      })
      return instantiate(instance)
    },
  }

  const instantiate = (instance: DialogInstance) => {
    _dialogInstances.push(instance)
    return instance
  }

  return dialog
}

export const closeAllDialogs = () => {
  _dialogInstances.forEach((instance) => instance.destroy())
  _dialogInstances.length = 0
}

export default useDialog
