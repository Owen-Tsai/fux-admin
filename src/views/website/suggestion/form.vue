<template>
  <AModal v-model:open="visible" title="编辑" :confirm-loading="loading" @ok="submit">
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="类型" name="type">
          <ARadioGroup v-model:value="formData.type" :options="COMPLAINT_SUGGESTION_TYPE" />
        </AFormItem>
        <AFormItem label="姓名" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入姓名" />
        </AFormItem>
        <AFormItem label="手机" name="mobile">
          <AInput v-model:value="formData.mobile" placeholder="请输入手机" />
        </AFormItem>
        <AFormItem label="内容" name="content">
          <ATextarea v-model:value="formData.content" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status" :options="COMPLAINT_SUGGESTION_STATUS" />
        </AFormItem>
        <AFormItem label="回复内容" name="replyContent">
          <ATextarea v-model:value="formData.replyContent" />
        </AFormItem>
        <AFormItem label="回复时间" name="replyTime">
          <ADatePicker
            v-model:value="formData.replyTime"
            value-format="x"
            placeholder="请选择回复时间"
          />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import {
  createSuggestion,
  updateSuggestion,
  getDetail,
  type SuggestionVO,
} from '@/api/website/suggestion'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'

const rules: FormProps['rules'] = {}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = ref<SuggestionVO>({})

const [COMPLAINT_SUGGESTION_TYPE, COMPLAINT_SUGGESTION_STATUS, YES_NO] = useDict(
  'complaint_suggestion_type',
  'complaint_suggestion_status',
  'yes_no',
)

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    formData.value.id = undefined
    if (mode.value === 'create') {
      await createSuggestion(formData.value)
    } else {
      await updateSuggestion(formData.value)
    }

    message.success('保存成功')
    emit('success')
    visible.value = false
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
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
  formRef.value?.resetFields()

  if (id) {
    loadData(id)
    mode.value = 'update'
  } else {
    mode.value = 'create'
  }

  visible.value = true
}

defineExpose({ open })
</script>
