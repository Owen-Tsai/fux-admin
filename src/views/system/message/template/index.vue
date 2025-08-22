<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import SendForm from './send-form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()
const [statusOpts, typeOpts] = useDict('common_status', 'system_notify_template_type')

const expanded = ref(false)

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const sendFormRef = useTemplateRef<InstanceType<typeof SendForm>>('sendFormRef')

const { query, data, pending, execute, pagination, onPageChange, onQueryChange, onDelete } =
  useTable(queryForm)

defineOptions({ name: 'SystemMessageTemplate' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:message-template:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="模板名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入模板名称" clearable />
        </TFormItem>
        <TFormItem label="模板编码" name="code" class="col">
          <TInput v-model:value="query.code" placeholder="请输入模板编码" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="模板类型" name="type" class="col">
          <TSelect
            v-model:value="query.type"
            :options="typeOpts"
            placeholder="请选择站内信模板类型"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="启用状态" name="status" class="col">
          <TSelect
            v-model:value="query.status"
            :options="statusOpts"
            placeholder="请选择启用状态"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-format="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="站内信模板列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:message-template:create')"
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
        <template #type="{ row }">
          <DictTag :dict-data="typeOpts" :value="row.type" />
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
                :disabled="permission.hasNone('system:message-template:update')"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="测试">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                @click="sendFormRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="send" />
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
                  :disabled="permission.hasNone('system:message-template:delete')"
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
    <SendForm ref="sendFormRef" />
  </div>
</template>
