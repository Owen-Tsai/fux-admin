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
    <TInputNumber v-model:value="props.maxlength" theme="column" />
  </TFormItem>
  <TFormItem label="前缀图标" name="prefixIcon">
    <IconSelect v-model:value="props.prefixIcon" :panel-match-input-width="false" />
  </TFormItem>
  <TFormItem label="显示字数" name="showCount" class="boolean-setter">
    <TSwitch v-model:value="props.showCount" />
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

const props = defineModel<WidgetMap['input']['props']>('props', { required: true })
</script>
