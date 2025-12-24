<template>
  <TDialog
    v-model:visible="visible"
    header="测试消息发送"
    :confirm-loading="loading"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :label-width="100" :data="formData" :rules="rules" label-align="top">
        <TFormItem label="模板编码" name="templateCode">
          <TInput
            v-model:value="formData.templateCode"
            placeholder="请输入模板编码"
            readonly
            disabled
          />
        </TFormItem>
        <TFormItem label="手机号" name="mobile">
          <TInput v-model:value="formData.mobile" placeholder="请输入接收手机号" maxlength="11" />
        </TFormItem>
        <TFormItem
          v-for="item in params"
          :key="item"
          :label="item"
          :name="getTemplateParamsName(item)"
          :rules="[
            { required: true, message: `请输入${item}参数值`, trigger: 'blur', type: 'error' },
          ]"
        >
          <TInput v-model="formData.templateParams[item]" placeholder="请输入参数值" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
import type { SendTestSmsParams, TemplateVO } from '@/api/system/sms/template.ts'
import { sendTestSms } from '@/api/system/sms/template.ts'

const rules: FormProps['rules'] = {
  mobile: [
    { required: true, message: '请输入手机号', type: 'error', trigger: 'blur' },
    {
      telnumber: true,
      message: '请输入正确的手机号码', type: 'error', trigger: 'blur'
    },
  ],
}

const visible = ref(false)

const emit = defineEmits(['success'])
const message = useMessage()
const formRef = ref<FormInstanceFunctions>()

const loading = ref(false)
const params = ref<Array<string>>([])

const getTemplateParamsName = (item: string) => {
  return 'templateParams.' + item
}

const formData = ref<SendTestSmsParams>({
  templateCode: '',
  mobile: '',
  templateParams: {},
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    console.log(result)
    if (result === true) {
      console.log(formData.value)
      const result = await sendTestSms(formData.value)
      message.success('发送成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const open = (row: TemplateVO) => {
  console.log(row)
  formRef.value?.reset({ type: 'initial' })
  formData.value.templateCode = row?.code || ''
  // 清空之前的参数
  params.value = row.params || []
  formData.value.templateParams = {}

  visible.value = true
}

defineExpose({ open })
</script>
