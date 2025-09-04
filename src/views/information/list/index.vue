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

const [statusOpts, booleanOpts] = useDict('information_status', 'infra_boolean_string')

const { data, execute, onDelete, onPageChange, onQueryChange, pagination, pending, query } =
  useTable(queryForm)

// const toViewPage = (id: string) => {
//   const { href } = resolve({ path: `/app-design/${id}` })
//   window.open(href, '_blank')
// }
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('system:info-list:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="资讯标题" name="title" class="col">
          <TInput v-model:value="query.title" placeholder="请输入资讯标题" />
        </TFormItem>
        <TFormItem label="资讯类别" name="infoType" class="col">
          <TSelect v-model:value="query.infoType" placeholder="请选择资讯类别" />
        </TFormItem>
        <TFormItem v-show="expanded" label="是否置顶" name="isPinned" class="col">
          <TSelect
            v-model:value="query.isPinned"
            :options="booleanOpts"
            placeholder="请选择是否置顶"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="是否在首页显示" name="isInHome" class="col">
          <TSelect
            v-model:value="query.isInHome"
            :options="booleanOpts"
            placeholder="请选择是否在首页显示"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="发布时间" name="publishTime" class="col">
          <TDateRangePicker v-model:value="query.publishTime" value-type="YYYY-MM-DD" clearable />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-2/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="资讯列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:info-list:create')"
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
            <TTag v-if="row.isPinned" theme="danger" variant="light-outline" class="flex-none"
              >置顶</TTag
            >
            <TTag v-if="row.isInHome" theme="primary" variant="light-outline" class="flex-none"
              >首页显示</TTag
            >
          </div>
        </template>
        <template #auditState="{ row }">
          <DictTag :dict-data="statusOpts" :value="row.auditState" />
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
                :disabled="permission.hasNone('system:info-list:update')"
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

    <Form ref="formRef" @success="execute" />
  </div>
</template>
