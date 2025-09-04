<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail.vue'
import { getSimpleChannelList } from '@/api/system/sms/channel'
import type { LogVO } from '@/api/system/sms/log'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()
const [receiveStatusOpts, sendStatusOpts, channelCodeOpts, templateTypeOpts] = useDict(
  'system_sms_receive_status',
  'system_sms_send_status',
  'system_sms_channel_code',
  'system_sms_template_type',
)

const expanded = ref(false)

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { data: channelList } = useRequest(getSimpleChannelList, {
  immediate: true,
})

const { query, data, pending, execute, pagination, onPageChange, onQueryChange } =
  useTable(queryForm)

defineOptions({ name: 'SystemSmsLog' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:sms-log:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="手机号" name="mobile" class="col">
          <TInput v-model:value="query.mobile" placeholder="请输入接收手机号" />
        </TFormItem>
        <TFormItem label="模板编码" name="templateCode" class="col">
          <TInput v-model:value="query.templateCode" placeholder="请输入短信模板编码" />
        </TFormItem>
        <TFormItem v-show="expanded" label="短信渠道" name="channelId" class="col">
          <TSelect
            v-model:value="query.channelId"
            :options="channelList"
            :keys="{ label: 'signature', value: 'id' }"
            placeholder="请选择短信渠道"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="发送状态" name="sendStatus" class="col">
          <TSelect
            v-model:value="query.sendStatus"
            :options="sendStatusOpts"
            placeholder="请选择发送状态"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="发送时间" name="sendTime" class="col">
          <TDateRangePicker v-model:value="query.sendTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="短信日志列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" :loading="pending" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #templateType="{ row }: TableScope<LogVO>">
          <DictTag :dict-data="templateTypeOpts" :value="row.templateType" />
        </template>
        <template #sendStatus="{ row }: TableScope<LogVO>">
          <DictTag :dict-data="sendStatusOpts" :value="row.sendStatus" />
        </template>
        <template #receiveStatus="{ row }: TableScope<LogVO>">
          <DictTag :dict-data="receiveStatusOpts" :value="row.receiveStatus" />
        </template>
        <template #channelCode="{ row }: TableScope<LogVO>">
          <div>
            {{ channelList?.find((e) => e.id === row.channelId)?.signature }}
          </div>
          <div>
            <DictTag :dict-data="channelCodeOpts" :value="row.channelCode" />
          </div>
        </template>
        <template #sendTime="{ row }: TableScope<LogVO>">
          {{ dayjs(row.sendTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<LogVO>">
          <TTooltip content="查看详情">
            <TButton shape="square" theme="primary" variant="text" @click="detailRef?.open(row)">
              <template #icon>
                <Icon name="browse" />
              </template>
            </TButton>
          </TTooltip>
        </template>
      </TTable>
    </TCard>

    <Detail ref="detailRef" />
  </div>
</template>
