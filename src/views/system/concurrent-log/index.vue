<script setup lang="ts">
import type { OperateLogVO } from '@/api/system/log/op-log'
import { columns, useTable } from './use-table'
import dayjs from 'dayjs'
import Detail from './detail.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { permission } = usePermission()
const { data, pending, query, onQueryChange, onPageChange, pagination } = useTable(queryForm)

const expanded = ref(false)
const [operateType] = useDict('system_operate_type')
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:operate-log:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="系统模块" name="module" class="col">
          <TInput v-model:value="query.module" placeholder="请输入系统模块" clearable />
        </TFormItem>
        <TFormItem label="操作人" name="userNickname" class="col">
          <TInput v-model:value="query.userNickname" placeholder="请输入操作人" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="操作类型" name="type" class="col">
          <TSelect v-model:value="query.type" :options="operateType" placeholder="请选择操作类型" />
        </TFormItem>
        <TFormItem v-show="expanded" label="开始时间" name="startTime" class="col">
          <TDateRangePicker
            v-model:value="query.startTime"
            placeholder="请选择开始时间"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="操作结果" name="success" class="col">
          <TSelect v-model:value="query.success" clearable>
            <TOption value="true" label="成功" />
            <TOption value="false" label="失败" />
          </TSelect>
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="并发日志">
      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #type="{ row }: TableScope<OperateLogVO>">
          <DictTag :dict-data="operateType" :value="row.type" />
        </template>
        <template #resultCode="{ row }: TableScope<OperateLogVO>">
          <TTag v-if="row.resultCode === 0" theme="success" variant="light-outline">成功</TTag>
          <TTag v-else theme="danger" variant="light-outline">{{ row.resultCode }}</TTag>
        </template>
        <template #startTime="{ row }: TableScope<OperateLogVO>">
          {{ dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #duration="{ row }: TableScope<OperateLogVO>"> {{ row.duration }}ms </template>
        <template #actions="{ row }: TableScope<OperateLogVO>">
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
