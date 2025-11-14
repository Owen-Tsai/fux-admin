<template>
  <div class="view">
    <!-- filter form -->
    <TCard v-if="permission.has('xxljob:job-group:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="执行器名称" name="appName" class="col">
          <TInput v-model:value="query.appName" placeholder="请输入执行器名称" allow-clear />
        </TFormItem>
        <TFormItem label="应用名称" name="title" class="col">
          <TInput v-model:value="query.title" placeholder="请输入应用名称" allow-clear />
        </TFormItem>
        <TFormItem v-show="expanded" label="注册方式" name="addressType" class="col">
          <t-select v-model:value="query.addressType" clearable>
            <t-option key="0" label="自动注册" value="0" />
            <t-option key="1" label="手动注册" value="1" />
          </t-select>
        </TFormItem>
        <TFormItem v-show="expanded" label="执行机器地址" name="addressList" class="col">
          <TInput v-model:value="query.addressList" placeholder="请输入执行机器地址" allow-clear />
        </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="执行器管理">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('xxljob:job-group:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            添加执行器
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

      <div class="overflow-x-auto">
        <TTable
          :data="data?.list"
          row-key="id"
          :columns="columns"
          :pagination="pagination"
          :loading="pending"
          @page-change="onPageChange"
        >
          <template #addressType="{ row }">
            <span v-if="row.addressType === 0">自动注册</span>
            <span v-if="row.addressType === 1">手动注册</span>
          </template>
          <template #actions="{ row }">
            <div class="flex gap-2">
              <TTooltip content="编辑" v-if="permission.has('xxljob:job-group:update')">
                <TButton
                  shape="square"
                  theme="primary"
                  variant="text"
                  @click="formRef?.open(row.id)"
                >
                  <template #icon>
                    <Icon name="edit-2" />
                  </template>
                </TButton>
              </TTooltip>
              <TTooltip content="删除" v-if="permission.has('xxljob:job-group:delete')">
                <TPopconfirm
                  content="该操作无法撤销，确定要删除吗？"
                  theme="danger"
                  @confirm="onDelete(row.id!)"
                >
                  <TButton shape="square" theme="danger" variant="text">
                    <template #icon>
                      <Icon name="delete" />
                    </template>
                  </TButton>
                </TPopconfirm>
              </TTooltip>
            </div>
          </template>
        </TTable>
      </div>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()

const { data, pending, execute, query, onQueryChange, pagination, onPageChange, onDelete } =
  useTable(queryForm)
const expanded = ref(false)

defineOptions({ name: 'JobGroup' })
</script>
