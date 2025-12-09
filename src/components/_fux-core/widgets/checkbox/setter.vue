<template>
  <TFormItem label="默认值" name="defaultValue" help="默认值应为数组表达式">
    <TInput v-model:value="props.defaultValue" />
  </TFormItem>
  <TFormItem label="帮助文字" name="extra">
    <TInput v-model:value="props.field.extra" />
  </TFormItem>

  <OptionSetter v-model:options="props.options" />

  <TFormItem label="最大可选数" name="max">
    <TInputNumber
      v-model:value="props.max"
      :min="1"
      :step="1"
      :decimal-places="0"
      theme="column"
      class="w-full"
    />
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
import OptionSetter from '../widget/option-setter.vue'
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['checkbox']['props']>('props', { required: true })
</script>
