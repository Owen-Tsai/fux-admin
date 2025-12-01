
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
            <TFormItem  label="单位编号" name="unitSocialCode" class="col">
              <TInput v-model:value="query.unitSocialCode" placeholder="请输入单位编号" allow-clear />
            </TFormItem>
            <TFormItem  label="单位名称" name="unitName" class="col">
              <TInput v-model:value="query.unitName" placeholder="请输入单位名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="个人编号" name="personalNo" class="col">
              <TInput v-model:value="query.personalNo" placeholder="请输入个人编号" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="姓名" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入姓名" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="缴费年月" name="payYearmonth" class="col">
               <TDateRangePicker
                v-model:value="query.payYearmonth"
                value-type="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择缴费年月"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="缴费状态" name="payStatus" class="col">
              <span>请选择字典类型以生成选择框</span>
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
    <TCard title="社保个人缴存信息">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:social-info:create')"
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
                  v-if='permission.has("applications:social-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:social-info:delete')">
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
  import type { SocialInfoVO } from '@/api/application/imported/social'
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

  defineOptions({ name: 'SocialInfo' })
</script>
