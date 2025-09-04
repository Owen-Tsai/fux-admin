<template>
  <TDrawer v-model:visible="visible" size="40%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>
    <TDescriptions v-if="entry" bordered :column="2" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="日志主键">{{ entry.id }}</TDescriptionsItem>
      <TDescriptionsItem label="操作类型">
        {{ systemLoginType.find((e) => e.value === entry?.logType)?.label }}
      </TDescriptionsItem>
      <TDescriptionsItem label="用户编号">{{ entry.userId }}</TDescriptionsItem>
      <TDescriptionsItem label="用户账号">{{ entry.username }}</TDescriptionsItem>
      <TDescriptionsItem label="登录地址" :span="2">{{ entry.userIp }}</TDescriptionsItem>
      <TDescriptionsItem label="登录设备" :span="2">{{ entry.userAgent }}</TDescriptionsItem>
      <TDescriptionsItem label="登录结果">
        <TTag v-if="entry.result === 0" theme="success" variant="light-outline">成功</TTag>
        <TTag v-else theme="danger" variant="light-outline">失败</TTag>
      </TDescriptionsItem>
      <TDescriptionsItem label="登录时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { LoginLogVO } from '@/api/system/log/login-log'

const entry = ref<LoginLogVO>()

const [systemLoginType] = useDict('system_login_type')

const visible = ref(false)

const open = (record: LoginLogVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
