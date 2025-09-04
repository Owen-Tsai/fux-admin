<template>
  <div class="h-full bg-[var(--td-bg-color-secondarycontainer)] overflow-auto relative">
    <div class="sticky top-0 left-0 w-full py-4">
      <div class="flex items-center gap-2 w-9/10 mx-auto">
        <TButton shape="square" theme="default" variant="outline" @click="scale -= 10">
          <template #icon>
            <Icon name="zoom-out" />
          </template>
        </TButton>
        <div>{{ scale }}%</div>
        <TButton shape="square" theme="default" variant="outline" @click="scale += 10">
          <template #icon>
            <Icon name="zoom-in" />
          </template>
        </TButton>
      </div>
    </div>

    <div class="w-full pb-12">
      <FlowCanvas class="transform-origin-tl" :style="{ transform: `scale(${scale / 100})` }" />
    </div>
    <FlowSetter v-model:visible="setterVisible" />
  </div>
</template>

<script setup lang="ts">
import FlowCanvas from './canvas/index.vue'
import FlowSetter from './setter/index.vue'
import { useClamp } from '@vueuse/math'
import { useFlowBuilderCtxProvide } from '@fusionx/core/hooks'
import type { AppSchema } from '@fusionx/core/types'

const workflowSchema = defineModel<AppSchema['flow']>('workflowSchema', { required: true })

const scale = useClamp(100, 50, 200)

const setterVisible = ref(false)

const { selectedNode } = useFlowBuilderCtxProvide(workflowSchema)

watch(selectedNode, (node) => {
  if (node) {
    setterVisible.value = true
  }
})
</script>
