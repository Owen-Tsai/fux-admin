<script setup lang="ts">
import {
  createIPListEntry,
  updateIPListEntry,
  getDetail,
  type IPListEntryVO,
} from '@/api/system/ip/list'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()
const { query } = useRoute()
const { blocked } = query

const rules: FormProps['rules'] = {
  ipAddress: [{ required: true, message: '请填写 IP 地址' }],
  listType: [{ required: true, message: '请选择 IP 类型' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<IPListEntryVO>({
  id: undefined,
  listType: blocked === 'false',
})

const [ipTypeOpts] = useDict('system_ip_list')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createIPListEntry(formData.value)
      } else {
        await updateIPListEntry(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增 IP' : '编辑 IP'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="IP 地址" name="ipAddress">
          <TInput v-model:value="formData.ipAddress" placeholder="如：192.168.1.1" />
        </TFormItem>
        <TFormItem label="IP 类型" name="listType">
          <TSelect v-model:value="formData.listType" :options="ipTypeOpts" disabled />
        </TFormItem>
        <TFormItem label="备注" name="description">
          <TTextarea v-model:value="formData.description" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
