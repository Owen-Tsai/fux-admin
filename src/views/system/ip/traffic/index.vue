<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail.vue'
import { exportTraffic, deleteTraffic, type IPTrafficVO } from '@/api/system/ip/traffic'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()

const [exporting, toggleExporting] = useToggle(false)

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { query, data, pending, execute, pagination, onPageChange, onQueryChange } =
  useTable(queryForm)

const exportData = async () => {
  toggleExporting()
  await exportTraffic(query.value)
  toggleExporting()
}

defineOptions({ name: 'SystemIPTraffic' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:ip-traffic:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="异常 IP" name="ipAddress" class="col">
          <TInput v-model:value="query.ipAddress" placeholder="请输入异常 IP 地址" />
        </TFormItem>
        <TFormItem label="流量统计时间" name="trafficTime" class="col">
          <TDateRangePicker v-model:value="query.trafficTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="IP 流量列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" :loading="pending" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
          <TTooltip content="导出">
            <TButton
              shape="square"
              theme="default"
              variant="text"
              :loading="exporting"
              @click="exportData()"
            >
              <template #icon>
                <Icon name="file-export" />
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
        <template #trafficTime="{ row }: TableScope<IPTrafficVO>">
          {{ dayjs(row.trafficTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #inboundTraffic="{ row }: TableScope<IPTrafficVO>">
          {{ row.inboundTraffic }} MB
        </template>
        <template #outboundTraffic="{ row }: TableScope<IPTrafficVO>">
          {{ row.outboundTraffic }} MB
        </template>
        <template #actions="{ row }: TableScope<IPTrafficVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="查看详情">
              <TButton shape="square" theme="primary" variant="text" @click="detailRef?.open(row)">
                <template #icon>
                  <Icon name="browse" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除">
              <TPopconfirm content="确定要删除该 IP 流量吗？" theme="danger">
                <TButton
                  shape="square"
                  theme="danger"
                  variant="text"
                  @click="deleteTraffic(row.id!)"
                >
                  <template #icon>
                    <Icon name="delete" />
                  </template>
                </TButton>
              </TPopconfirm>
            </TTooltip>
          </div>
        </template>
      </TTable>
    </TCard>

    <Detail ref="detailRef" />
  </div>
</template>
