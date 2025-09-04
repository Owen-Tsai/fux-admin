<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail.vue'
import { getSimpleUserList } from '@/api/system/user'
import type { MessageVO } from '@/api/system/message'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()
const [userTypeOpts, templateTypeOpts, booleanOpts] = useDict(
  'user_type',
  'system_sms_template_type',
  'infra_boolean_string',
)

const expanded = ref(false)

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const detailRef = useTemplateRef<InstanceType<typeof Detail>>('detailRef')

const { data: userList } = useRequest(getSimpleUserList, {
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
        <TFormItem label="接收人" name="userId" class="col">
          <TInput v-model:value="query.userId" placeholder="请输入接收人 ID" />
        </TFormItem>
        <TFormItem label="模板编码" name="templateCode" class="col">
          <TInput v-model:value="query.templateCode" placeholder="请输入模板编码" />
        </TFormItem>
        <TFormItem v-show="expanded" label="模板类型" name="templateType" class="col">
          <TSelect
            v-model:value="query.templateType"
            :options="templateTypeOpts"
            placeholder="请选择模板类型"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="发送时间" name="sendTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
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
        <template #template="{ row }: TableScope<MessageVO>">
          <div class="flex items-center gap-2">
            <DictTag :dict-data="templateTypeOpts" :value="row.templateType" />
            <span>{{ row.templateCode }}</span>
          </div>
        </template>
        <template #userId="{ row }: TableScope<MessageVO>">
          <div class="flex items-center gap-2">
            <DictTag :dict-data="userTypeOpts" :value="row.userType" />
            <span>
              {{
                row.userType === 2
                  ? userList?.find((e) => e.id === row.userId)?.nickname
                  : row.userId
              }}
            </span>
          </div>
        </template>
        <template #readStatus="{ row }: TableScope<MessageVO>">
          <DictTag :dict-data="booleanOpts" :value="!!row.readStatus" />
        </template>
        <template #createTime="{ row }: TableScope<MessageVO>">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<MessageVO>">
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
