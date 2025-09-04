<template>
  <TFormItem label="样式外观">
    <TSelect v-model:value="props.type" :options="typeOpts" />
  </TFormItem>
  <TFormItem label="标签页面板">
    <div>
      <div v-for="(col, i) in props.children" :key="i" class="flex items-center gap-2 mb-2">
        <TInput v-model:value="col.title" class="flex-1 min-w-0" />
        <TButton
          variant="text"
          theme="primary"
          shape="square"
          class="flex-none"
          @click="removePane(i)"
        >
          <template #icon>
            <Icon name="close" />
          </template>
        </TButton>
      </div>

      <TButton block @click="addPane">
        <template #icon>
          <Icon name="add" />
          新增一项
        </template>
      </TButton>
    </div>
  </TFormItem>
  <TFormItem class="boolean-setter">
    <template #label>
      <div class="inline-flex items-center gap-1">
        步骤模式
        <TTooltip>
          <Icon name="help-circle-filled" class="text-[var(--td-text-color-disabled)]" />
          <template #content>
            <div class="max-w-300px">
              一个应用中只能包含一个开启步骤模式的组件。开启后，对于个人用户自行申报的应用，必须填写完第一步的表单后才可以提交剩余步骤的数据。对于非个人用户自行申报（单位开通权限）的应用，该选项无特殊作用
            </div>
          </template>
        </TTooltip>
      </div>
    </template>
    <TSwitch v-model:value="props.stepsMode" />
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['tabs']['props']>('props', { required: true })

const typeOpts = [
  { label: '线性', value: 'line' },
  { label: '卡片型', value: 'card' },
]

const addPane = () => {
  props.value.children.push({
    title: '新标签页',
    widgets: [],
  })
}

const removePane = (idx: number) => {
  props.value.children.splice(idx, 1)
}
</script>
