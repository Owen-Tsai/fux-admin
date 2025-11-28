
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
            <TFormItem  label="缴费期别" name="payPeriod" class="col">
              <TInput v-model:value="query.payPeriod" placeholder="请输入缴费期别" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="缴费基数" name="payBase" class="col">
              <TInput v-model:value="query.payBase" placeholder="请输入缴费基数" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="缴费金额" name="payAmount" class="col">
              <TInput v-model:value="query.payAmount" placeholder="请输入缴费金额" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="单位编号" name="unitNo" class="col">
              <TInput v-model:value="query.unitNo" placeholder="请输入单位编号" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="参保地行政区划代码" name="insuredAreaCode" class="col">
              <TInput v-model:value="query.insuredAreaCode" placeholder="请输入参保地行政区划代码" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="个人身份" name="personalIdentity" class="col">
              <TInput v-model:value="query.personalIdentity" placeholder="请输入个人身份" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="缴费年月" name="payYearmonth" class="col">
               <TDateRangePicker
                v-model:value="query.payYearmonth"
                value-type="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择缴费年月"
                clearable
              />
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
    <TCard title="养老保险个人缴存信息">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:insur-info:create')"
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
             <template #payYearmonth="{ row }">
              {{ dayjs(row.payYearmonth).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:insur-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:insur-info:delete')">
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
  import { useTable, columns } from './use-table'
  import Form from './form.vue'
  import type { InsurInfoVO } from '@/api/application/imported/insur'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

  const { permission } = usePermission()


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

  defineOptions({ name: 'InsurInfo' })
</script>
