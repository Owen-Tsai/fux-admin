<template>
  <THeader class="flex-between px-4 lg:px-6">
    <!-- logo wrapper -->
    <div class="flex-center gap-2">
      <TButton
        v-if="bps.smallerOrEqual('md').value"
        theme="default"
        variant="text"
        shape="square"
        :icon="() => h(MenuFoldIcon)"
      />
      <Logo type="full" class="h-10" />
    </div>

    <!-- actions -->
    <div>
      <div class="flex items-center gap-2">
        <TTooltip content="通知消息" placement="bottom">
          <TButton
            theme="default"
            variant="text"
            shape="square"
            :icon="() => h(NotificationIcon)"
          />
        </TTooltip>
        <TTooltip :content="isDark ? '亮色模式' : '暗黑模式'">
          <ThemeToggle />
        </TTooltip>
        <TDropdown
          :options="userDropdownOpts"
          @click="({ value }) => onDropdownClick(value as string)"
        >
          <div
            class="bg-[var(--td-bg-color-container-hover)] px-2 max-w-140px py-1 flex items-center rounded-lg gap-2 cursor-pointer"
          >
            <TAvatar :image="user?.avatar" size="24px" class="flex-none">
              {{ user?.nickname.substring(0, 2) }}
            </TAvatar>
            <span class="truncate">{{ user?.nickname }}</span>
          </div>
        </TDropdown>
      </div>
    </div>
  </THeader>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { MenuFoldIcon, NotificationIcon } from 'tdesign-icons-vue-next'
import ThemeToggle from '@/components/_internal/theme-toggle.vue'
import bps from '@/utils/breakpoints'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import { dialog } from '@/utils/dialog'
import type { DropdownProps } from 'tdesign-vue-next'

const { isDark } = storeToRefs(useAppStore())
const { user } = storeToRefs(useUserStore())

const { push } = useRouter()

const userDropdownOpts: DropdownProps['options'] = [
  { content: '个人设置', value: '/me', divider: true },
  { content: '注销登录', value: 'logout', theme: 'error' },
]

const onDropdownClick = (value?: string) => {
  if (value?.startsWith('http')) {
    window.open(value, '_blank')
  } else if (value?.startsWith('/')) {
    push(value)
  }

  // handle commands
  if (value === 'logout') {
    dialog({
      type: 'confirm',
      theme: 'warning',
      showOverlay: true,
      header: '注销登录',
      body: '确定注销登录并退出系统吗？',
      onConfirm() {
        useUserStore()
          .logout()
          .then(() => {
            location.reload()
          })
      },
    })
  }
}
</script>
