<script setup lang="ts">
import { resetUserPwd, type UserVO } from '@/api/system/user'
import { type FormInstanceFunctions } from 'tdesign-vue-next'

const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const message = useMessage()

const loading = ref(false)
const state = ref<{ password?: string; id?: number; nickname?: string }>({})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    await resetUserPwd(state.value.id!, state.value.password!)
    message.success('密码重置成功')
    emit('success')
    visible.value = false
  } catch (e) {
    // logger.error(import.meta.url, '表单提交失败', e)
  } finally {
    loading.value = false
  }
}

const open = (record: UserVO) => {
  formRef.value?.reset()

  state.value.id = record.id
  state.value.nickname = record.nickname
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" title="重置密码" :confirm-loading="loading" @confirm="submit">
    <TAlert theme="warning">
      <template #message>正在重置密码，该操作无法撤销</template>
    </TAlert>

    <TForm ref="formRef" :data="state" class="mt-4">
      <TFormItem label="新密码" name="password">
        <TInput v-model:value="state.password" placeholder="请输入新密码" />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
