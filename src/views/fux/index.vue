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
        <TButton @click="save(appDesignMode)">
          <template #icon>
            <Icon name="save" />
          </template>
          保存
        </TButton>
        <TTooltip content="查看 Schema">
          <TButton variant="text" shape="square" @click="drawerVisible = true">
            <template #icon>
              <Icon name="system-code" />
            </template>
          </TButton>
        </TTooltip>
        <TTooltip content="回到首页">
          <TButton variant="text" shape="square" @click="$router.push('/index')">
            <template #icon>
              <Icon name="rollback" />
            </template>
          </TButton>
        </TTooltip>
      </div>
    </header>

    <TLoading :loading="isAppSchemaLoading" fullscreen />
    <template v-if="!isAppSchemaLoading">
      <DataConfig v-if="current === 0" @finish="current = 1" />
      <FormConfig v-if="current === 1" />
      <FlowConfig v-if="current === 2" />
    </template>

    <TDrawer v-model:visible="drawerVisible" header="应用 Schema 预览" size="40%">
      <div class="mt-4 w-full" v-html="code" />
      <template #footer>
        <TButton :disabled="copied" @click="copy()">{{ copied ? '已复制' : '复制' }}</TButton>
        <TButton theme="default" @click="drawerVisible = false">关闭</TButton>
      </template>
    </TDrawer>
  </div>
</template>

<script setup lang="ts">
import DataConfig from './data/index.vue'
import FormConfig from './form/index.vue'
import FlowConfig from './flow/index.vue'
import { useAppLoad, useAppSave, useAppDesignCtxInject } from './use-app-design'
import highlight from '@/utils/highlighter'
import type { StepsProps } from 'tdesign-vue-next'

const { appSchema, appSchemaDetail, appDetail, appDesignMode, isAppSchemaLoading } = useAppLoad()
const { save } = useAppSave(appSchema, appSchemaDetail, appDetail)

const steps: StepsProps['options'] = [
  { title: '数据源配置' },
  { title: '表单设计' },
  { title: '流程编排' },
]

const current = ref(0)

const drawerVisible = ref(false)
const { copied, copy } = useClipboard({
  source: () => JSON.stringify(appSchema.value, null, 2),
})

const code = computedAsync(
  async () => await highlight(JSON.stringify(appSchema.value, null, 2), 'json'),
)
</script>
