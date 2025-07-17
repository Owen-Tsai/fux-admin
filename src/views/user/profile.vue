<script setup lang="ts">
import { updateProfile, type ProfileVO } from '@/api/system/user/profile'
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'

const rules: FormProps['rules'] = {
  nickname: [{ required: true, message: '请输入用户名称' }],
}

const { profile } = defineProps<{
  profile?: ProfileVO
}>()

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const emit = defineEmits(['update'])
const data = ref<ProfileVO>({})
const loading = ref(false)
const [sexOpts] = useDict('system_user_sex')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await updateProfile(data.value)
      emit('update')
    }
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (profile) {
    data.value = { ...profile }
  }
})
</script>

<template>
  <TForm ref="formRef" :data="data" :rules="rules" @submit="submit">
    <TFormItem label="用户名称" name="nickname">
      <TInput v-model:value="data.nickname" placeholder="请输入用户名称" />
    </TFormItem>
    <TFormItem label="手机号码" name="mobile">
      <TInput v-model:value="data.mobile" placeholder="请输入手机号码" />
    </TFormItem>
    <TFormItem label="电子邮箱" name="email">
      <TInput v-model:value="data.email" placeholder="请输入电子邮箱" />
    </TFormItem>
    <TFormItem label="性别" name="sex">
      <TRadioGroup v-model:value="data.sex" :options="sexOpts" />
    </TFormItem>
    <TFormItem>
      <TButton type="submit">保存</TButton>
    </TFormItem>
  </TForm>
</template>
