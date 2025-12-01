
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
            <TFormItem  label="女方姓名" name="femaleName" class="col">
              <TInput v-model:value="query.femaleName" placeholder="请输入女方姓名" allow-clear />
            </TFormItem>
            <TFormItem  label="女方身份证件号码" name="femaleIdcard" class="col">
              <TInput v-model:value="query.femaleIdcard" placeholder="请输入女方身份证件号码" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="男方姓名" name="maleName" class="col">
              <TInput v-model:value="query.maleName" placeholder="请输入男方姓名" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="男方身份证件号码" name="maleIdcard" class="col">
              <TInput v-model:value="query.maleIdcard" placeholder="请输入男方身份证件号码" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="登记日期" name="registerDate" class="col">
              <TDateRangePicker
                v-model:value="query.registerDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="婚姻状况" name="maritalStatus" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem>
            <TFormItem  v-show='expanded' label="登记机关" name="registerAuthority" class="col">
              <TInput v-model:value="query.registerAuthority" placeholder="请输入登记机关" allow-clear />
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
    <TCard title="婚姻登记信息表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:marry-info:create')"
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
             <template #registerDate="{ row }">
              {{ dayjs(row.registerDate).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:marry-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:marry-info:delete')">
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
  import type { MarryInfoVO } from '@/api/application/imported/marry'
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

  defineOptions({ name: 'MarryInfo' })
</script>
