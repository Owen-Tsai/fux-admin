<template>
  <div class="page">
    <div class="py-10 flex flex-col items-center justify-center gap-4">
      <Logo class="h-14" />
      <div class="text-secondary">正确、简洁且易于扩展的低代码开发平台</div>
    </div>

    <div class="flex-1">
      <div class="w-70 mx-auto">
        <div class="form-title relative flex items-center justify-center mb-8">
          <div
            class="bg-[var(--td-brand-color-1)] border-[var(--td-brand-color)] border-solid border-1 text-brand rounded-full px-4 py-2 inline-flex items-center justify-center relative z-1"
          >
            管理员登录
          </div>
        </div>
        <LoginForm />
      </div>

      <div class="text-secondary mt-10">{{ footerText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from './login-form.vue'

const footerText = import.meta.env.VITE_APP_FOOTER
</script>

<style lang="scss" scoped>
.page {
  background: url('@/assets/img/login-bg.png') no-repeat top center;
  background-size: 100%;
  background-attachment: fixed;
  @apply min-h-screen flex flex-col items-center h-full;
}

.form-title {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 2px;
    background: radial-gradient(50% 50% at 50% 50%, var(--td-brand-color), transparent);
  }
}
</style>
