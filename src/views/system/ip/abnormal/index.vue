<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail.vue'
import { exportExcel, type IPManagementVO } from '@/api/system/ip'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()
const [abnormalTypeOpts, handleingTypeStatus] = useDict('SYSTEM_ABNORMAL', 'SYSTEM_PROCESSING')

const expanded = ref(false)
const [exporting, toggleExporting] = useToggle(false)

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { query, data, pending, execute, pagination, onPageChange, onQueryChange } =
  useTable(queryForm)

const exportData = async () => {
  toggleExporting()
  await exportExcel(query.value)
  toggleExporting()
}

defineOptions({ name: 'SystemIPManagement' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:ip-management:query')" class="query-form !mb-4">
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
        <TFormItem label="异常类型" name="abnormalType" class="col">
          <TSelect
            v-model:value="query.abnormalType"
            :options="abnormalTypeOpts"
            placeholder="请选择异常类型"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="处理状态" name="handlingStatus" class="col">
          <TSelect
            v-model:value="query.handlingStatus"
            :options="handleingTypeStatus"
            placeholder="请选择处理状态"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="访问资源" name="accessResource" class="col">
          <TInput v-model:value="query.accessResource" placeholder="请输入访问资源" />
        </TFormItem>
        <TFormItem v-show="expanded" label="访问时间" name="accessTime" class="col">
          <TDateRangePicker v-model:value="query.accessTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="异常 IP 列表">
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
        <template #abnormalType="{ row }: TableScope<IPManagementVO>">
          <div class="flex items-center gap-2">
            <DictTag :dict-data="abnormalTypeOpts" :value="row.abnormalType" />
          </div>
        </template>
        <template #handlingStatus="{ row }: TableScope<IPManagementVO>">
          <DictTag :dict-data="handleingTypeStatus" :value="row.handlingStatus" />
        </template>
        <template #accessTime="{ row }: TableScope<IPManagementVO>">
          {{ dayjs(row.accessTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<IPManagementVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="查看详情">
              <TButton shape="square" theme="primary" variant="text" @click="detailRef?.open(row)">
                <template #icon>
                  <Icon name="browse" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="禁止访问">
              <TPopconfirm content="确定要禁止该 IP 地址访问系统吗？" theme="danger">
                <TButton shape="square" theme="danger" variant="text">
                  <template #icon>
                    <Icon name="user-blocked" />
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
