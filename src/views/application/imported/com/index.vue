
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
            <TFormItem  label="企业名称" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入企业名称" allow-clear />
            </TFormItem>
            <TFormItem  label="企业类型" name="enterpriseType" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem>
              <TFormItem  v-show='expanded' label="成立日期" name="establishDate" class="col">
              <TDateRangePicker
                v-model:value="query.establishDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="法定代表人" name="legalRep" class="col">
              <TInput v-model:value="query.legalRep" placeholder="请输入法定代表人" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="住所" name="domicile" class="col">
              <TInput v-model:value="query.domicile" placeholder="请输入住所" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="核准日期" name="approveDate" class="col">
              <TDateRangePicker
                v-model:value="query.approveDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
              <TFormItem  v-show='expanded' label="经营期限自" name="businessTermStart" class="col">
               <TDateRangePicker
                v-model:value="query.businessTermStart"
                value-type="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择经营期限自"
                clearable
              />
            </TFormItem>
              <TFormItem  v-show='expanded' label="经营期限至" name="businessTermEnd" class="col">
               <TDateRangePicker
                v-model:value="query.businessTermEnd"
                value-type="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择经营期限至"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="经营范围" name="businessScope" class="col">
              <TInput v-model:value="query.businessScope" placeholder="请输入经营范围" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="注册资本" name="registeredCapital" class="col">
              <TInput v-model:value="query.registeredCapital" placeholder="请输入注册资本" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="注册资本币种" name="currency" class="col">
              <TInput v-model:value="query.currency" placeholder="请输入注册资本币种" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="注册号" name="registrationNo" class="col">
              <TInput v-model:value="query.registrationNo" placeholder="请输入注册号" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="统一社会信用代码" name="creditCode" class="col">
              <TInput v-model:value="query.creditCode" placeholder="请输入统一社会信用代码" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="登记机关" name="registrationAuth" class="col">
              <TInput v-model:value="query.registrationAuth" placeholder="请输入登记机关" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="登记状态" name="registrationStatus" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem>
            <TFormItem  v-show='expanded' label="节点号" name="nodeNo" class="col">
              <TInput v-model:value="query.nodeNo" placeholder="请输入节点号" allow-clear />
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
    <TCard title="企业基本信息">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:com-info:create')"
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
             <template #establishDate="{ row }">
              {{ dayjs(row.establishDate).format('YYYY-MM-DD') }}
            </template>
             <template #approveDate="{ row }">
              {{ dayjs(row.approveDate).format('YYYY-MM-DD') }}
            </template>
             <template #businessTermStart="{ row }">
              {{ dayjs(row.businessTermStart).format('YYYY-MM-DD') }}
            </template>
             <template #businessTermEnd="{ row }">
              {{ dayjs(row.businessTermEnd).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:com-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:com-info:delete')">
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
  import type { ComInfoVO } from '@/api/application/imported/com'
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

  defineOptions({ name: 'ComInfo' })
</script>
