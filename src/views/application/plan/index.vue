<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'
import { getApplicationSimpleList } from '@/api/app/app'
import type { PlanVO } from '@/api/app/plan'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { resolve } = useRouter()

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()
const expanded = ref(false)

const { data, execute, onDelete, onPageChange, onQueryChange, pagination, pending, query } =
  useTable(queryForm)

const { data: appList } = useRequest(getApplicationSimpleList, { immediate: true })

const toDesignPage = (id: string) => {
  const { href } = resolve({ path: `/app-design/${id}` })
  window.open(href, '_blank')
}
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:apply-plan:query')" class="!mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="query-form flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="计划名称" name="item" class="col">
          <TInput v-model:value="query.item" placeholder="请输入计划名称" />
        </TFormItem>
        <TFormItem label="应用名称" name="appId" class="col">
          <TSelect
            v-model:value="query.appId"
            :options="appList"
            filterable
            clearable
            :keys="{ label: 'name', value: 'id' }"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="开始时间" name="createTime" class="col">
          <TDateRangePicker
            v-model:value="query.createTime"
            enable-time-picker
            value-type="YYYY-MM-DD HH:mm:ss"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="截止时间" name="endTime" class="col">
          <TDateRangePicker
            v-model:value="query.endTime"
            enable-time-picker
            value-type="YYYY-MM-DD HH:mm:ss"
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="申报计划">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:apply-plan:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
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

      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #startTime="{ row }">
          {{
            dayjs(row.endTime).year() >= 2099
              ? '常态化'
              : dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
        <template #endTime="{ row }">
          {{
            dayjs(row.endTime).year() >= 2099
              ? '常态化'
              : dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
        <template #appId="{ row }">
          {{ appList?.find((item) => item.id === row.appId)?.name }}
        </template>
        <template #actions="{ row }: TableScope<PlanVO>">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('system:apply-plan:update')"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="设计应用">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('system:application:design')"
                @click="toDesignPage(row.appId!)"
              >
                <template #icon>
                  <Icon name="system-code" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip v-if="permission.has('system:apply-plan:delete')" content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销，请确认该计划没有正在进行中的申报流程"
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
    </TCard>

    <Form ref="formRef" :app-list="appList" @success="execute" />
  </div>
</template>
