<template>
  <div class="view">
    <!-- filter form -->
    <ACard v-if="permission.has('system:ip-management:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="添加时间" name="createTime">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="异常 IP 地址" name="ipAddress">
              <AInput
                v-model:value="queryParams.ipAddress"
                placeholder="请输入异常 IP 地址"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="异常类型" name="abnormalType">
              <ASelect
                v-model:value="queryParams.abnormalType"
                :options="SYSTEM_ABNORMAL"
                placeholder="请选择异常类型"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="访问时间" name="accessTime">
              <ARangePicker
                v-model:value="queryParams.accessTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="访问的资源" name="accessResource">
              <AInput
                v-model:value="queryParams.accessResource"
                placeholder="请输入访问的资源"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="处理状态" name="handlingStatus">
              <ASelect
                v-model:value="queryParams.handlingStatus"
                :options="SYSTEM_PROCESSING"
                placeholder="请选择处理状态"
              />
            </AFormItem>
          </ACol>

          <ACol :lg="{ span: 8, offset: filterExpanded ? 16 : 0 }" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton html-type="reset" @click="onFilterReset">重置</AButton>
              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <!-- table card -->
    <ACard title="异常IP管理">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:ip-management:create') && null"
            type="primary"
            :loading="pending"
            @click="modal?.open()"
          >
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
          <ATooltip v-if="permission.has('system:ip-management:export')" title="导出">
            <AButton type="text" :loading="pending">
              <template #icon>
                <ExportOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<IpManagementVO>">
            <template v-if="scope.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'abnormalType'">
              <DictTag :dict-object="SYSTEM_ABNORMAL" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'accessTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'handlingStatus'">
              <DictTag :dict-object="SYSTEM_PROCESSING" :value="scope?.text" />
            </template>
            <template v-if="scope.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="onCheckDetail(scope?.record)">
                  <UnorderedListOutlined />
                  查看详情
                </ATypographyLink>

                <APopconfirm
                  v-if="permission.has('system:ip-management:delete')"
                  title="确定将该IP纳入黑名单吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope?.record)"
                >
                  <ATypographyLink type="danger">
                    <StopOutlined />
                    纳入黑名单
                  </ATypographyLink>
                </APopconfirm>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <!-- form modal -->
    <FormModal ref="modal" @success="execute" />

    <!-- detail drawer -->
    <DetailDrawer ref="detailDrawer" :entry="selectedEntry" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import DetailDrawer from './detail.vue'
import type { IpManagementVO } from '@/api/system/abip'
import { permission } from '@/hooks/use-permission'

const modal = useTemplateRef('modal')
const detailDrawer = useTemplateRef('detailDrawer')

const [filterExpanded, toggle] = useToggle(false)

const filterFormRef = ref()
const selectedEntry = ref<IpManagementVO | null>(null)

const [SYSTEM_ABNORMAL, SYSTEM_PROCESSING] = useDict('SYSTEM_ABNORMAL', 'SYSTEM_PROCESSING')

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

// 查看详情函数
const onCheckDetail = (record: IpManagementVO) => {
  selectedEntry.value = record
  detailDrawer.value?.open()
}

defineOptions({ name: 'IpManagement' })
</script>
