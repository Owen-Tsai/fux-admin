<script setup lang="ts">
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import {
  getTemplateDetail,
  createTemplate,
  updateTemplate,
  type TemplateVO,
} from '@/api/system/message/template'

const loading = ref(false)
const visible = ref(false)

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const formData = ref<TemplateVO>({
  status: 0,
})

const mode = ref<'create' | 'update'>('create')

const emit = defineEmits(['success'])

const message = useMessage()

const [statusOpts, smsTemplateTypeOpts] = useDict('common_status', 'system_sms_template_type')

const rules = ref<FormProps['rules']>({
  type: [{ required: true, message: '请选择站内信类型' }],
  name: [{ required: true, message: '请输入模板名称' }],
  code: [{ required: true, message: '请输入模板编码' }],
  content: [{ required: true, message: '请输入模板内容' }],
  nickname: [{ required: true, message: '请输入发送方名称' }],
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createTemplate(formData.value)
      } else {
        await updateTemplate(formData.value)
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
  const res = await getTemplateDetail(id)
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
    :header="mode === 'create' ? '新增站内信模板' : '编辑站内信模板'"
    :confirm-loading="loading"
    width="500px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="站内信类型" name="type">
          <TSelect
            v-model:value="formData.type"
            :options="smsTemplateTypeOpts"
            placeholder="请选择站内信类型"
          />
        </TFormItem>
        <TFormItem label="模板名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入模板名称" />
        </TFormItem>
        <TFormItem label="模板编码" name="code">
          <TInput v-model:value="formData.code" placeholder="请输入模板编码" />
        </TFormItem>
        <TFormItem label="发送方名称" name="nickname">
          <TInput v-model:value="formData.nickname" placeholder="如：“系统”" />
        </TFormItem>
        <TFormItem label="模板内容" name="content">
          <TTextarea v-model:value="formData.content" placeholder="请输入模板内容" />
        </TFormItem>
        <TFormItem label="启用状态" name="status">
          <TRadioGroup v-model:value="formData.status" :options="statusOpts" />
        </TFormItem>
        <TFormItem label="备注" name="remark">
          <TTextarea v-model:value="formData.remark" placeholder="请输入备注信息" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
