<template>
  <TFormItem label="默认值" name="defaultValue" help="默认值应为数组表达式">
    <TInput v-model:value="props.defaultValue" />
  </TFormItem>
  <TFormItem label="占位文字" name="placeholder">
    <TInput v-model:value="props.placeholder" />
  </TFormItem>
  <TFormItem label="帮助文字" name="extra">
    <TInput v-model:value="props.field.extra" />
  </TFormItem>
  <TFormItem label="选择模式" name="mode">
    <TSelect v-model:value="props.mode" :options="dateModeOpts" default-value="date" />
  </TFormItem>
  <TFormItem label="值格式" name="valueType">
    <TSelect v-model:value="props.valueType" :options="dateValueTypeOpts" />
  </TFormItem>
  <TFormItem label="显示模式" name="displayFormat" help="审核和阅读模式下生效">
    <TSelect v-model:value="props.displayFormat" :options="dateValueTypeOpts" />
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
import { dateModeOpts, dateValueTypeOpts } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['dateRangePicker']['props']>('props', { required: true })
</script>
