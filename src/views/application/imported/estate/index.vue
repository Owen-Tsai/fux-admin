
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
            <TFormItem  label="不动产权证号" name="certNo" class="col">
              <TInput v-model:value="query.certNo" placeholder="请输入不动产权证号" allow-clear />
            </TFormItem>
            <TFormItem  label="不动产单元号" name="unitNo" class="col">
              <TInput v-model:value="query.unitNo" placeholder="请输入不动产单元号" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="权属状态" name="ownershipStatus" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem>
            <TFormItem  v-show='expanded' label="坐落" name="location" class="col">
              <TInput v-model:value="query.location" placeholder="请输入坐落" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="建筑面积" name="buildingArea" class="col">
              <TInput v-model:value="query.buildingArea" placeholder="请输入建筑面积" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="所在层" name="floor" class="col">
              <TInput v-model:value="query.floor" placeholder="请输入所在层" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="总层数" name="totalFloors" class="col">
              <TInput v-model:value="query.totalFloors" placeholder="请输入总层数" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="竣工时间" name="completionTime" class="col">
              <TDateRangePicker
                v-model:value="query.completionTime"
                value-format="YYYY-MM-DD HH:mm:ss"
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
    <TCard title="不动产登记信息表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:estate-info:create')"
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
             <template #completionTime="{ row }">
              {{ dayjs(row.completionTime).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:estate-info:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:estate-info:delete')">
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
  import type { EstateInfoVO } from '@/api/application/imported/estate'
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

  defineOptions({ name: 'EstateInfo' })
</script>
