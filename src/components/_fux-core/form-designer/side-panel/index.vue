<template>
  <div
    class="flex bg-[var(--td-bg-color-container)] h-full border-r border-r-[var(--td-border-level-1-color)] border-r-solid"
  >
    <div class="flex-none p-2 border-r-[var(--td-border-level-1-color)] border-r border-r-solid">
      <div class="flex flex-col justify-between items-center h-full">
        <div class="flex flex-col gap-2">
          <template v-for="tab in tabs" :key="tab.value">
            <TTooltip :content="tab.title" placement="right" :show-arrow="false">
              <TButton
                :theme="activeTab === tab.value ? 'primary' : 'default'"
                shape="square"
                @click="activeTab = tab.value"
              >
                <TIcon :name="tab.icon" />
              </TButton>
            </TTooltip>
          </template>
        </div>

        <div class="flex flex-col gap-2">
          <TTooltip content="管理 API" placement="right" :show-arrow="false">
            <TButton shape="square" theme="default">
              <TIcon name="api" />
            </TButton>
          </TTooltip>
          <TTooltip content="管理函数" placement="right" :show-arrow="false">
            <TButton shape="square" theme="default">
              <TIcon name="functions-1" />
            </TButton>
          </TTooltip>
          <TTooltip content="预览表单" placement="right" :show-arrow="false">
            <TButton shape="square" theme="default">
              <TIcon name="play" />
            </TButton>
          </TTooltip>
        </div>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <Factory v-if="activeTab === 'factory'" />
      <TreeView v-if="activeTab === 'tree'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Factory from './factory/index.vue'
import TreeView from './tree-view/index.vue'

const activeTab = ref<(typeof tabs)[number]['value']>('factory')

const tabs = [
  { title: '组件库', value: 'factory', icon: 'control-platform' },
  { title: '树视图', value: 'tree', icon: 'tree-square-dot-vertical' },
  { title: 'JSON Schema', value: 'schema', icon: 'code' },
] as const

const showFuncModal = () => {}

defineExpose({ showFuncModal })
</script>
