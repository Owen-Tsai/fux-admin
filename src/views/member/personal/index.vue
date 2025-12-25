<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Detail from './detail/index.vue'
import { exportExcel, type ProfileVO } from '@/api/member/personal'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const dialogRef = useTemplateRef<InstanceType<typeof Detail>>('dialogRef')

const { permission } = usePermission()
const exporting = ref(false)

const [sexOpts, degreeOpts, diplomaOpts, diplomaTypeOpts, politicOpts] = useDict(
  'user_sex',
  'user_degree',
  'rc_education_level',
  'rc_education_type',
  'rc_politic',
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
        <TFormItem label="人才名称" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入人才名称" clearable />
        </TFormItem>
        <TFormItem label="单位名称" name="companyName" class="col">
          <TInput v-model:value="query.companyName" placeholder="请输入单位名称" clearable />
        </TFormItem>
        <TFormItem v-show="expanded" label="性别" name="sex" class="col">
          <TSelect
            v-model:value="query.sex"
            :options="sexOpts"
            placeholder="请选择性别"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="学历" name="diploma" class="col">
          <TSelect
            v-model:value="query.diploma"
            :options="diplomaOpts"
            placeholder="请选择学历"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="学历类型" name="diplomaType" class="col">
          <TSelect
            v-model:value="query.diplomatype"
            :options="diplomaTypeOpts"
            placeholder="请选择学历类型"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="学位" name="degree" class="col">
          <TSelect
            v-model:value="query.degree"
            :options="degreeOpts"
            placeholder="请选择学位"
            clearable
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="政治面貌" name="politicalstatus" class="col">
          <TSelect
            v-model:value="query.politicalstatus"
            :options="politicOpts"
            placeholder="请选择政治面貌"
            clearable
          />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="人才信息库">
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
        <template #age="{ row }: TableScope<ProfileVO>">
          {{ dayjs().diff(dayjs(row.birthday), 'year') }}
        </template>
        <template #sex="{ row }: TableScope<ProfileVO>">
          <DictTag :dict-data="sexOpts" :value="row.sex" />
        </template>
        <template #degree="{ row }: TableScope<ProfileVO>">
          <DictTag :dict-data="degreeOpts" :value="row.degree" />
        </template>
        <template #diploma="{ row }: TableScope<ProfileVO>">
          <DictTag :dict-data="diplomaOpts" :value="row.diploma" />
        </template>
        <template #diplomaType="{ row }: TableScope<ProfileVO>">
          <DictTag :dict-data="diplomaTypeOpts" :value="row.diplomatype" />
        </template>
        <template #politicalStatus="{ row }: TableScope<ProfileVO>">
          <DictTag :dict-data="politicOpts" :value="row.politicalstatus" />
        </template>
        <template #regdate="{ row }: TableScope<ProfileVO>">
          {{ row.regdate ? dayjs(row.regdate).format('YYYY-MM-DD HH:mm') : '' }}
        </template>
        <template #isEnabled="{ row }: TableScope<ProfileVO>">
          <TSwitch
            v-model:value="row.isenable"
            :label="['允许', '禁止']"
            :custom-value="[0, 1]"
            @change="(v) => onSetEnable(row.id!, v as number)"
          />
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
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
            <TTooltip content="人才画像">
              <TButton shape="square" theme="primary" variant="text">
                <template #icon>
                  <Icon name="accessibility" />
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
