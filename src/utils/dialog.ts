import { DialogPlugin, type DialogInstance, type DialogOptions } from 'tdesign-vue-next'

const instances: DialogInstance[] = []

export const dialog = (options: { type: 'confirm' | 'alert' | 'info' } & DialogOptions) => {
  const instance =
    options.type === 'confirm'
      ? DialogPlugin.confirm(options)
      : options.type === 'alert'
        ? DialogPlugin.alert(options)
        : DialogPlugin(options)

  instances.push(instance)

  return instance
}

export const closeAllDialogs = () => {
  instances.forEach((instance) => instance.destroy())
  instances.length = 0
}
