<template>
  <div class="view">
    <!-- filter form -->
    <TCard v-if="permission.has('xxljob:job-info:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="执行器" name="jobGroup" class="col">
          <t-select v-model="query.jobGroup" placeholder="请选择执行器" clearable>
            <t-option v-for="item in allGroupList" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </TFormItem>
        <TFormItem label="调度状态" name="triggerStatus" class="col">
          <t-select v-model="query.triggerStatus" placeholder="请选择调度状态" clearable>
            <t-option key="1" value="1" label="启动"></t-option>
            <t-option key="0" value="0" label="暂停"></t-option>
          </t-select>
        </TFormItem>
        <TFormItem v-show="expanded"  label="任务描述" name="jobDesc" class="col">
          <TInput v-model:value="query.jobDesc" placeholder="请输入任务描述" allow-clear />
        </TFormItem>
        <TFormItem v-show="expanded" label="JobHandler" name="executorHandler" class="col">
          <TInput
            v-model:value="query.executorHandler"
            placeholder="请输入JobHandler"
            allow-clear
          />
        </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="任务管理">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('xxljob:job-info:create')"
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
          <template #scheduleType="{ row }">
            <t-tag theme="primary" variant="outline" style="margin-right: 10px;">{{ row.scheduleType }}</t-tag>
            <span> {{ row.scheduleConf }}</span>
          </template>
          <template #executorHandler="{ row }">
            <t-tag theme="primary" variant="outline" style="margin-right: 10px;">{{ row.glueType }}</t-tag>
            <span> {{ row.executorHandler }}</span>
          </template>
          <template #triggerStatus="{ row }">
            <t-tag theme="success" v-if="row.triggerStatus === 1">运行</t-tag>
            <t-tag theme="warning" v-if="row.triggerStatus === 0">暂停</t-tag>
          </template>
          <template #actions="{ row }">
            <t-space>
              <t-dropdown :min-column-width="88" trigger="click">
                <t-button> 操作 <template #suffix> <t-icon name="chevron-down" size="16" /></template></t-button>
                <t-dropdown-menu>
                  <!--
                  <t-dropdown-item value="runOnce" v-if="permission.has('xxljob:job-info:trigger')">执行一次</t-dropdown-item>
                  <t-dropdown-item value="regNode">注册节点</t-dropdown-item>
                  <t-dropdown-item value="nextTriggerTime" v-if="row.scheduleType == 'CRON' || row.scheduleType == 'FIX_RATE'" divider>下次执行时间</t-dropdown-item>
                  -->
                  <t-dropdown-item value="startOrStop" v-if="permission.has('xxljob:job-info:start') && row.triggerStatus === 0" @click="startOrStopJobRef?.open('start', row.id)">启动</t-dropdown-item>
                  <t-dropdown-item value="startOrStop" v-if="permission.has('xxljob:job-info:stop') && row.triggerStatus === 1" @click="startOrStopJobRef?.open('stop', row.id)">停止</t-dropdown-item>
                  <t-dropdown-item value="editJob" v-if="permission.has('xxljob:job-info:update')" @click="formRef?.open(row.id)">编辑</t-dropdown-item>
                  <t-dropdown-item value="deleteJob" v-if="permission.has('xxljob:job-info:delete')" @click="onDelete(row.id)">删除</t-dropdown-item>
                  <t-dropdown-item value="copyJob" v-if="permission.has('xxljob:job-info:create')" @click="formRef?.open(row.id, true)">复制</t-dropdown-item>
                </t-dropdown-menu>
              </t-dropdown>
            </t-space>
          </template>
        </TTable>
      </div>
    </TCard>

    <Form ref="formRef" @success="execute" />


    <StartOrStopJob ref="startOrStopJobRef" @success="execute"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getGroupListAll, type JobGroupVO } from "@/api/xxljob/jobgroup"
import { useTable, columns } from './use-table'
import Form from './form.vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import StartOrStopJob from "./components/StartOrStopJob.vue";


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
  onDelete,
} = useTable(queryForm)
const expanded = ref(false)

defineOptions({ name: 'JobInfo' })

const allGroupList = ref<JobGroupVO[]>([])

onMounted(() => {
  getGroupListAll().then((res: JobGroupVO[]) => {
    allGroupList.value = res
  })
})

/* 启动或停止 */
const startOrStopJobRef =  ref<InstanceType<typeof StartOrStopJob> | null>(null) // 启动或停止
</script>
