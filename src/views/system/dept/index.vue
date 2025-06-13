<script setup lang="ts">
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import Form from './form.vue'
import { type DeptVO } from '@/api/system/dept'
import type { FormInstanceFunctions, EnhancedTableInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const tableRef = useTemplateRef<EnhancedTableInstanceFunctions>('tableRef')

const [statusOpts] = useDict('common_status')

const { permission } = usePermission()
const { query, onQueryChange, data, execute, onDelete, userList, pending } = useTable(queryForm)

const [tableExpanded, toggle] = useToggle(true)

const toggleTableExpanded = () => {
  toggle()
  if (tableExpanded.value) {
    tableRef.value?.expandAll()
  } else {
    tableRef.value?.foldAll()
  }
}
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:dept:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="部门名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入部门名称" />
        </TFormItem>
        <TFormItem label="部门状态" name="status" class="col">
          <TSelect v-model:value="query.status" :options="statusOpts" clearable />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="部门列表" bordered>
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:dept:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <TIcon name="add" />
            </template>
            新增
          </TButton>

          <TTooltip content="全部展开/折叠">
            <TButton shape="square" variant="text" @click="toggleTableExpanded()">
              <template #icon>
                <TIcon name="unfold-less" />
              </template>
            </TButton>
          </TTooltip>

          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
              <template #icon>
                <TIcon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <TEnhancedTable
        ref="tableRef"
        :data="data"
        :columns="columns"
        row-key="id"
        :tree="{ defaultExpandAll: true }"
        :loading="pending"
        :key="pending + ''"
      >
        <template #leaderUserId="{ row }: TableScope<DeptVO>">
          {{ userList?.find((e) => e.id === row.leaderUserId)?.nickname }}
        </template>
        <template #status="{ row }">
          <DictTag :dict-data="statusOpts" :value="row.status" />
        </template>
        <template #createTime="{ row }: TableScope<DeptVO>">
          {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
        </template>
        <template #actions="{ row }: TableScope<DeptVO>">
          <div class="flex gap-2">
            <TTooltip content="编辑">
              <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                <template #icon>
                  <TIcon name="edit-2" />
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
      </TEnhancedTable>
    </TCard>

    <Form ref="formRef" :tree-data="data" :user-data="userList" @success="execute()" />
  </div>
</template>
