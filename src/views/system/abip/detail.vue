<template>
  <ADrawer
    v-model:open="visible"
    title="异常IP详情"
    placement="right"
    :width="600"
    @close="onClose"
  >
    <div v-if="entry" class="space-y-6">
      <!-- 基本信息 -->
      <div>
        <h3 class="text-lg font-medium mb-4 border-b pb-2">基本信息</h3>
        <ADescriptions :column="1" bordered>
          <ADescriptionsItem label="异常IP地址">
            {{ entry.ipAddress }}
          </ADescriptionsItem>
          <ADescriptionsItem label="异常类型">
            <DictTag :dict-object="SYSTEM_ABNORMAL" :value="entry.abnormalType" />
          </ADescriptionsItem>
          <ADescriptionsItem label="处理状态">
            <DictTag :dict-object="SYSTEM_PROCESSING" :value="entry.handlingStatus" />
          </ADescriptionsItem>
          <ADescriptionsItem label="添加时间">
            {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </ADescriptionsItem>
          <ADescriptionsItem label="访问时间">
            {{ dayjs(entry.accessTime).format('YYYY-MM-DD HH:mm:ss') }}
          </ADescriptionsItem>
          <ADescriptionsItem label="访问的资源">
            {{ entry.accessResource }}
          </ADescriptionsItem>
        </ADescriptions>
      </div>

      <!-- 其他详细信息 -->
      <div>
        <h3 class="text-lg font-medium mb-4 border-b pb-2">详细信息</h3>
        <ADescriptions :column="1" bordered>
          <!-- <ADescriptionsItem label="用户代理">
            {{ entry.userAgent || '无' }}
          </ADescriptionsItem>
          <ADescriptionsItem label="请求方法">
            {{ entry.requestMethod || '无' }}
          </ADescriptionsItem> -->
          <ADescriptionsItem label="访问详情">
            {{ entry.abnormalDetail || '无' }}
          </ADescriptionsItem>
          <!-- <ADescriptionsItem label="备注">
            {{ entry.remark || '无' }}
          </ADescriptionsItem> -->
        </ADescriptions>
      </div>
    </div>

    <template #footer>
      <AFlex justify="end" :gap="8">
        <AButton @click="onClose">关闭</AButton>
        <!-- <AButton type="primary" @click="onClose">确定</AButton> -->
      </AFlex>
    </template>
  </ADrawer>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { IpManagementVO } from '@/api/system/ipmanagement'

defineProps({
  entry: {
    type: Object as PropType<IpManagementVO>,
    default: null,
  },
})

const visible = ref(false)

const [SYSTEM_ABNORMAL, SYSTEM_PROCESSING] = useDict('SYSTEM_ABNORMAL', 'SYSTEM_PROCESSING')

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const onClose = () => {
  close()
}

defineExpose({
  open,
  close,
})
</script>
