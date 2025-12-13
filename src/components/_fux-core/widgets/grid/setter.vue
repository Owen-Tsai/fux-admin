<template>
  <TFormItem label="垂直排列方式" name="align">
    <TSelect v-model:value="props.align" :options="alignOpts" default-value="top" />
  </TFormItem>
  <TFormItem label="水平排列方式" name="justify">
    <TSelect v-model:value="props.justify" :options="justifyOpts" default-value="start" />
  </TFormItem>
  <TFormItem label="间隔" name="gutter">
    <TInputNumber v-model:value="props.gutter" :min="0" :max="100" />
  </TFormItem>
  <TFormItem label="栅格列">
    <div class="w-full">
      <div v-for="(col, i) in props.children" :key="i" class="flex items-center gap-2 mb-2">
        <TInputNumber
          v-model:value="col.span"
          :min="1"
          :max="12"
          :step="1"
          theme="column"
          class="flex-1 min-w-0"
        />
        <TButton
          variant="text"
          theme="primary"
          shape="square"
          class="flex-none"
          @click="removeCol(i)"
        >
          <template #icon>
            <Icon name="close" />
          </template>
        </TButton>
      </div>

      <TButton block @click="addCol">
        <template #icon>
          <Icon name="add" />
          新增一项
        </template>
      </TButton>
    </div>
  </TFormItem>
  <TFormItem label="隐藏" name="hide" class="boolean-setter">
    <TCheckbox v-model:value="props.hide" />
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['grid']['props']>('props', { required: true })

const alignOpts = [
  { label: '顶部对齐', value: 'top' },
  { label: '中间对齐', value: 'middle' },
  { label: '底部对齐', value: 'bottom' },
  { label: '拉伸填充', value: 'stretch' },
]

const justifyOpts = [
  { label: '开端对齐', value: 'start' },
  { label: '末端对齐', value: 'end' },
  { label: '中间对齐', value: 'center' },
  { label: '两端对齐', value: 'space-between' },
  { label: '四周填充', value: 'space-around' },
]

const addCol = () => {
  const span = props.value.children.reduce((acc, col) => acc + (col.span || 0), 0)
  props.value.children.push({
    span: 12 - span,
    widgets: [],
  })
}

const removeCol = (idx: number) => {
  props.value.children.splice(idx, 1)
}
</script>
