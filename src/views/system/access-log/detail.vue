<template>
  <TDrawer v-model:visible="visible" size="40%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>
    <TDescriptions v-if="entry" bordered :column="2" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="日志主键">{{ entry.id }}</TDescriptionsItem>
      <TDescriptionsItem label="链路追踪">{{ entry.traceId }}</TDescriptionsItem>
      <TDescriptionsItem label="应用名称">{{ entry.applicationName }}</TDescriptionsItem>
      <TDescriptionsItem label="用户编号">
        <div class="flex items-center gap-2">
          ID: {{ entry.userId }}
          <DictTag :dict-data="userTypeOpts" :value="entry.userType" />
        </div>
      </TDescriptionsItem>
      <TDescriptionsItem label="用户 IP">{{ entry.userIp }}</TDescriptionsItem>
      <TDescriptionsItem label="用户 UA" :span="2">{{ entry.userAgent }}</TDescriptionsItem>
      <TDescriptionsItem label="请求地址" :span="2">
        <TTag theme="primary" variant="light-outline">{{ entry.requestMethod }}</TTag>
        <span>{{ entry.requestUrl }}</span>
      </TDescriptionsItem>
      <TFormItem label="请求参数" :span="2">
        <pre>{{ entry.requestParams }}</pre>
      </TFormItem>
      <TFormItem label="请求结果" :span="2">
        <pre>{{ entry.responseBody }}</pre>
      </TFormItem>
      <TDescriptionsItem label="请求时间">
        {{ dayjs(entry.beginTime).format('YYYY-MM-DD HH:mm:ss') }}~{{
          dayjs(entry.endTime).format('YYYY-MM-DD HH:mm:ss')
        }}
      </TDescriptionsItem>
      <TDescriptionsItem label="请求耗时"> {{ entry.duration }} ms </TDescriptionsItem>
      <TDescriptionsItem label="操作结果">{{ entry.resultCode }}</TDescriptionsItem>
      <TDescriptionsItem label="操作模块">{{ entry.operateModule }}</TDescriptionsItem>
      <TDescriptionsItem label="操作名">{{ entry.operateName }}</TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { AccessLogVO } from '@/api/system/log/access-log'

const entry = ref<AccessLogVO>()

const [userTypeOpts] = useDict('user_type')

const visible = ref(false)

const open = (record: AccessLogVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
