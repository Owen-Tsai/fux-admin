<template>
  <div class="view">
    <!-- filter form -->
    <ACard class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="类型" name="type">
              <ASelect
                v-model:value="queryParams.type"
                :options="COMPLAINT_SUGGESTION_TYPE"
                placeholder="请选择类型"
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="姓名" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入姓名" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="手机" name="mobile">
              <AInput v-model:value="queryParams.mobile" placeholder="请输入手机" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间" name="createTime">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="状态" name="status">
              <ASelect
                v-model:value="queryParams.status"
                :options="COMPLAINT_SUGGESTION_STATUS"
                placeholder="请选择状态"
              />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
              <AFormItem label="回复时间" name="replyTime">
              <ARangePicker
                v-model:value="queryParams.replyTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol> -->

          <ACol :lg="{ span: 8, offset: filterExpanded ? 0 : 0 }" :span="24">
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
    <ACard title="投诉 和 建议">
      <template #extra>
        <AFlex :gap="8">
          <AButton v-if="false" type="primary" :loading="pending" @click="modal?.open()">
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
          <ATooltip v-if="false" title="导出">
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
          <template #bodyCell="scope: TableScope<SuggestionVO>">
            <template v-if="scope.column.key === 'type'">
              <DictTag :dict-object="COMPLAINT_SUGGESTION_TYPE" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'status'">
              <DictTag :dict-object="COMPLAINT_SUGGESTION_STATUS" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'replyTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="detailDrawer?.open(scope?.record.id)">
                  <EyeOutlined />
                  查看
                </ATypographyLink>
                <APopconfirm
                  v-if="false"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope?.record)"
                >
                  <ATypographyLink type="danger">
                    <DeleteOutlined />
                    删除
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
    <DetailDrawer ref="detailDrawer" @success="execute" />
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
import DetailDrawer from './detail-drawer.vue'
import type { SuggestionVO } from '@/api/website/suggestion'
import { permission } from '@/hooks/use-permission'

const modal = useTemplateRef('modal')
const detailDrawer = useTemplateRef('detailDrawer')

const [filterExpanded, toggle] = useToggle(false)

const filterFormRef = ref()

const [COMPLAINT_SUGGESTION_TYPE, COMPLAINT_SUGGESTION_STATUS, YES_NO] = useDict(
  'complaint_suggestion_type',
  'complaint_suggestion_status',
  'yes_no',
)

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

defineOptions({ name: 'Suggestion' })
</script>
