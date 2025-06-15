<template>
  <TDrawer v-model:visible="visible" size="40%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>

    <TDescriptions v-if="entry" bordered :column="2" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="日志主键">{{ entry.id }}</TDescriptionsItem>
      <TDescriptionsItem label="短信渠道">
        <DictTag :dict-data="channelCodeOpts" :value="entry.channelCode!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="短信模板">
        {{ entry.templateId }}- {{ entry.templateCode }}-
        <DictTag :dict-data="templateTypeOpts" :value="entry.templateType!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="API 模板编号">{{ entry.apiTemplateId }}</TDescriptionsItem>
      <TDescriptionsItem label="手机号">{{ entry.mobile }}</TDescriptionsItem>
      <TDescriptionsItem label="发送时间">
        {{ dayjs(entry.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="短信内容" :span="2">{{ entry.templateContent }}</TDescriptionsItem>
      <TDescriptionsItem label="短信参数" :span="2">
        <div class="font-mono break-all">{{ entry.templateParams }}</div>
      </TDescriptionsItem>
      <TDescriptionsItem label="发送状态">
        <DictTag :dict-data="sendStatusOpts" :value="entry.sendStatus!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="接收状态">
        <DictTag :dict-data="receiveStatusOpts" :value="entry.receiveStatus!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="API 平台发送结果" :span="2">
        {{ entry.apiSendCode }}
        <TDivider layout="vertical" />
        {{ entry.apiSendMsg }}
      </TDescriptionsItem>
      <TDescriptionsItem label="API 平台短信编号" :span="2">
        {{ entry.apiSerialNo }}
      </TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { LogVO } from '@/api/system/sms/log'

const entry = ref<LogVO>()

const [receiveStatusOpts, sendStatusOpts, channelCodeOpts, templateTypeOpts] = useDict(
  'system_sms_receive_status',
  'system_sms_send_status',
  'system_sms_channel_code',
  'system_sms_template_type',
)

const visible = ref(false)

const open = (record: LogVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
