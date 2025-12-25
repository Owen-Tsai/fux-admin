<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail.vue'
import { exportExcel, type ProfileVO } from '@/api/member/company'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const dialogRef = useTemplateRef('dialogRef')

const { permission } = usePermission()
const exporting = ref(false)

const [YES_NO, ORG_TYPE, TEC_FIELD, COMPANY_NATURE, SCALE_SIZE] = useDict(
  'yes_no',
  'org_type',
  'tec_field',
  'company_nature',
  'scale_size',
)

const { data, pending, execute, query, onQueryChange, pagination, onPageChange, onSetEnable } =
  useTable(queryForm)

const expanded = ref(false)

const onExport = async () => {
  exporting.value = true
  try {
    await exportExcel(query.value)
  } finally {
    exporting.value = false
  }
}

defineOptions({ name: 'MemberPersonal' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('member:talent-info:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="单位名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入单位名称" clearable />
        </TFormItem>
        <TFormItem label="用户名" name="username" class="col">
          <TInput v-model:value="query.username" placeholder="请输入用户名" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="统一社会信用代码" name="creditrate" class="col">
          <TInput v-model:value="query.creditrate" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="联系人" name="contact" class="col">
          <TInput v-model:value="query.contact" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="单位性质" name="unitnature" class="col">
          <TSelect
            v-model:value="query.unitnature"
            :options="COMPANY_NATURE"
            placeholder="请选择单位性质"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="机构类型" name="institutionType" class="col">
          <TSelect
            v-model:value="query.institutionType"
            :options="ORG_TYPE"
            placeholder="请选择机构类型"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="单位信息库">
      <template #actions>
        <div class="flex items-center gap-2">
          <TTooltip content="导出">
            <TButton
              v-if="permission.has('member:talent-info:export')"
              shape="square"
              theme="default"
              variant="text"
              :loading="exporting"
              @click="onExport()"
            >
              <template #icon>
                <Icon name="download" />
              </template>
            </TButton>
          </TTooltip>
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
        <template #institutionType="{ row }">
          <DictTag :dict-data="ORG_TYPE" :value="row.institutionType" />
        </template>
        <template #unitnature="{ row }">
          <DictTag :dict-data="COMPANY_NATURE" :value="row.unitnature" />
        </template>
        <template #scale="{ row }">
          <DictTag :dict-data="SCALE_SIZE" :value="row.scale" />
        </template>
        <template #unitSize="{ row }">
          <DictTag :dict-data="SCALE_SIZE" :value="row.unitSize" />
        </template>
        <template #isenable="{ row }">
          <TSwitch
            v-model:value="row.isenable"
            :label="['允许', '禁止']"
            @change="(v) => onSetEnable(row.id!, v as boolean)"
          />
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2">
            <TTooltip content="查看详情">
              <TButton shape="square" theme="primary" variant="text" @click="dialogRef?.open(row)">
                <template #icon>
                  <Icon name="browse" />
                </template>
              </TButton>
            </TTooltip>
          </div>
        </template>
      </TTable>
    </TCard>

    <Detail ref="dialogRef" />
  </div>
</template>
