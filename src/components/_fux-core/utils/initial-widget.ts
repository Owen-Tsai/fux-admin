import type { WidgetMap } from '@fusionx/core/types'

export const initialWidgetConfig: Partial<WidgetMap> = {
  input: {
    class: 'form',
    type: 'input',
    name: '输入框',
    uid: 'input',
    props: {
      field: {
        label: '输入框',
      },
    },
    icon: 'component-input',
  },
  inputNumber: {
    class: 'form',
    type: 'inputNumber',
    name: '数字输入框',
    uid: 'inputNumber',
    props: {
      field: {
        label: '数字输入框',
      },
    },
    icon: 'numbers-7',
  },
}
