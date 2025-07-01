<script setup lang="ts">
import WidgetRenderer from '@fusionx/core/widgets/widget/index.vue'
import request from '@/utils/request'
import { last } from 'lodash-es'
import { useFuxNestedModelCtxProvide } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { widget, fetchTableData } = defineProps<{
  widget: WidgetMap['dataTable']
  fetchTableData: () => Promise<void>
}>()

const URL_PREFIX = widget.props.url || ''
const loading = ref(false)
const visible = ref(false)

const message = useMessage()

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const data = ref<Record<string, any>>({})
const mode = ref<'create' | 'update' | 'view'>('create')

const dialogTitle = computed(() => {
  const label = widget.props.field.label || ''
  return mode.value === 'create'
    ? `新建${label}`
    : mode.value === 'update'
      ? `编辑${label}`
      : `查看${label}`
})
const isDisabled = computed(() => mode.value === 'view')

const loadData = async (id: string) => {
  loading.value = true
  const url = `${URL_PREFIX}/get?id=${id}`
  data.value = await request.get({ url })
  loading.value = false
}

const onSubmit = async () => {
  loading.value = true
  try {
    const url = `${URL_PREFIX}/${mode.value}`
    const tableName = last(url.split('/'))
    if (!tableName) {
      throw new Error('无法获取表名，请设置正确的 URL')
    }
    const result = await formRef.value?.validate()
    if (result !== true) {
      return
    }
    // TODO: appParamsCtx
    if (mode.value === 'update') {
      await request.put({ url, data: data.value })
    } else {
      await request.post({ url, data: data.value })
    }

    message.success('操作成功')
    visible.value = false

    formRef.value?.reset()
    await fetchTableData()
  } finally {
    visible.value = false
    loading.value = false
  }
}

const onAdd = () => {
  mode.value = 'create'
}

const onEdit = async (id: string) => {
  mode.value = 'update'
  await loadData(id)
}

const onView = async (id: string) => {
  mode.value = 'view'
  await loadData(id)
}

useFuxNestedModelCtxProvide(data)

defineExpose({ onAdd, onEdit, onView })
</script>

<template>
  <TDialog v-model:visible="visible" :header="dialogTitle" @confirm="onSubmit">
    <TForm
      ref="formRef"
      :data="data"
      :colon="widget.props.form?.colon"
      :label-width="widget.props.form?.labelWidth"
      :label-align="widget.props.form?.labelAlign"
      :layout="widget.props.form?.layout === 'vertical' ? 'vertical' : 'inline'"
      :disabled="isDisabled"
    >
      <WidgetRenderer v-for="w in widget.props.widgets" :key="w.uid" :widget="w" />
    </TForm>
  </TDialog>
</template>
