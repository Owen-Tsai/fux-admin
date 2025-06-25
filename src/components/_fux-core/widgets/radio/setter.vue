<template>
  <TFormItem label="默认值" name="defaultValue" help="支持使用表达式">
    <TInput v-model:value="props.defaultValue" />
  </TFormItem>
  <TFormItem label="帮助文字" name="extra">
    <TInput v-model:value="props.field.extra" />
  </TFormItem>
  <TFormItem label="单选框类型" name="variant">
    <TSelect v-model:value="props.variant" :options="variantOpts" />
  </TFormItem>

  <OptionSetter v-model:options="props.options" />

  <TFormItem label="可取消勾选" name="allowUncheck" class="boolean-setter">
    <TSwitch v-model:value="props.allowUncheck" />
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

const props = defineModel<WidgetMap['radio']['props']>('props', { required: true })

const variantOpts = [
  { label: '普通', value: 'radio' },
  { label: '线型按钮', value: 'outline' },
  { label: '白色填充按钮', value: 'default-filled' },
  { label: '主色填充按钮', value: 'primary-filled' },
]
</script>
