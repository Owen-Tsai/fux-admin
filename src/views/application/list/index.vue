<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { resolve } = useRouter()

const { permission } = usePermission()
const expanded = ref(false)

const [statusOpts, typeOpts] = useDict('common_status', 'system_application_type')

const {
  data,
  execute,
  onDelete,
  onPageChange,
  onQueryChange,
  onSetPublished,
  pagination,
  pending,
  query,
} = useTable(queryForm)

const toDesignPage = (id: string) => {
  const { href } = resolve({ path: `/app-design/${id}` })
  window.open(href, '_blank')
}
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:application:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="应用名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入应用名称" />
        </TFormItem>
        <TFormItem label="应用类别" name="type" class="col">
          <TSelect v-model:value="query.type" :options="typeOpts" placeholder="请选择应用类别" />
        </TFormItem>
        <TFormItem v-show="expanded" label="上架状态" name="published" class="col">
          <TSelect
            v-model:value="query.published"
            :options="statusOpts"
            placeholder="请选择上架状态"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="更新时间" name="updateTime" class="col">
          <TDateRangePicker v-model:value="query.updateTime" value-type="YYYY-MM-DD" clearable />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <TCard title="应用列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:application:create')"
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
        <template #type="{ row }">
          <DictTag :dict-data="typeOpts" :value="row.type" />
        </template>
        <template #published="{ row }">
          <TSwitch
            v-model:value="row.published"
            :label="['上架', '下架']"
            @change="(v) => onSetPublished(row.id, v as boolean)"
          />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #updateTime="{ row }">
          {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('system:application:update')"
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
                <TDropdownItem
                  :disabled="!permission.has('system:application:design')"
                  @click="toDesignPage(row.id)"
                >
                  设计
                </TDropdownItem>
                <TDropdownItem divider>审核页设计</TDropdownItem>
                <TDropdownItem
                  :disabled="permission.hasNone('system:application:delete')"
                  theme="error"
                  @click="onDelete(row.id)"
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
