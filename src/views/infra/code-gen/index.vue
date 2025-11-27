<script setup lang="ts">
import cn from 'classnames'
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import PreviewModal from './preview.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { getDataSourceList } from '@/api/infra/data-source'
import type { ConfigVO } from '@/api/infra/code-gen'

const { permission } = usePermission()

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const previewModalRef = useTemplateRef<InstanceType<typeof PreviewModal>>('previewModalRef')

const {
  query,
  data,
  pending,
  execute,
  pagination,
  onPageChange,
  onQueryChange,
  onDelete,
  onEdit,
  onSyncFromDb,
  onDownload,
  onBatchDownload,
  selectedRowKeys,
  rehandleSelectChange
} = useTable(queryForm)
const { data: dataSourceList } = useRequest(getDataSourceList, { immediate: true })

const expanded = ref(false)

const onPreview = (id: number) => {
  previewModalRef.value?.open(id)
}

defineOptions({ name: 'InfraCodeGen' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('infra:code-gen:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="表名称" name="tableName" class="col">
          <TInput v-model:value="query.tableName" placeholder="请输入表名称" clearable />
        </TFormItem>
        <TFormItem label="表描述" name="tableComment" class="col">
          <TInput v-model:value="query.tableComment" placeholder="请输入表描述" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD HH:mm:ss" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="cn('col', { 'ml-2/3': expanded })" />
      </TForm>
    </TCard>

    <TCard title="代码生成配置">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('infra:code-gen:download')"
            :loading="pending"
            :disabled="selectedRowKeys.length === 0"
            theme="primary"
            @click="onBatchDownload"
          >
            <template #icon>
              <Icon name="cloud-download" />
            </template>
            批量生成代码
          </TButton>
          <TButton
            v-if="permission.has('infra:code-gen:create')"
            theme="primary"
            :loading="pending"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            导入表
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
        :selected-row-keys="selectedRowKeys"
        @select-change="rehandleSelectChange"
        @page-change="onPageChange"
      >
        <template #dataSourceConfigId="{ row }: TableScope<ConfigVO>">
          {{ dataSourceList?.find((item) => item.id === row.dataSourceConfigId)?.name }}
        </template>
        <template #createTime="{ row }: TableScope<ConfigVO>">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #updateTime="{ row }: TableScope<ConfigVO>">
          {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }: TableScope<ConfigVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('infra:code-gen:update')"
                @click="onEdit(row.id)"
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
                <TDropdownItem
                  :disabled="!permission.has('infra:code-gen:preview')"
                  @click="onPreview(row.id!)"
                  >生成代码预览</TDropdownItem
                >
                <TDropdownItem
                  :disabled="!permission.has('infra:code-gen:download')"
                  divider
                  @click="onDownload(row.id!)"
                  >生成并下载代码</TDropdownItem
                >
                <TDropdownItem divider @click="onSyncFromDb(row.id!)">同步表结构</TDropdownItem>
                <TDropdownItem theme="error" @click="onDelete(row.id!)">删除配置</TDropdownItem>
              </TDropdownMenu>
            </TDropdown>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" :data-source-list="dataSourceList" @success="execute()" />
    <PreviewModal ref="previewModalRef" />
  </div>
</template>
