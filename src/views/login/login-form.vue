<template>
  <TForm ref="formRef" v-model:data="formData" :label-width="0" @submit="onSubmit">
    <TFormItem name="username">
      <TInput v-model:value="formData.username" clearable placeholder="请输入用户名" size="large">
        <template #prefix-icon>
          <TIcon name="user" />
        </template>
      </TInput>
    </TFormItem>
    <TFormItem name="password">
      <TInput
        v-model:value="formData.password"
        type="password"
        clearable
        placeholder="请输入密码"
        size="large"
      >
        <template #prefix-icon>
          <TIcon name="lock-on" />
        </template>
      </TInput>
    </TFormItem>
    <TFormItem name="memorize">
      <div class="flex items-center justify-end w-full">
        <TCheckbox v-model="formData.memorize">记住密码</TCheckbox>
      </div>
    </TFormItem>
    <TFormItem>
      <TButton type="submit" block size="large" :loading="loading">登 录</TButton>
    </TFormItem>
  </TForm>

  <Captcha
    v-if="captchaEnabled"
    ref="captcha"
    v-model:open="capcthaVisible"
    @success="(verificationCode: string) => doLogin(verificationCode)"
  />
</template>

<script setup lang="ts">
import Captcha from './captcha.vue'
import useUserStore from '@/stores/user'
import { encrypt, decrypt } from '@/utils/encryption'
import { localCache } from '@/utils/storage'

const { login } = useUserStore()

const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA === 'true'

const loading = ref(false)
const captcha = ref<InstanceType<typeof Captcha>>()
const capcthaVisible = ref(false)

const { currentRoute, push } = useRouter()

const formData = ref({
  username: '',
  password: '',
  captchaVerification: '',
  memorize: false,
})

const onSubmit = () => {
  if (captchaEnabled) {
    capcthaVisible.value = true
  } else {
    doLogin()
  }
}

const doLogin = async (verificationCode?: string) => {
  capcthaVisible.value = false
  loading.value = true
  try {
    await login({
      ...formData.value,
      captchaVerification: verificationCode,
    })

    setMemorized()

    const query = currentRoute.value.query
    const redirect: string | null = query.redirect as string | null
    delete query.redirect
    push({ path: redirect || '/', query })
  } catch (error) {
    console.error(error)
    if (captchaEnabled) {
      captcha.value?.reload()
    }
  } finally {
    loading.value = false
  }
}

// 获取记忆的用户名和密码
const getMemorized = () => {
  const pwd = localCache.get('password')
  if (pwd) {
    formData.value.username = localCache.get('username')
    formData.value.password = decrypt(pwd as string) || ''
  }
}

// 当勾选记住密码时，设置记忆 7d
const setMemorized = () => {
  console.log('called', formData.value.memorize)
  const exp = 3600 * 24 * 7
  const memorize = formData.value.memorize
  if (memorize) {
    localCache.set('username', formData.value.username, { exp })
    localCache.set('password', encrypt(formData.value.password), { exp })
    console.log('set memorized')
  } else {
    localCache.delete('username')
    localCache.delete('password')
  }
}

getMemorized()
</script>
