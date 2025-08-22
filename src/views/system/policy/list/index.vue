<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()
const expanded = ref(false)

const [ statusOpts ] = useDict('information_status', 'infra_boolean_string')

const { data, execute, onDelete, onPageChange, onQueryChange, pagination, pending, query } =
  useTable(queryForm)

// const toViewPage = (id: string) => {
//   const { href } = resolve({ path: `/app-design/${id}` })
//   window.open(href, '_blank')
// }
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:policy:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="政策标题" name="title" class="col">
          <TInput v-model:value="query.title" placeholder="请输入政策标题" />
        </TFormItem>
        <TFormItem label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD" clearable />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="最新政策">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:policy:create')"
            theme="primary"
            :loading="pending"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            发布
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
        <!-- <template #infoType="{ row }">
          <DictTag :dict-data="typeOpts" :value="row.type" />
        </template> -->
        <template #title="{ row }">
          <div class="w-full flex items-center gap-1">
            <div class="truncate">
              {{ row.title }}
            </div>
          </div>
        </template>
        <template #sendDate="{ row }">
          {{ row.sendDate === undefined || row.sendDate === '' ? '' : dayjs(row.sendDate).format('YYYY-MM-DD') }}
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
                :disabled="permission.hasNone('system:policy:update')"
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
                <TButton shape="square" theme="danger" variant="text" :disabled="permission.hasNone('system:policy:delete')">
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

    <Form ref="formRef" @success="execute" />
  </div>
</template>
