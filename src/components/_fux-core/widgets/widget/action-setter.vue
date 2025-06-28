<template>
  <template v-if="selectedWidget?.class === 'form'">
    <TFormItem label="动作事件">
      <div class="w-full">
        <div
          v-for="(entry, evtName) in selectedWidget.props.event"
          :key="evtName"
          class="border-[var(--td-border-level-2-color)] rounded-[var(--td-radius-medium)] border border-solid mb-2 p-2"
        >
          <div class="flex-between">
            <div class="font-bold">{{ evtName }}</div>
            <div class="flex items-center gap-1">
              <TButton variant="text" size="small" shape="square" @click="onEditAction()">
                <template #icon>
                  <TIcon name="code" />
                </template>
              </TButton>
              <TButton variant="text" size="small" shape="square" @click="onDeleteAction(evtName)">
                <template #icon>
                  <TIcon name="delete" />
                </template>
              </TButton>
            </div>
          </div>

          <div class="mt-1">
            <TSelect
              :value="selectedWidget.props.event?.[evtName]"
              size="small"
              :options="functionsList"
            />
          </div>
        </div>

        <TDropdown :popup-props="{ overlayInnerStyle }" trigger="click" @click="onAddAction">
          <TButton theme="default" block>增加动作</TButton>
          <TDropdownMenu>
            <TDropdownItem
              v-for="evt in eventOpts"
              :key="evt"
              :value="evt"
              :disabled="selectedWidget.props.event?.[evt] !== undefined"
              class="!w-full !max-w-full"
            >
              {{ evt }}
            </TDropdownItem>
          </TDropdownMenu>
        </TDropdown>
      </div>
    </TFormItem>
  </template>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { generateId } from '@fusionx/core/utils'
import { injectSidePanelCtx } from '@fusionx/core/form-designer/index.vue'
import type { TdDropdownProps, TdPopupProps } from 'tdesign-vue-next'
import type { FormWidget } from '@fusionx/core/types'

const { appSchema, selectedWidget } = useDesignerCtxInject()!

const eventOpts = ['input', 'focus', 'blur', 'change', 'ready']

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

  if ((selectedWidget.value as FormWidget).props.event === undefined) {
    ;(selectedWidget.value as FormWidget).props.event = {}
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
  ;(selectedWidget.value as FormWidget).props.event![evt as string] = id
}

const onDeleteAction = (evtName: string) => {
  delete (selectedWidget.value as FormWidget).props.event?.[evtName]
}

const onEditAction = () => {
  ctx.showModal?.('func')
}
</script>
