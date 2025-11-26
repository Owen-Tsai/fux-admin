
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
            <TFormItem  label="企业名称" name="companyName" class="col">
              <TInput v-model:value="query.companyName" placeholder="请输入企业名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="项目名称" name="projectName" class="col">
              <TInput v-model:value="query.projectName" placeholder="请输入项目名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="团队带头人" name="teamLeader" class="col">
              <TInput v-model:value="query.teamLeader" placeholder="请输入团队带头人" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="产业类别" name="industryType" class="col">
              <TSelect
                  v-model:value="query.industryType"
                  :options="TEC_FIELD"
                  placeholder="请选择产业类别"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="投资金额" name="investmentAmount" class="col">
              <TInput v-model:value="query.investmentAmount" placeholder="请输入投资金额" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="落地县区" name="landingCounty" class="col">
              <TSelect
                  v-model:value="query.landingCounty"
                  :options="APPLY_INAREA"
                  placeholder="请选择落地县区"
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="联系人" name="contactPerson" class="col">
              <TInput v-model:value="query.contactPerson" placeholder="请输入联系人" allow-clear />
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
    <TCard title="河洛高层次创新创业人才(团队)">
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
             <template #industryType="{ row }">
              <DictTag :dict-data="TEC_FIELD" :value="scope?.text" />
            </template>
             <template #landingCounty="{ row }">
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
                <TTooltip content="删除" v-if="permission.has('applications:high-create-group:delete')">
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
  import type { HighCreateGroupVO } from '@/api/application/high'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

  const { permission } = usePermission()

  const [
    TEC_FIELD ,
    APPLY_INAREA ,
    YES_NO
  ] = useDict(
    "tec_field" ,
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

  defineOptions({ name: 'HighCreateGroup' })
</script>
