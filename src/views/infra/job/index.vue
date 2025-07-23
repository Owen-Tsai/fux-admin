<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { FileConfigVO } from '@/api/infra/file/config'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()
const [infraFileStorage] = useDict('infra_file_storage')

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

defineOptions({ name: 'InfraFileConfig' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('infra:file-config:query')" class="query-form !mb-4">
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
        <TFormItem label="存储器" name="storage" class="col">
          <TSelect
            v-model:value="query.storage"
            :options="infraFileStorage"
            placeholder="请选择存储器"
          />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="文件配置列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('infra:file-config:create')"
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
        <template #name="{ row }: TableScope<FileConfigVO>">
          {{ row.name }}
          <TTag v-if="row.master" theme="primary" variant="light-outline">主配置</TTag>
        </template>
        <template #storage="{ row }">
          <DictTag :dict-data="infraFileStorage" :value="row.storage" />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<FileConfigVO>">
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
                  <TIcon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TDropdown>
              <TButton shape="square" theme="primary" variant="text">
                <template #icon>
                  <TIcon name="unfold-more" />
                </template>
              </TButton>
              <TDropdownMenu>
                <TDropdownItem @click="onTest(row.id!)">测试配置</TDropdownItem>
                <TDropdownItem
                  :disabled="permission.hasNone('infra:file-config:update') || !!row.master"
                  @click="onSetMaster(row.id!)"
                  divider
                  >设为主配置</TDropdownItem
                >
                <TDropdownItem
                  theme="error"
                  :disabled="permission.hasNone('infra:file-config:delete')"
                  @click="onDelete(row.id!)"
                  >删除配置</TDropdownItem
                >
              </TDropdownMenu>
            </TDropdown>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>
