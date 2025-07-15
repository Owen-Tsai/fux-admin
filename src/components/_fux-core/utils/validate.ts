import { tryParse } from '.'
import type { FormRule } from 'tdesign-vue-next'
import type { FormWidget } from '@fusionx/core/types'

const validationRuleMap: Record<string, FormRule> = {
  required: { required: true },
  idCard: { idcard: true },
  telnumber: { telnumber: true },
  url: { url: true },
  email: { email: true },
}

export const validationOpts = [
  {
    group: '常用',
    children: [
      { label: '电子邮箱', value: 'email' },
      { label: 'url', value: 'url' },
      { label: '身份证号', value: 'idCard' },
      { label: '手机号', value: 'telnumber' },
    ],
  },
  {
    group: '自定义',
    children: [
      { label: '正则表达式', value: 'regexp' },
      { label: '自定义', value: 'custom' },
    ],
  },
]

export const validation = {
  addRule: (widget: FormWidget, key: string) => {
    if (!widget.props.field.validation) {
      widget.props.field.validation = {}
    }
    if (Object.keys(validationRuleMap).includes(key)) {
      widget.props.field.validation![key] = validationRuleMap[key]
    }
  },
  removeRule: (widget: FormWidget, key: string) => {
    if (widget.props.field.validation?.[key]) {
      delete widget.props.field.validation![key]
    }
  },
  removeRulesAndAdd: (widget: FormWidget, key?: string) => {
    Object.keys(validationRuleMap).forEach((k) => {
      if (k !== 'required') {
        validation.removeRule(widget, k)
      }
    })
    if (key) {
      validation.addRule(widget, key)
    }
  },
  toggleRule: (widget: FormWidget, key: string) => {
    if (Object.keys(widget.props.field.validation || {}).includes(key)) {
      validation.removeRule(widget, key)
    } else {
      validation.addRule(widget, key)
    }
  },
  generateRules: (widget: FormWidget) => {
    const customRules = widget.props.field.rules ? tryParse(widget.props.field.rules) : []

    return widget.props.field.validation
      ? [...Object.values(widget.props.field.validation), ...customRules]
      : undefined
  },
}
