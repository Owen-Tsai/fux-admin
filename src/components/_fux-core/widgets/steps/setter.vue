<template>
  <TFormItem label="标签页面板">
    <div>
      <div v-for="(col, i) in props.children" :key="i" class="flex items-center gap-2 mb-2">
        <div class="flex-1 min-w-0 grid grid-cols-2 gap-2">
          <TInput v-model:value="col.title" />
          <TInput v-model:value="col.desc" />
        </div>
        <TButton
          variant="text"
          theme="primary"
          shape="square"
          class="flex-none"
          @click="removePane(i)"
        >
          <template #icon>
            <TIcon name="close" />
          </template>
        </TButton>
      </div>

      <TButton block @click="addPane">
        <template #icon>
          <TIcon name="add" />
          新增一项
        </template>
      </TButton>
    </div>
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['steps']['props']>('props', { required: true })

const addPane = () => {
  props.value.children.push({
    title: '新步骤',
    widgets: [],
    desc: '',
  })
}

const removePane = (idx: number) => {
  props.value.children.splice(idx, 1)
}
</script>
