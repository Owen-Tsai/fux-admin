
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
            <TFormItem  label="贷款总额" name="loanTotal" class="col">
              <TInput v-model:value="query.loanTotal" placeholder="请输入贷款总额" allow-clear />
            </TFormItem>
            <TFormItem  label="公积金贷款金额" name="fundLoanAmount" class="col">
              <TInput v-model:value="query.fundLoanAmount" placeholder="请输入公积金贷款金额" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="借款人姓名" name="borrowerName" class="col">
              <TInput v-model:value="query.borrowerName" placeholder="请输入借款人姓名" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="借款人证件号码" name="borrowerIdcard" class="col">
              <TInput v-model:value="query.borrowerIdcard" placeholder="请输入借款人证件号码" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="单位名称" name="unitName" class="col">
              <TInput v-model:value="query.unitName" placeholder="请输入单位名称" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="手机号码" name="phone" class="col">
              <TInput v-model:value="query.phone" placeholder="请输入手机号码" allow-clear />
            </TFormItem>

        <QueryActions v-model:expanded="expanded" class="col ml-auto" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="公积金贷款信息表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:reserve-fund-loan:create')"
                  theme="primary"
                  @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>
          <TButton
                  theme="default"
                  @click="onExport"
          >
            <template #icon>
              <Icon name="download" />
            </template>
            导出
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
                  v-if='permission.has("applications:reserve-fund-loan:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:reserve-fund-loan:delete')">
                  <TPopconfirm
                          content="该操作无法撤销，确定要删除吗？"
                          theme="danger"
                          @confirm="onDelete(row.id!)">
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
  import type { ReserveFundLoanVO } from '@/api/application/loan'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'
  import { exportReserveFundLoan } from '@/api/application/loan'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
  const detailDrawerRef = useTemplateRef<InstanceType<typeof DetailDrawer>>('detailDrawerRef')

  const { permission } = usePermission()


  const { data, pending, execute, query, onQueryChange, pagination, onPageChange, onDelete } = useTable(queryForm)
  const expanded = ref(false)
  const detailVisible = ref(false)
  const selectedId = ref<string>('')

  // 打开详情抽屉
  const openDetail = (id: string) => {
    selectedId.value = id
    detailVisible.value = true
  }

  /**
   * 导出Excel文件
   * 使用当前查询条件导出公积金贷款信息数据
   */
  const onExport = async () => {
    try {
      await exportReserveFundLoan(query.value)
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  defineOptions({ name: 'ReserveFundLoan' })
</script>
