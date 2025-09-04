<script setup lang="ts">
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import {
  getChannelDetail,
  addChannel,
  updateChannel,
  type ChannelVO,
} from '@/api/system/sms/channel'

const loading = ref(false)
const visible = ref(false)

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const formData = ref<ChannelVO>({
  status: 0,
})

const mode = ref<'create' | 'update'>('create')
const emit = defineEmits(['success'])

const message = useMessage()

const [statusOpts, smsChannelOpts] = useDict('common_status', 'system_sms_channel_code')

const rules = ref<FormProps['rules']>({
  signature: [{ required: true, message: '请输入渠道名称' }],
  code: [{ required: true, message: '请选择渠道编码' }],
  apiKey: [{ required: true, message: '请输入短信渠道的 API Key' }],
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addChannel(formData.value)
      } else {
        await updateChannel(formData.value)
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
  const res = await getChannelDetail(id)
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
    :header="mode === 'create' ? '新增短信渠道' : '编辑短信渠道'"
    :confirm-loading="loading"
    width="500px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="渠道名称" name="signature">
          <TInput v-model:value="formData.signature" placeholder="请输入渠道名称" />
        </TFormItem>
        <TFormItem label="渠道编码" name="code">
          <TSelect
            v-model:value="formData.code"
            :options="smsChannelOpts"
            placeholder="请选择渠道编码"
          />
        </TFormItem>
        <TFormItem label="启用状态" name="status">
          <TRadioGroup v-model:value="formData.status" :options="statusOpts" />
        </TFormItem>
        <TFormItem label="备注" name="remark">
          <TTextarea v-model:value="formData.remark" placeholder="请输入备注信息" />
        </TFormItem>
        <TFormItem label="API Key" name="apiKey">
          <TInput v-model:value="formData.apiKey" placeholder="请输入短信渠道的 API 账号" />
        </TFormItem>
        <TFormItem label="密钥" name="apiSecret">
          <TInput v-model:value="formData.apiSecret" placeholder="请输入短信渠道的 API 密钥" />
        </TFormItem>
        <TFormItem label="发送回调URL" name="callbackUrl">
          <TInput
            v-model:value="formData.callbackUrl"
            placeholder="请输入短信发送后的回调请求地址"
          />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
