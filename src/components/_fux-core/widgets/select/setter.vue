<template>
  <TFormItem label="默认值" name="defaultValue" help="多选时，使用回车增加多个值">
    <TInput v-if="!props.multiple" v-model:value="props.defaultValue as string" />
    <TTagInput v-else v-model:value="props.defaultValue as string[]" />
  </TFormItem>
  <TFormItem label="占位文字" name="placeholder">
    <TInput v-model:value="props.placeholder" />
  </TFormItem>
  <TFormItem label="帮助文字" name="extra">
    <TInput v-model:value="props.field.extra" />
  </TFormItem>
  <TFormItem label="自定义选项字段" name="fieldNames" help="请输入合法的 JSON 字符串">
    <TInput v-model:value="props.fieldNames" placeholder='{ "label": ?, "value": ? }' />
  </TFormItem>

  <OptionSetter v-model:options="props.options" />

  <TFormItem
    label="下拉菜单高度"
    name="popupHeight"
    help="请输入含单位的值(px/%/rem...); 设置后将开启虚拟滚动"
  >
    <TInput v-model:value="props.popupHeight" clearable />
  </TFormItem>
  <TFormItem label="是否多选" name="multiple" class="boolean-setter">
    <TSwitch
      v-model:value="props.multiple"
      @change="(value) => onMultipleChange(value as boolean)"
    />
  </TFormItem>
  <template v-if="props.multiple">
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
    <TFormItem
      label="最小折叠数量"
      name="minCollapsedNum"
      help="当选择的选项超过该数量时将折叠显示为 +N"
    >
      <TInputNumber
        v-model:value="props.minCollapsedNum"
        :min="1"
        :step="1"
        :decimal-places="0"
        theme="column"
        class="w-full"
      />
    </TFormItem>
  </template>
  <TFormItem label="允许清空" name="allowClear" class="boolean-setter">
    <TSwitch v-model:value="props.allowClear" />
  </TFormItem>
  <TFormItem label="允许创建选项" name="creatable" class="boolean-setter">
    <TSwitch v-model:value="props.creatable" />
  </TFormItem>
  <TFormItem label="允许过滤" name="filterable" class="boolean-setter">
    <TSwitch v-model:value="props.filterable" />
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

const props = defineModel<WidgetMap['select']['props']>('props', { required: true })

const onMultipleChange = (value: boolean) => {
  if (value) {
    props.value.max = 1
    props.value.defaultValue = []
    props.value.minCollapsedNum = 3
  } else {
    props.value.max = undefined
    props.value.defaultValue = undefined
    props.value.minCollapsedNum = undefined
  }
}
</script>
