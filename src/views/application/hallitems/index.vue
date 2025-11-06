<template>
  <div class="view">
    <!-- filter form -->
    <TCard v-if="permission.has('application:hall-items:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="事项名称" name="itemName" class="col">
          <TInput v-model:value="query.itemName" placeholder="请输入事项名称" allow-clear />
        </TFormItem>
        <TFormItem label="状态" name="status" class="col">
          <TSelect
            v-model:value="query.status"
            :options="SYSTEM_APPLICATION_STATUS"
            placeholder="请选择状态"
          />
        </TFormItem>
        <TFormItem v-show="expanded" label="是否热门" name="isHot" class="col">
          <TSelect
            v-model:value="query.isHot"
            :options="YES_NO"
            placeholder="请选择是否热门"
          />
        </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-2/3' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="网上服务大厅事项表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('application:hall-items:create')"
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
          <template #iconPath="{ row }">
            <TImage :src="row.iconPath" fit="cover" :style="{ width: '50px', height: '50px' }" />
          </template>
          <template #status="{ row }">
            <TSwitch
              v-model="row.status"
              :label="['上架', '下架']" :customValue="customSwitchValue"
              @change="(v) => onSetPublishedStatus(row, v as number)"
            />
          </template>
          <template #isHot="{ row }">
            <TSwitch
              v-model="row.isHot"
              :label="['是', '否']"
              @change="(v) => onSetHotStatus(row, v as boolean)"
            />
          </template>
          <template #createTime="{ row }">
            {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template #actions="{ row }">
            <div class="flex gap-2">
              <TTooltip content="编辑" v-if="permission.has('application:hall-items:update')">
                <TButton
                  shape="square"
                  theme="primary"
                  variant="text"
                  @click="formRef?.open(row.id)"
                >
                  <template #icon>
                    <Icon name="edit-2" />
                  </template>
                </TButton>
              </TTooltip>
              <TTooltip content="删除" v-if="permission.has('application:hall-items:delete')">
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
import useDict from '@/hooks/use-dict'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()

const [SYSTEM_APPLICATION_STATUS, YES_NO] = useDict('system_application_status', 'yes_no')

const { data, pending, execute, query, onQueryChange, pagination, onPageChange, onDelete, onSetPublishedStatus,onSetHotStatus } = useTable(queryForm)
const expanded = ref(false)

const customSwitchValue = ref([1, 0])

defineOptions({ name: 'HallItems' })
</script>
<style scoped lang="scss">
.t-image__wrapper {
  background: none;
}
</style>
