<script setup lang="ts">
import type { ErrorLogVO } from '@/api/system/log/error-log'
import { columns, useTable } from './use-table'
import { ERROR_LOG_PROCESS_STATUS } from '@/utils/constant'
import dayjs from 'dayjs'
import Detail from './detail.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { permission } = usePermission()
const { data, pending, query, onQueryChange, onPageChange, pagination, onUpdateStatus } =
  useTable(queryForm)

const expanded = ref(false)

defineOptions({ name: 'SystemErrorLog' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:error-log:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="应用名" name="applicationName" class="col">
          <TInput v-model:value="query.applicationName" placeholder="请输入应用名" clearable />
        </TFormItem>
        <TFormItem label="处理状态" name="processStatus" class="col">
          <TInput v-model:value="query.processStatus" placeholder="请输入处理状态" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="请求地址" name="requestUrl" class="col">
          <TInput v-model:value="query.requestUrl" placeholder="请输入请求地址" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="处理状态" name="processStatus" class="col">
          <TInput v-model:value="query.processStatus" placeholder="请输入处理状态" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="异常时间" name="exceptionTime" class="col">
          <TDateRangePicker
            v-model:value="query.exceptionTime"
            placeholder="请选择异常时间"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="异常日志">
      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #processStatus="{ row }: TableScope<ErrorLogVO>">
          <TDropdown v-if="row.processStatus === ERROR_LOG_PROCESS_STATUS.UNPROCESSED">
            <TTag theme="primary" variant="light-outline">
              <div class="flex items-center gap-1 cursor-pointer">
                未处理 <Icon name="caret-down-small" class="!-mr-1" />
              </div>
            </TTag>
            <TDropdownMenu>
              <TDropdownItem @click="onUpdateStatus(row.id!, ERROR_LOG_PROCESS_STATUS.PROCESSED)"
                >已处理</TDropdownItem
              >
              <TDropdownItem @click="onUpdateStatus(row.id!, ERROR_LOG_PROCESS_STATUS.IGNORED)"
                >已忽略</TDropdownItem
              >
            </TDropdownMenu>
          </TDropdown>
          <TTag
            v-else-if="row.processStatus === ERROR_LOG_PROCESS_STATUS.PROCESSED"
            theme="success"
            variant="light-outline"
          >
            已处理
          </TTag>
          <TTag v-else>已忽略</TTag>
        </template>
        <template #exceptionTime="{ row }: TableScope<ErrorLogVO>">
          {{ dayjs(row.exceptionTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<ErrorLogVO>">
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
