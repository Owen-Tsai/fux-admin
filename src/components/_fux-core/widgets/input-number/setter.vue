<template>
  <TFormItem label="默认值" name="defaultValue" help="支持使用表达式">
    <TInput v-model:value="props.defaultValue" />
  </TFormItem>
  <TFormItem label="占位文字" name="placeholder">
    <TInput v-model:value="props.placeholder" />
  </TFormItem>
  <TFormItem label="帮助文字" name="extra">
    <TInput v-model:value="props.field.extra" />
  </TFormItem>
  <TFormItem label="数字上限" name="max">
    <TInputNumber v-model:value="props.max" theme="column" class="w-full" />
  </TFormItem>
  <TFormItem label="数字下限" name="min">
    <TInputNumber v-model:value="props.min" theme="column" class="w-full" />
  </TFormItem>
  <TFormItem label="输入布局">
    <TSelect v-model:value="props.controlsLayout" :options="layoutOpts" clearable />
  </TFormItem>
  <TFormItem label="小数位数">
    <TInputNumber
      v-model:value="props.precision"
      :min="0"
      :step="1"
      :decimal-places="0"
      class="w-full"
    />
  </TFormItem>
  <TFormItem label="步进值">
    <TInputNumber v-model:value="props.step" class="w-full" />
  </TFormItem>
  <TFormItem label="前缀文字" name="prefixText">
    <TInput v-model:value="props.prefixText" clearable />
  </TFormItem>
  <TFormItem label="后缀文字" name="suffixText">
    <TInput v-model:value="props.suffixText" clearable />
  </TFormItem>
  <TFormItem label="允许清空" name="allowClear" class="boolean-setter">
    <TSwitch v-model:value="props.allowClear" />
  </TFormItem>
  <TFormItem label="禁用" name="disabled" class="boolean-setter">
    <TSwitch v-model:value="props.disabled" />
  </TFormItem>
  <TFormItem label="只读" name="readonly" class="boolean-setter">
    <TSwitch v-model:value="props.readonly" />
  </TFormItem>
  <TFormItem label="隐藏" name="hide" class="boolean-setter">
    <TSwitch v-model:value="props.hide" />
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['inputNumber']['props']>('props', { required: true })

const layoutOpts = [
  { value: 'column', label: '内置按钮' },
  { value: 'row', label: '外置双侧按钮' },
  { value: 'normal', label: '不显示按钮' },
]
</script>
