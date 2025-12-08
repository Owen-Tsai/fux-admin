<template>
  <TFormItem label="生命周期事件">
    <div class="w-full">
      <div
        v-for="(funcUID, phase) in appSchema.form.lifecycle"
        :key="phase"
        class="border-[var(--td-border-level-2-color)] rounded-[var(--td-radius-medium)] border border-solid mb-2 p-2"
      >
        <div class="flex-between">
          <div class="font-bold">{{ phase }}</div>
          <div class="flex items-center gap-1">
            <TButton variant="text" size="small" shape="square" @click="onEditAction()">
              <template #icon>
                <Icon name="code" />
              </template>
            </TButton>
            <TButton variant="text" size="small" shape="square" @click="onDeleteAction(phase)">
              <template #icon>
                <Icon name="delete" />
              </template>
            </TButton>
          </div>
        </div>

        <div class="mt-1">
          <TSelect
            v-if="appSchema.form.lifecycle?.[phase]"
            v-model:value="appSchema.form.lifecycle[phase]"
            size="small"
            :options="functionsList"
          />
        </div>
      </div>

      <TDropdown :popup-props="{ overlayInnerStyle }" trigger="click" @click="onAddAction">
        <TButton theme="default" block>增加钩子</TButton>
        <TDropdownMenu>
          <TDropdownItem
            v-for="{ label, value } in lifecycleOpts"
            :key="value"
            :value="value"
            :disabled="appSchema.form.lifecycle?.[value] !== undefined"
            class="!w-full !max-w-full"
          >
            {{ label }}
          </TDropdownItem>
        </TDropdownMenu>
      </TDropdown>
    </div>
  </TFormItem>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { generateId } from '@fusionx/core/utils'
import { injectSidePanelCtx } from '@fusionx/core/form-designer/index.vue'
import type { TdDropdownProps, TdPopupProps } from 'tdesign-vue-next'
import type { LifecyclePhase } from '@fusionx/core/types'

const { appSchema } = useDesignerCtxInject()!

const lifecycleOpts: Array<{ value: LifecyclePhase; label: string }> = [
  {
    value: 'loaded',
    label: '数据加载完成',
  },
  {
    value: 'beforeSubmit',
    label: '提交前',
  },
]

const overlayInnerStyle: TdPopupProps['overlayInnerStyle'] = (triggerEl) => {
  const { width } = useElementSize(triggerEl)
  return {
    width: `${width.value}px`,
  }
}

const functionsList = computed(() => {
  if (appSchema.value.form.function === undefined) {
    return []
  }
  return Object.keys(appSchema.value.form.function).map((fid) => ({
    value: fid,
    label: appSchema.value.form.function![fid].name,
  }))
})

const ctx = injectSidePanelCtx()

const onAddAction: TdDropdownProps['onClick'] = ({ value: evt }) => {
  if (evt === undefined) {
    return
  }

  if (appSchema.value.form.lifecycle === undefined) {
    appSchema.value.form.lifecycle = {}
  }
  if (appSchema.value.form.function === undefined) {
    appSchema.value.form.function = {}
  }

  const id = generateId()

  appSchema.value.form.function[id] = {
    name: `${evt}_${id}`,
    body: '// 请输入函数体',
  }

  // set as handler
  appSchema.value.form.lifecycle[evt as LifecyclePhase] = id
}

const onDeleteAction = (phase: string) => {
  delete (appSchema.value.form.lifecycle as Record<LifecyclePhase, string>)[phase as LifecyclePhase]
}

const onEditAction = () => {
  ctx.showModal.value?.('func')
}
</script>
