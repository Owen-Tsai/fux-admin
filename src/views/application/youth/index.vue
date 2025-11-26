
<template>
  <div class="view">
    <!-- filter form -->
    <TCard class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
            <TFormItem  label="身份证号" name="idcard" class="col">
              <TInput v-model:value="query.idcard" placeholder="请输入身份证号" allow-clear />
            </TFormItem>
            <TFormItem  label="姓名" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入姓名" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="出生年月" name="birthday" class="col">
               <TDateRangePicker
                v-model:value="query.birthday"
                value-type="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择出生年月"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="学历" name="diploma" class="col">
              <TSelect
                  v-model:value="query.diploma"
                  :options="USER_EDUCATION"
                  placeholder="请选择学历"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="职称" name="professionalTitle" class="col">
              <TSelect
                  v-model:value="query.professionalTitle"
                  :options="PERSONAL_TITLE_LEVEL"
                  placeholder="请选择职称"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="工作单位" name="workUnit" class="col">
              <TInput v-model:value="query.workUnit" placeholder="请输入工作单位" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="技术领域" name="techField" class="col">
              <TSelect
                  v-model:value="query.techField"
                  :options="TEC_FIELD"
                  placeholder="请选择技术领域"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="人才称号" name="talentTitle" class="col">
              <TSelect
                  v-model:value="query.talentTitle"
                  :options="YOUTH_CREATE_TITLE"
                  placeholder="请选择人才称号"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="支持资金" name="supportFund" class="col">
              <TInput v-model:value="query.supportFund" placeholder="请输入支持资金" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="入选年度" name="selectionYear" class="col">
              <TInput v-model:value="query.selectionYear" placeholder="请输入入选年度" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="所在县区" name="county" class="col">
              <TSelect
                  v-model:value="query.county"
                  :options="APPLY_INAREA"
                  placeholder="请选择所在县区"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="本人联系方式" name="contact" class="col">
              <TInput v-model:value="query.contact" placeholder="请输入本人联系方式" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="项目验收结果" name="projectResult" class="col">
              <TInput v-model:value="query.projectResult" placeholder="请输入项目验收结果" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="创建时间" name="createTime" class="col">
              <TDateRangePicker
                v-model:value="query.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>

        <QueryActions v-model:expanded="expanded" class="col ml-auto" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="河洛青年创新创业人才表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton

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

      <div class="overflow-x-auto">
        <TTable
          :data="data?.list"
          row-key="id"
          :columns="columns"
          :pagination="pagination"
          :loading="pending"
          @page-change="onPageChange"
        >
             <template #birthday="{ row }">
              {{ dayjs(row.birthday).format('YYYY-MM-DD') }}
            </template>
             <template #diploma="{ row }">
              <DictTag :dict-data="USER_EDUCATION" :value="scope?.text" />
            </template>
             <template #professionalTitle="{ row }">
              <DictTag :dict-data="PERSONAL_TITLE_LEVEL" :value="scope?.text" />
            </template>
             <template #techField="{ row }">
              <DictTag :dict-data="TEC_FIELD" :value="scope?.text" />
            </template>
             <template #talentTitle="{ row }">
              <DictTag :dict-data="YOUTH_CREATE_TITLE" :value="scope?.text" />
            </template>
             <template #county="{ row }">
              <DictTag :dict-data="APPLY_INAREA" :value="scope?.text" />
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"

                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:youth-create:delete')">
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
  import dayjs from 'dayjs'
  import { useToggle } from '@vueuse/core'
  import useDict from '@/hooks/use-dict'
  import { useTable, columns } from './use-table'
  import Form from './form.vue'
  import type { YouthCreateVO } from '@/api/application/youth'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

  const { permission } = usePermission()

  const [
    USER_EDUCATION ,
    PERSONAL_TITLE_LEVEL ,
    TEC_FIELD ,
    YOUTH_CREATE_TITLE ,
    APPLY_INAREA ,
    YES_NO
  ] = useDict(
    "user_education" ,
    "personal_title_level" ,
    "tec_field" ,
    "youth_create_title" ,
    "apply_inarea" ,
    "yes_no"
  )

  const {
    data,
    pending,
    execute,
    query,
    onQueryChange,
    pagination,
    onPageChange,
    onDelete
  } = useTable(queryForm)
  const expanded = ref(false)

  defineOptions({ name: 'YouthCreate' })
</script>
