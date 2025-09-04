<template>
  <TDrawer v-model:visible="visible" size="40%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>
    <TDescriptions v-if="entry" bordered :column="2" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="日志主键">{{ entry.id }}</TDescriptionsItem>
      <TDescriptionsItem label="链路追踪">{{ entry.traceId }}</TDescriptionsItem>
      <TDescriptionsItem label="操作人编号">{{ entry.userId }}</TDescriptionsItem>
      <TDescriptionsItem label="操作人名称">{{ entry.userNickname }}</TDescriptionsItem>
      <TDescriptionsItem label="操作人IP" :span="2">{{ entry.userIp }}</TDescriptionsItem>
      <TDescriptionsItem label="操作人UA" :span="2">{{ entry.userAgent }}</TDescriptionsItem>
      <TDescriptionsItem label="操作模块" :span="2">{{ entry.module }}</TDescriptionsItem>
      <TDescriptionsItem label="操作内容" :span="2">{{ entry.name }}</TDescriptionsItem>
      <TDescriptionsItem label="请求目标" :span="2">
        <div class="font-mono break-all">
          {{ `${entry.requestMethod} ${entry.requestUrl}` }}
        </div>
      </TDescriptionsItem>
      <TDescriptionsItem label="Java 方法" :span="2">
        <div class="font-mono break-all">
          {{ entry.javaMethod }}
        </div>
      </TDescriptionsItem>
      <TDescriptionsItem label="Java 方法参数" :span="2">
        <div class="font-mono break-all">
          {{ entry.javaMethodArgs }}
        </div>
      </TDescriptionsItem>
      <TDescriptionsItem label="操作时间">
        {{ dayjs(entry.startTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="执行用时">{{ entry.duration }} ms</TDescriptionsItem>
      <TDescriptionsItem label="执行结果" :span="2">
        {{ `【${entry.resultCode}】${entry.resultMsg}` }}
      </TDescriptionsItem>
      <TDescriptionsItem label="返回数据" :span="2">
        <div class="font-mono break-all">
          {{ entry.resultData }}
        </div>
      </TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { OperateLogVO } from '@/api/system/log/op-log'

const entry = ref<OperateLogVO>()

const visible = ref(false)

const open = (record: OperateLogVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
