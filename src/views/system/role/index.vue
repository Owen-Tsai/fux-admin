<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import MenuForm from './menu-form.vue'
import DataForm from './data-form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import type { RoleVO } from '@/api/system/role'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const menuForm = useTemplateRef<InstanceType<typeof MenuForm>>('menuForm')
const dataForm = useTemplateRef<InstanceType<typeof DataForm>>('dataForm')
const { permission } = usePermission()
const [statusOpts] = useDict('common_status')

const { query, onQueryChange, data, execute, onDelete, onPageChange, pagination, pending } =
  useTable(queryForm)

const expanded = ref(false)
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:role:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="角色名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入角色名称" />
        </TFormItem>
        <TFormItem label="角色标识" name="code" class="col">
          <TInput v-model:value="query.code" placeholder="请输入角色标识" />
        </TFormItem>
        <TFormItem v-show="expanded" label="状态" name="status" class="col">
          <TSelect v-model:value="query.status" :options="statusOpts" />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="角色列表" bordered>
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:role:create')"
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
          <DictTag :value="row.status" :dict-data="statusOpts" />
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
            <TDropdown>
              <TButton shape="square" theme="primary" variant="text">
                <template #icon>
                  <TIcon name="unfold-more" />
                </template>
              </TButton>
              <TDropdownMenu>
                <TDropdownItem
                  :disabled="!permission.has('system:permission:assign-role-menu')"
                  @click="menuForm?.open(row)"
                  >菜单权限</TDropdownItem
                >
                <TDropdownItem
                  :disabled="!permission.has('system:permission:assign-role-data-scope')"
                  divider
                  @click="dataForm?.open(row)"
                  >数据权限</TDropdownItem
                >
                <TDropdownItem theme="error" @click="onDelete(row.id!)">删除用户</TDropdownItem>
              </TDropdownMenu>
            </TDropdown>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" @success="execute" />
    <MenuForm ref="menuForm" @success="execute" />
    <DataForm ref="dataForm" @success="execute" />
  </div>
</template>
