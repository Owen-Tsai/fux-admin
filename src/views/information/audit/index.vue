<template>
  <div class="view">
    <TCard v-if="permission.has('system:info-audit:query')" class="query-form !mb-4">
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
          <TTreeSelect
            v-model:value="query.infoType"
            :data="treeData"
            :keys="{ label: 'name', value: 'id' }"
            placeholder="请选择资讯类别"
            clearable
          />
        </TFormItem>
        <QueryActions :expanded="null" class="col" />
      </TForm>
    </TCard>

    <TCard title="资讯列表">
      <template #actions>
        <div class="flex items-center gap-2">
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
        <template #infoType="{ row }">
          {{ treeData?.find((item) => item.id === row.infoType)?.name || '—' }}
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #updateTime="{ row }">
          {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TTooltip content="审核">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('system:info-audit:approve')"
                @click="formRef?.open(row)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" :type-tree="treeData" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import Form from './form.vue'
import { getInfoTypeTree } from '@/api/information/type'
import { useTable, columns } from './use-table'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { permission } = usePermission()
const formRef = useTemplateRef('formRef')
const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')

// const [informationStatus] = useDict('information_status')

const { data, execute, pending, pagination, onPageChange, onQueryChange, query } =
  useTable(queryForm)

const { data: treeData } = useRequest(getInfoTypeTree, {
  immediate: true,
})

defineOptions({ name: 'InformationList' })
</script>
