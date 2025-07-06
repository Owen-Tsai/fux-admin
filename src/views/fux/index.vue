<template>
  <div class="flex flex-col h-screen">
    <header
      class="px-6 grid grid-cols-3 flex-none bg-[var(--td-bg-color-container)] h-[var(--td-comp-size-xxxl)] border-b-1 border-b-solid border-[var(--td-border-level-1-color)]"
    >
      <div class="flex items-center gap-1">
        <Logo type="simple" class="h-8 lg:h-10" />
        <TDivider layout="vertical" class="full" />
        <h1 class="text-lg text-[var(--td-text-color-primary)]">应用设计</h1>
      </div>

      <div class="flex items-center justify-center">
        <TSteps v-model:current="current" :options="steps" />
      </div>

      <div class="flex items-center justify-end gap-2">
        <TButton>
          <template #icon>
            <TIcon name="save" />
          </template>
          保存
        </TButton>
        <TTooltip content="查看 Schema">
          <TButton variant="text" shape="square">
            <template #icon>
              <TIcon name="system-code" />
            </template>
          </TButton>
        </TTooltip>
        <TTooltip content="回到首页">
          <TButton variant="text" shape="square">
            <template #icon>
              <TIcon name="rollback" />
            </template>
          </TButton>
        </TTooltip>
      </div>
    </header>

    <DataConfig v-if="current === 0" @finish="current = 1" />
    <FormConfig v-if="current === 1" />
  </div>
</template>

<script setup lang="ts">
import DataConfig from './data/index.vue'
import FormConfig from './form/index.vue'
import { useAppLoad, useAppSave, useAppDesignCtxInject } from './use-app-design'
import type { StepsProps } from 'tdesign-vue-next'

useAppLoad()

const steps: StepsProps['options'] = [
  { title: '数据源配置' },
  { title: '表单设计' },
  { title: '流程编排' },
]

const current = ref(0)
</script>
