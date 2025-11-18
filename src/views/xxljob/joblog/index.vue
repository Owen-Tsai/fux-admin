<template>
  <div class="view">
    <!-- filter form -->
    <TCard v-if="permission.has('xxljob:xxl-job-log:query')" class="query-form !mb-4">
      <TForm ref="queryForm" :data="query" layout="inline" class="flex flex-wrap gap-y-4 w-full" label-width="100px" @submit="onQueryChange()" @reset="onQueryChange(true)">
        <TFormItem label="执行器" name="jobGroup" class="col">
          <t-select v-model="query.jobGroup" placeholder="请选择执行器" clearable @change="onGetJobInfoListAll">
            <t-option v-for="item in allGroupList" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </TFormItem>
        <TFormItem label="任务" name="jobId" class="col">
          <TSelect v-model="query.jobId" placeholder="请选择任务" clearable>
            <t-option v-for="item in allJobInfoList" :key="item.id" :value="item.id" :label="item.jobDesc"></t-option>
          </TSelect>
        </TFormItem>
        <TFormItem v-show="expanded" label="时间区间" name="timeScope" class="col">
          <t-date-range-picker v-model="query.timeScope" enable-time-picker allow-input clearable format="YYYY-MM-DD HH:mm:ss" :default-time="['00:00:00', '23:59:59']" />
        </TFormItem>
        <TFormItem v-show="expanded" label="状态" name="logStatus" class="col">
          <TSelect v-model="query.logStatus" placeholder="请选择状态" clearable :options="StatusOptions" />
        </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="调度日志">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton v-if="permission.has('xxljob:xxl-job-log:delete')" theme="primary" @click="formRef?.open()" v-show="false">
            <template #icon>
              <Icon name="delete-1" />
            </template>
            日志清理
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
          <template #jobId="{ row }">
            <TButton theme="primary" variant="text" @click="showJobDetail(row)">{{row.jobId}}</TButton>
          </template>
          <template #triggerCode="{ row }">
            <span :class="{'sucColor':row.triggerCode===200,'failColor':row.triggerCode===500}">
            {{ row.triggerCode === 200 ? '成功' : (row.triggerCode === 500 ? '失败' : '') }}
            </span>
          </template>
          <template #triggerMsg="{ row }">
            <TButton theme="primary" variant="text" @click="showTriggerMsg(row)">查看</TButton>
          </template>
          <template #triggerTime="{ row }">
            {{ dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template #handleTime="{ row }">
            {{ dayjs(row.handleTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template #handleCode="{ row }">
            <span :class="{'sucColor':row.handleCode===200,'failColor':row.handleCode===500}">
            {{ row.handleCode === 200 ? '成功' : (row.handleCode === 500 ? '失败' : '') }}
            </span>
          </template>
          <template #handleMsg="{ row }">
            <TButton v-if="row.handleMsg" theme="primary" variant="text" @click="console.log(row.handleMsg)">查看</TButton>
            <span v-else class="text-gray-500">无</span>
          </template>
          <template #actions="{ row }">
            <t-space>
              <t-dropdown :min-column-width="88" trigger="click">
                <t-button> 操作 <template #suffix> <t-icon name="chevron-down" size="16" /></template></t-button>
                <t-dropdown-menu>
                  <t-dropdown-item value="logDetail" v-show="row.triggerCode===200" @click="onShowLogDetail(row)">日志详情</t-dropdown-item>
                  <t-dropdown-item v-if="permission.has('xxljob:job-info:kill') && row.triggerCode===200 && row.handleCode===0" value="killJob" @click="onKillJob(row)" v-show="false">终止</t-dropdown-item>
                </t-dropdown-menu>
              </t-dropdown>
            </t-space>
          </template>
        </TTable>
      </div>
    </TCard>

    <Form ref="formRef" @success="execute" />
    <HtmlMessageDialog ref="htmlMessageDialogRef" />
    <JobLogDetail ref="jobLogDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import Form from './form.vue'
import type { FormInstanceFunctions, DateRangePickerProps } from 'tdesign-vue-next'
import { getGroupListAll, type JobGroupVO } from '@/api/xxljob/jobgroup'
import { getJobInfoListAll, type JobInfoVO } from '@/api/xxljob/jobinfo'
import { type XxlJobLogVO } from '@/api/xxljob/joblog'
import HtmlMessageDialog from "./components/HtmlMessageDialog.vue";
import JobLogDetail from "./components/JobLogDetail.vue";

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const htmlMessageDialogRef =  ref<InstanceType<typeof HtmlMessageDialog> | null>(null) // html弹窗展示
const jobLogDetailRef =  ref<InstanceType<typeof JobLogDetail> | null>(null) // 日志详情

const { permission } = usePermission()
const allGroupList = ref<JobGroupVO[]>([])
const allJobInfoList = ref<JobInfoVO[]>([])

onMounted(() => {
  getGroupListAll().then((res: JobGroupVO[]) => {
    allGroupList.value = res
  })
  onGetJobInfoListAll()
})

const { data, pending, execute, query, onQueryChange, pagination, onPageChange, onDelete } = useTable(queryForm)
const expanded = ref(false)

defineOptions({ name: 'XxlJobLog' })


const onGetJobInfoListAll = () => {
  query.value.jobId = undefined
  getJobInfoListAll({
    "jobGroup": query.value.jobGroup,
  }).then((res: JobInfoVO[]) => {
    allJobInfoList.value = res
  })
}

const showJobDetail = (row: any) => {
  const desc = '执行器地址：' + row.executorAddress + '<br>' +
    'JobHandler：' + row.executorHandler + '<br>' +
    '任务参数：' + row.executorParam
  htmlMessageDialogRef.value?.open(desc, {
    header: '任务详情',
  })
}

const showTriggerMsg = (row: any) => {
  htmlMessageDialogRef.value?.open(row.triggerMsg, {
    header: '调度备注'
  })
}

const onShowLogDetail = (row: XxlJobLogVO) => {
  jobLogDetailRef.value?.open(row)
}
const onKillJob = (row: XxlJobLogVO) => {
  const desc = '确定终止任务吗？'
  htmlMessageDialogRef.value?.open(desc, {
    header: '终止任务',
    confirmBtn: '终止任务',
    onConfirm: () => {
    }
  })
}

const selectTimeRange = ref<string[]>([])
const onTimeScopeChange: DateRangePickerProps['onChange'] = (value, context) => {
  console.log('onChange:', value, context);
  console.log('selectTimeRange:', selectTimeRange.value  )
  query.value.timeScope = selectTimeRange.value
  console.log('selectTimeRange:', query.value.timeScope  )
};

const StatusOptions = [
  { value: 1, label: '成功' },
  { value: 2, label: '失败' },
  { value: 3, label: '进行中' }
]
</script>
<style lang="scss" scoped>
.sucColor {
  color: #00b42a;
}
.failColor {
  color: #ff0000;
}
</style>
