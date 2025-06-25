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
  textarea: {
    class: 'form',
    name: '文本域',
    type: 'textarea',
    uid: 'textarea',
    props: {
      field: {
        label: '文本域',
      },
    },
    icon: 'textbox',
  },
  cascader: {
    class: 'form',
    name: '级联选择器',
    type: 'cascader',
    uid: 'cascader',
    props: {
      field: {
        label: '级联选择器',
      },
      options: {
        type: 'static',
        value: `[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]`,
      },
    },
    icon: 'component-breadcrumb',
  },
  treeSelect: {
    class: 'form',
    type: 'treeSelect',
    name: '树形选择器',
    uid: 'treeSelect',
    props: {
      field: {
        label: '树形选择器',
      },
      options: {
        type: 'static',
        value: `[{"label":"山东省","value":"37","children":[{"label":"济南市","value":"3701","children":[{"label":"市中区","value":"370101"},{"label":"历下区","value":"370102"}]},{"label":"青岛市","value":"3702","children":[{"label":"市北区","value":"370203"},{"label":"市南区","value":"370202"}]}]},{"label":"北京市","value":"11","children":[{"label":"东城区","value":"110101"},{"label":"西城区","value":"110102"}]}]`,
      },
    },
    icon: 'tree-round-dot-vertical',
  },
  datePicker: {
    class: 'form',
    type: 'datePicker',
    uid: 'datePicker',
    name: '日期选择器',
    props: {
      field: {
        label: '日期选择器',
      },
    },
    icon: 'calendar',
  },
  dateRangePicker: {
    class: 'form',
    type: 'dateRangePicker',
    uid: 'dateRangePicker',
    name: '日期范围选择器',
    props: {
      field: {
        label: '日期范围选择器',
      },
    },
    icon: 'calendar',
  },
  tabs: {
    class: 'layout',
    name: '标签页',
    type: 'tabs',
    uid: 'tabs',
    props: {
      field: {},
      children: [
        { widgets: [], title: '标签页1' },
        { widgets: [], title: '标签页2' },
      ],
      state: {
        current: 0,
      },
    },
    icon: 'tab',
  },
}
