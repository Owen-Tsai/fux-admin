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
  <TFormItem label="最大长度" name="maxlength">
    <TInputNumber v-model:value="props.maxlength" :step="1" :min="0" theme="column" />
  </TFormItem>
  <template v-if="!props.autoResize">
    <TFormItem label="最小行数" name="minRows">
      <TInputNumber v-model:value="props.minRows" :step="1" :min="1" theme="column" />
    </TFormItem>
    <TFormItem label="最大行数" name="maxRows">
      <TInputNumber v-model:value="props.maxRows" :step="1" :min="1" theme="column" />
    </TFormItem>
  </template>
  <TFormItem label="自动调整行数" name="autoResize" class="boolean-setter">
    <TSwitch v-model:value="props.autoResize" />
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

const props = defineModel<WidgetMap['textarea']['props']>('props', { required: true })
</script>
