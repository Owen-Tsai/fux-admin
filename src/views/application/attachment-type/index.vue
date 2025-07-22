<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { AttachmentTypeVO } from '@/api/app/attachment'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()

const { data, execute, onDelete, onPageChange, onQueryChange, pagination, pending, query } =
  useTable(queryForm)
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('app:attachment-type:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="附件类型" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入附件类型名称" />
        </TFormItem>
        <TFormItem label="附件" name="moduleName" class="col">
          <TInput v-model:value="query.moduleName" placeholder="请输入附件编码" />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="附件类型列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('app:attachment-type:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <TIcon name="add" />
            </template>
            新增
          </TButton>
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
              <template #icon>
                <TIcon name="refresh" />
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
        <template #maxFileSize="{ row }">{{ row.maxFileSize / 1024 / 1024 }} MB</template>
        <template #required="{ row }">
          <TTag v-if="row.required" theme="danger" variant="light-outline">必需</TTag>
          <TTag v-else variant="light-outline">非必需</TTag>
        </template>
        <template #allowedFileTypes="{ row }: TableScope<AttachmentTypeVO>">
          <div class="flex gap-1">
            <TTag v-for="item in row.allowedFileTypes?.slice(0, 2)" :key="item">{{ item }}</TTag>
            <TTooltip :content="row.allowedFileTypes?.slice(2)?.join('，')">
              <TTag v-if="row.allowedFileTypes && row.allowedFileTypes.length > 2">
                +{{ row.allowedFileTypes?.length - 2 }}
              </TTag>
            </TTooltip>
          </div>
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('app:attachment-type:update')"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <TIcon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销"
                theme="danger"
                @confirm="onDelete(row.id)"
              >
                <TButton
                  shape="square"
                  theme="danger"
                  variant="text"
                  :disabled="permission.hasNone('app:attachment-type:delete')"
                >
                  <template #icon>
                    <TIcon name="delete" />
                  </template>
                </TButton>
              </TPopconfirm>
            </TTooltip>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>
