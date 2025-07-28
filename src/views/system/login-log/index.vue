<script setup lang="ts">
import type { LoginLogVO } from '@/api/system/log/login-log'
import { columns, useTable } from './use-table'
import cn from 'classnames'
import dayjs from 'dayjs'
import Detail from './detail.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { permission } = usePermission()
const { data, pending, query, onQueryChange, onPageChange, pagination } = useTable(queryForm)

const expanded = ref(false)
const [loginType] = useDict('system_login_type')
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:login-log:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="用户账号" name="username" class="col">
          <TInput v-model:value="query.username" placeholder="请输入用户账号" clearable />
        </TFormItem>
        <TFormItem label="登录地址" name="userIp" class="col">
          <TInput v-model:value="query.userIp" placeholder="请输入登录地址" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="登录日期" name="createTime" class="col">
          <TDateRangePicker
            v-model:value="query.createTime"
            placeholder="请选择登录日期"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="cn('col', { 'ml-2/3': expanded })" />
      </TForm>
    </TCard>

    <TCard title="登录日志">
      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #logType="{ row }: TableScope<LoginLogVO>">
          {{ loginType.find((e) => e.value === row.logType)?.label }}
        </template>
        <template #result="{ row }: TableScope<LoginLogVO>">
          <TTag v-if="row.result === 0" theme="success" variant="light-outline">成功</TTag>
          <TTag v-else theme="danger" variant="light-outline">失败</TTag>
        </template>
        <template #createTime="{ row }: TableScope<LoginLogVO>">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<LoginLogVO>">
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
