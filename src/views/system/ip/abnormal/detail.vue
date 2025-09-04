<template>
  <TDrawer v-model:visible="visible" size="30%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>

    <TDescriptions v-if="entry" bordered :column="1" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="异常 IP 地址">{{ entry.ipAddress }}</TDescriptionsItem>
      <TDescriptionsItem label="异常类型">
        <DictTag :dict-data="abnormalTypeOpts" :value="entry.abnormalType!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="处理状态">
        <DictTag :dict-data="handleingTypeStatus" :value="entry.handlingStatus!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="添加时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="异常访问时间">
        {{ dayjs(entry.accessTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="访问资源">{{ entry.accessResource }}</TDescriptionsItem>
      <TDescriptionsItem label="访问详情">{{ entry.abnormalDetail }}</TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { IPManagementVO } from '@/api/system/ip'

const entry = ref<IPManagementVO>()

const [abnormalTypeOpts, handleingTypeStatus] = useDict('SYSTEM_ABNORMAL', 'SYSTEM_PROCESSING')

const visible = ref(false)

const open = (record: IPManagementVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
