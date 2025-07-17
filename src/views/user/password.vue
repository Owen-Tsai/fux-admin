<script setup lang="ts">
import { updatePassword } from '@/api/system/user/profile'
import useUserStore from '@/stores/user'
import type { FormProps, FormInstanceFunctions, CustomValidator } from 'tdesign-vue-next'

const message = useMessage()
const { logout } = useUserStore()

const passValidator: CustomValidator = (val) => {
  if (val !== data.value.newPassword) {
    return {
      result: false,
      message: '两次输入密码不一致',
      type: 'error',
    }
  }

  return { result: true, message: '' }
}

const rules: FormProps['rules'] = {
  oldPassword: [{ required: true, message: '请输入旧密码' }],
  newPassword: [{ required: true, message: '请设置新密码' }],
  newPasswordConfirm: [
    { required: true, message: '请再次输入新密码' },
    { validator: passValidator, trigger: 'change' },
  ],
}

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const loading = ref(false)

const data = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
})

const submit = async () => {
  loading.value = false
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await updatePassword({
        oldPassword: data.value.oldPassword,
        newPassword: data.value.newPassword,
      })
      message.success('修改成功，即将重新登录', 3000)

      setTimeout(() => {
        logout().then(() => {
          window.location.href = '/login'
        })
      }, 3000)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <TForm ref="formRef" :data="data" :rules="rules" @submit="submit">
    <TFormItem label="旧密码" name="oldPassword">
      <TInput v-model:value="data.oldPassword" type="password" />
    </TFormItem>
    <TFormItem label="新密码" name="newPassword">
      <TInput v-model:value="data.newPassword" type="password" />
    </TFormItem>
    <TFormItem label="确认新密码" name="newPasswordConfirm">
      <TInput v-model:value="data.newPasswordConfirm" type="password" />
    </TFormItem>
    <TFormItem>
      <TButton theme="primary" :loading="loading" type="submit">保存</TButton>
    </TFormItem>
  </TForm>
</template>
