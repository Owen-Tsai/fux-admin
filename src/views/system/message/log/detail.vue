<template>
  <TDrawer v-model:visible="visible" size="40%" header="日志详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>

    <TDescriptions v-if="entry" bordered :column="2" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="发送方">{{ entry.templateNickname }}</TDescriptionsItem>
      <TDescriptionsItem label="接收人">
        {{
          entry.userType === 2
            ? userList?.find((item) => item.id === entry?.userId)?.nickname
            : entry.userId
        }}
      </TDescriptionsItem>
      <TDescriptionsItem label="站内信模板" :span="2">
        {{ entry.templateId }}- {{ entry.templateCode }}
        <DictTag :dict-data="templateTypeOpts" :value="entry.templateType!" />
      </TDescriptionsItem>
      <TDescriptionsItem label="发送时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="阅读时间">
        {{ entry.readStatus ? dayjs(entry.readTime).format('YYYY-MM-DD HH:mm:ss') : '未读' }}
      </TDescriptionsItem>
      <TDescriptionsItem label="模板内容" :span="2">{{ entry.templateContent }}</TDescriptionsItem>
      <TDescriptionsItem label="实发参数" :span="2">
        <div class="font-mono break-all">{{ entry.templateParams }}</div>
      </TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getSimpleUserList } from '@/api/system/user'
import type { MessageVO } from '@/api/system/message'

const entry = ref<MessageVO>()

const [templateTypeOpts] = useDict('system_sms_template_type')

const { data: userList } = useRequest(getSimpleUserList, { immediate: true })

const visible = ref(false)

const open = (record: MessageVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
