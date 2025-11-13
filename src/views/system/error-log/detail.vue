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
      <TDescriptionsItem label="用户 IP" :span="2">{{ entry.userIp }}</TDescriptionsItem>
      <TDescriptionsItem label="用户 UA" :span="2">{{ entry.userAgent }}</TDescriptionsItem>
      <TDescriptionsItem label="请求地址" :span="2">
        <TTag theme="primary" variant="light-outline">{{ entry.requestMethod }}</TTag>
        <span class="break-all">{{ entry.requestUrl }}</span>
      </TDescriptionsItem>
      <TDescriptionsItem label="请求参数" :span="2">
        <pre>{{ entry.requestParams }}</pre>
      </TDescriptionsItem>
      <TDescriptionsItem label="异常时间" :span="2">
        {{ dayjs(entry.exceptionTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="异常名" :span="2">{{ entry.exceptionName }}</TDescriptionsItem>
      <TDescriptionsItem label="异常堆栈" :span="2">
        <div class="w-full h-full overflow-auto max-h-200px">
          <pre>{{ entry.exceptionStackTrace }}</pre>
        </div>
      </TDescriptionsItem>
      <TDescriptionsItem label="处理状态">
        <TTag
          v-if="entry.processStatus === ERROR_LOG_PROCESS_STATUS.PROCESSED"
          theme="success"
          variant="light-outline"
        >
          已处理
        </TTag>
        <TTag
          v-else-if="entry.processStatus === ERROR_LOG_PROCESS_STATUS.UNPROCESSED"
          theme="primary"
          variant="light-outline"
        >
          未处理
        </TTag>
        <TTag v-else>已忽略</TTag>
      </TDescriptionsItem>
      <TDescriptionsItem label="处理人">{{ entry.processUserId }}</TDescriptionsItem>
      <TDescriptionsItem label="处理时间">{{
        dayjs(entry.processTime).format('YYYY-MM-DD HH:mm:ss')
      }}</TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { ErrorLogVO } from '@/api/system/log/error-log'
import { ERROR_LOG_PROCESS_STATUS } from '@/utils/constant'

const entry = ref<ErrorLogVO>()

const [userTypeOpts] = useDict('user_type')

const visible = ref(false)

const open = (record: ErrorLogVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
