
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
            <TFormItem  label="姓名" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入姓名" allow-clear />
            </TFormItem>
            <TFormItem  label="学历" name="diploma" class="col">
              <TInput v-model:value="query.diploma" placeholder="请输入学历" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="毕业学校" name="graduateSchool" class="col">
              <TInput v-model:value="query.graduateSchool" placeholder="请输入毕业学校" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="毕业时间" name="graduateTime" class="col">
              <TDateRangePicker
                v-model:value="query.graduateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="专业名称" name="major" class="col">
              <TInput v-model:value="query.major" placeholder="请输入专业名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="学习形式" name="studyType" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem>
              <TFormItem  v-show='expanded' label="入学时间" name="startTime" class="col">
              <TDateRangePicker
                v-model:value="query.startTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
            <TFormItem  v-show='expanded' label="证书编号" name="certNo" class="col">
              <TInput v-model:value="query.certNo" placeholder="请输入证书编号" allow-clear />
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
    <TCard title="高等教育学历信息">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:edu-info:create')"
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
             <template #graduateTime="{ row }">
              {{ dayjs(row.graduateTime).format('YYYY-MM-DD') }}
            </template>
             <template #startTime="{ row }">
              {{ dayjs(row.startTime).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:edu-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:edu-info:delete')">
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
  import type { EduInfoVO } from '@/api/application/imported/edu'
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

  defineOptions({ name: 'EduInfo' })
</script>
