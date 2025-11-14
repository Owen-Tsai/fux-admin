<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import type { JobVO } from '@/api/infra/job'

enum JOB_STATUS {
  INIT,
  NORMAL,
  STOP,
}

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()
const [jobStatusOpts] = useDict('infra_job_status')

const {
  data,
  execute,
  onDelete,
  onPageChange,
  onQueryChange,
  pagination,
  pending,
  query,
  onRun,
  onUpdateStatus,
} = useTable(queryForm)

defineOptions({ name: 'InfraJob' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('infra:job:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="配置名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入配置名称" />
        </TFormItem>
        <TFormItem label="任务状态" name="status" class="col">
          <TSelect
            v-model:value="query.status"
            :options="jobStatusOpts"
            placeholder="请选择任务状态"
          />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="定时任务列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('infra:file-config:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
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
        <template #name="{ row }: TableScope<JobVO>">
          {{ row.name }}
        </template>
        <template #status="{ row }">
          <DictTag :dict-data="jobStatusOpts" :value="row.status" />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<JobVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('infra:file-config:update')"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TDropdown>
              <TButton shape="square" theme="primary" variant="text">
                <template #icon>
                  <Icon name="unfold-more" />
                </template>
              </TButton>
              <TDropdownMenu>
                <TDropdownItem divider>
                  {{ row.status === JOB_STATUS.STOP ? '开启' : '暂停' }}
                </TDropdownItem>
                <TDropdownItem divider>手动执行</TDropdownItem>
                <TDropdownItem>任务详情</TDropdownItem>
                <TDropdownItem divider>调度日志</TDropdownItem>
                <TDropdownItem theme="error">删除任务</TDropdownItem>
              </TDropdownMenu>
            </TDropdown>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>
