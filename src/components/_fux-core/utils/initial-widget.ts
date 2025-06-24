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
  select: {
    class: 'form',
    type: 'select',
    name: '下拉选择器',
    uid: 'select',
    props: {
      field: {
        label: '下拉选择器',
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
      },
    },
    icon: 'component-dropdown',
  },
  checkbox: {
    class: 'form',
    type: 'checkbox',
    name: '多选框',
    uid: 'checkbox',
    props: {
      field: {
        label: '多选框',
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
      },
    },
    icon: 'component-checkbox',
  },
  radio: {
    class: 'form',
    type: 'radio',
    name: '单选框',
    uid: 'radio',
    props: {
      field: {
        label: '单选框',
      },
      options: {
        type: 'static',
        value: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ],
      },
    },
    icon: 'component-radio',
  },
}
