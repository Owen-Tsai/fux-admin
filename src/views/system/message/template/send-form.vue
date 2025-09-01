<script setup lang="ts">
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import {
  getTemplateDetail,
  sendMessage,
  type MessageSendReqVO,
  type TemplateVO,
} from '@/api/system/message/template'
import { getSimpleUserList } from '@/api/system/user'

const loading = ref(false)
const visible = ref(false)

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const formData = ref<MessageSendReqVO>({
  templateParams: {},
  userType: 2,
})
const template = ref<TemplateVO>({})

const message = useMessage()

const [userTypeOpts] = useDict('user_type')

const { data: userOpts, pending: userLoading } = useRequest(getSimpleUserList, { immediate: true })

const rules = ref<FormProps['rules']>({
  userType: [{ required: true, message: '请选择用户类型' }],
  userId: [{ required: true, message: '请选择接收人' }],
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await sendMessage({
        ...formData.value,
        templateCode: template.value.code,
      } as MessageSendReqVO)
      message.success('发送成功')
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
  template.value = res
  loading.value = false
}

const open = (id: number) => {
  formRef.value?.reset({ type: 'initial' })
  loadData(id)
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="`测试站内信发送-${template.name}`"
    :confirm-loading="loading"
    width="600px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TAlert>
        <template #message>
          当前测试站内信模板
          {{ template.name }}
          的发送。如需在实际环境发送，请参考开发文档并在后端开发响应的代码与接口。
        </template>
      </TAlert>
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="140" class="mt-4!">
        <TFormItem label="用户类型" name="userType">
          <TSelect v-model:value="formData.userType" :options="userTypeOpts" />
        </TFormItem>
        <TFormItem label="接收人" name="userId">
          <TSelect
            v-model:value="formData.userId"
            :options="userOpts"
            :loading="userLoading"
            filterable
            clearable
            :keys="{ label: 'nickname', value: 'id' }"
            placeholder="请选择接收人"
          />
        </TFormItem>
        <TFormItem label="模板内容">
          <TTextarea v-model:value="template.content" readonly />
        </TFormItem>

        <TFormItem
          v-for="(item, index) in template.params"
          :key="index"
          :label="`参数{${item}}`"
          :name="`templateParams.${item}`"
          :rules="[{ required: true, message: '请输入参数值' }]"
        >
          <TInput v-model:value="formData.templateParams![item]" placeholder="请输入参数值" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
