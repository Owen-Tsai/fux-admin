<script setup lang="ts">
import type { AccessLogVO } from '@/api/system/log/access-log'
import { columns, useTable } from './use-table'
import dayjs from 'dayjs'
import Detail from './detail.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { permission } = usePermission()
const { data, pending, query, onQueryChange, onPageChange, pagination } = useTable(queryForm)

const expanded = ref(false)

defineOptions({ name: 'SystemAccessLog' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:access-log:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="应用名称" name="applicationName" class="col">
          <TInput v-model:value="query.applicationName" placeholder="请输入应用名称" clearable />
        </TFormItem>
        <TFormItem label="请求状态" name="resultCode" class="col">
          <TInput v-model:value="query.resultCode" placeholder="请输入请求状态" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="请求地址" name="requestUrl" class="col">
          <TInput v-model:value="query.requestUrl" placeholder="请输入请求地址" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="用户 ID" name="userId" class="col">
          <TInput v-model:value="query.userId" placeholder="请输入用户 ID" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="请求时间" name="beginTime" class="col">
          <TDateRangePicker
            v-model:value="query.beginTime"
            placeholder="请选择请求时间"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="访问日志">
      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #beginTime="{ row }: TableScope<AccessLogVO>">
          {{ dayjs(row.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #endTime="{ row }: TableScope<AccessLogVO>">
          {{ dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<AccessLogVO>">
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
