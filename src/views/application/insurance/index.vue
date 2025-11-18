
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
            <TFormItem  label="参保人证件号" name="idcard" class="col">
              <TInput v-model:value="query.idcard" placeholder="请输入参保人证件号" allow-clear />
            </TFormItem>
            <TFormItem  label="参保人姓名" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入参保人姓名" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="缴费单位名称" name="companyName" class="col">
              <TInput v-model:value="query.companyName" placeholder="请输入缴费单位名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="统一社会信用代码" name="orgNum" class="col">
              <TInput v-model:value="query.orgNum" placeholder="请输入统一社会信用代码" allow-clear />
            </TFormItem>
            <!-- <TFormItem  v-show='expanded' label="人员参保状态" name="status" class="col">
              <span>请选择字典类型以生成选择框</span>
            </TFormItem> -->
              <TFormItem  v-show='expanded' label="开始时间" name="startDate" class="col">
              <TDateRangePicker
                v-model:value="query.startDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? '' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="医疗保险业务对接">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:medical-insurance:create')"
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
             <template #startDate="{ row }">
              {{ dayjs(row.startDate).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip content="查看详情">
                  <TButton shape="square" theme="default" variant="text" @click="openDetail(row.id!)">
                    <template #icon>
                      <Icon name="zoom-in" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:medical-insurance:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:medical-insurance:delete')">
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
    <DetailDrawer
      ref="detailDrawerRef"
      v-model:visible="detailVisible"
      :id="selectedId"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import { useToggle } from '@vueuse/core'
  import { useTable, columns } from './use-table'
  import Form from './form.vue'
  import DetailDrawer from './detail-drawer.vue'
  import type { MedicalInsuranceVO } from '@/api/application/insurance'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
  const detailDrawerRef = useTemplateRef<InstanceType<typeof DetailDrawer>>('detailDrawerRef')

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
  const detailVisible = ref(false)
  const selectedId = ref<string>('')

  /**
   * 打开详情抽屉
   * @param id 记录ID
   */
  const openDetail = (id: string) => {
    selectedId.value = id
    detailVisible.value = true
  }

  defineOptions({ name: 'MedicalInsurance' })
</script>
