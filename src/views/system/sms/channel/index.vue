<script setup lang="ts">
import { columns, useTable } from './use-table'
import Form from './form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const { permission } = usePermission()
const [statusOpts, smsChannelOpts] = useDict('common_status', 'system_sms_channel_code')

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { query, data, pending, execute, pagination, onPageChange, onQueryChange, onDelete } =
  useTable(queryForm)

defineOptions({ name: 'SystemSmsChannel' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:sms-channel:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="渠道名称" name="signature" class="col">
          <TInput v-model:value="query.signature" placeholder="请输入渠道名称" clearable />
        </TFormItem>
        <TFormItem label="启用状态" name="status" class="col">
          <TSelect
            v-model:value="query.status"
            :options="statusOpts"
            placeholder="请选择启用状态"
          />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="短信渠道列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:sms-channel:create')"
            theme="primary"
            :loading="pending"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>

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
        <template #status="{ row }">
          <DictTag :dict-data="statusOpts" :value="row.status" />
        </template>
        <template #code="{ row }">
          <DictTag :dict-data="smsChannelOpts" :value="row.code" />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('system:sms-channel:update')"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销"
                theme="danger"
                @confirm="onDelete(row.id!)"
              >
                <TButton
                  shape="square"
                  theme="danger"
                  variant="text"
                  :disabled="permission.hasNone('system:sms-channel:delete')"
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
    <Form ref="formRef" @success="execute()" />
  </div>
</template>
