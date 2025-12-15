<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import { exportIPList, type IPListEntryVO } from '@/api/system/ip/list'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()
const [ipTypeOpts] = useDict('system_ip_list')

const expanded = ref(false)
const [exporting, toggleExporting] = useToggle(false)

const {
  query,
  data,
  pending,
  isWhitelist,
  execute,
  pagination,
  onPageChange,
  onQueryChange,
  onDelete,
} = useTable(queryForm)

const exportData = async () => {
  toggleExporting()
  await exportIPList(query.value)
  toggleExporting()
}

defineOptions({ name: 'SystemIPList' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:ip-list:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="IP 地址" name="ipAddress" class="col">
          <TInput v-model:value="query.ipAddress" placeholder="请输入异常 IP 地址" />
        </TFormItem>
        <TFormItem label="添加时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard :title="isWhitelist ? 'IP 白名单' : 'IP 黑名单'">
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
        <template #listType="{ row }: TableScope<IPListEntryVO>">
          <DictTag :dict-data="ipTypeOpts" :value="row.listType" />
        </template>
        <template #createTime="{ row }: TableScope<IPListEntryVO>">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<IPListEntryVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="移除">
              <TPopconfirm
                content="确定要移除该 IP 地址吗？"
                theme="danger"
                @confirm="onDelete(row.id!)"
              >
                <TButton shape="square" theme="danger" variant="text">
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

    <Form ref="formRef" />
  </div>
</template>
