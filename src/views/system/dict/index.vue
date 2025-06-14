<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()

const [statusOpts] = useDict('common_status')

const {
  data,
  pending,
  execute,
  query,
  onQueryChange,
  pagination,
  onPageChange,
  onDelete,
  onShowData,
} = useTable(queryForm)

const expanded = ref(false)

defineOptions({ name: 'SystemDictType' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:dict:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="字典名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入字典名称" clearable />
        </TFormItem>
        <TFormItem label="字典类型" name="type" class="col">
          <TInput v-model:value="query.type" placeholder="请输入字典类型" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="字典状态" name="status" class="col">
          <TSelect
            v-model:value="query.status"
            :options="statusOpts"
            placeholder="请选择字典状态"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker
            v-model:value="query.createTime"
            value-type="YYYY-MM-DD HH:mm:ss"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="字典类型列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:dict:create')"
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
        <template #status="{ row }">
          <DictTag :dict-data="statusOpts" :value="row.status" />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2">
            <TTooltip content="编辑">
              <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                <template #icon>
                  <TIcon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="查看字典数据">
              <TButton shape="square" theme="primary" variant="text" @click="onShowData(row.type)">
                <template #icon>
                  <TIcon name="list" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销"
                theme="danger"
                @confirm="onDelete(row.id!)"
              >
                <TButton shape="square" theme="danger" variant="text">
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

    <Form ref="formRef" @success="execute()" />
  </div>
</template>
