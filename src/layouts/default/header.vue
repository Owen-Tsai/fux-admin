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
        @click="emit('click:drawer')"
      />
      <Logo :type="bps.smallerOrEqual('md').value ? 'simple' : 'full'" class="h-8 lg:h-10" />
    </div>

    <!-- actions -->
    <div>
      <div class="flex items-center gap-2">
        <TPopup placement="bottom-right" trigger="click">
          <TTooltip content="通知消息" placement="bottom">
            <TBadge :count="count" size="small" :offset="[6, 6]">
              <TButton
                theme="default"
                variant="text"
                shape="square"
                :icon="() => h(NotificationIcon)"
              />
            </TBadge>
          </TTooltip>

          <template #content>
            <TLoading :loading="pending" class="w-400px p-1">
              <div
                v-for="(message, i) in messages"
                :key="i"
                class="p-[var(--td-pop-padding-m)] hover:bg-[var(--td-bg-color-container-hover)] cursor-pointer rounded-[var(--td-radius-default)]"
              >
                <div class="flex items-center justify-between">
                  <div class="font-bold">发送人：{{ message.templateNickname }}</div>
                  <div class="text-secondary text-sm">
                    {{ dayjs(message.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </div>
                <div class="line-clamp-2 mt-1">{{ message.templateContent }}</div>
              </div>
            </TLoading>
          </template>
        </TPopup>
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
import dayjs from 'dayjs'
import { MenuFoldIcon, NotificationIcon } from 'tdesign-icons-vue-next'
import ThemeToggle from '@/components/_internal/theme-toggle.vue'
import { getUnreadList, getUnreadCount } from '@/api/system/message'
import bps from '@/utils/breakpoints'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import type { DropdownProps } from 'tdesign-vue-next'

const { isDark } = storeToRefs(useAppStore())
const { user } = storeToRefs(useUserStore())

const { push } = useRouter()
const dialog = useDialog()

const emit = defineEmits(['click:drawer'])

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
    dialog.confirm({
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

const { data: messages, pending, execute: getMsgList } = useRequest(getUnreadList)
const { data: count, execute: getMsgCount } = useRequest(getUnreadCount, {
  immediate: true,
  onSuccess(num) {
    if (num > 0) {
      getMsgList()
    }
  },
})
</script>
