<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增' : '编辑'"
    :footer="false"
    :confirm-loading="loading"
    width="950px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :label-width="100" :data="formData" :rules="rules" style="width: 98%">
        <t-row :gutter="16">
          <t-divider align="left">基础配置</t-divider>
          <t-col :span="6">
            <TFormItem label="执行器" name="jobGroup">
              <t-select v-model="formData.jobGroup" placeholder="请选择执行器" clearable>
                <t-option
                  v-for="item in allGroupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.title"
                ></t-option>
              </t-select>
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="任务描述" name="jobDesc">
              <TInput v-model:value="formData.jobDesc" placeholder="请输入任务描述" />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="负责人" name="author">
              <TInput v-model:value="formData.author" placeholder="请输入作者" />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="报警邮件" name="alarmEmail">
              <TInput v-model:value="formData.alarmEmail" placeholder="请输入报警邮件" />
            </TFormItem>
          </t-col>

          <t-divider align="left">调度配置</t-divider>
          <t-col :span="6">
            <TFormItem label="调度类型" name="scheduleType">
              <TSelect
                v-model="formData.scheduleType"
                :options="sheduleTypeOptions"
                placeholder="请选择调度类型"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem
              label="cron表达式"
              name="scheduleConf"
              v-if="formData.scheduleType != 'NONE'"
            >
              <TInput
                v-model:value="formData.scheduleConf"
                placeholder="请输入cron执行表达式"
                inputClass="input-padding-no-right"
                style="padding-right: 0"
              >
                <template #suffix>
                  <t-button variant="outline" @click="cronDialogRef?.open(formData.scheduleConf)">
                    <template #icon><TIcon name="edit-2" /></template>
                  </t-button>
                </template>
              </TInput>
            </TFormItem>
          </t-col>

          <t-divider align="left">任务配置</t-divider>
          <t-col :span="6">
            <TFormItem label="运行模式" name="glueType">
              <TSelect
                v-model="formData.glueType"
                :options="glueTypeOptions"
                placeholder="请选择调度配置，值含义取决于调度类型"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="JobHandler" name="executorHandler">
              <TInput
                v-model:value="formData.executorHandler"
                placeholder="请输入执行器任务handler"
              />
            </TFormItem>
          </t-col>
          <t-col :span="12">
            <TFormItem label="任务参数" name="executorParam">
              <TTextarea
                v-model:value="formData.executorParam"
                placeholder="请输入执行器任务参数"
              />
            </TFormItem>
          </t-col>

          <t-divider align="left">高级配置</t-divider>
          <t-col :span="6">
            <TFormItem label="路由策略" name="executorRouteStrategy">
              <TSelect
                v-model="formData.executorRouteStrategy"
                :options="routeStrategyOptions"
                placeholder="请选择路由策略"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="子任务ID" name="childJobid">
              <TInput
                v-model:value="formData.childJobid"
                placeholder="请输入子任务的ID,如果存在多个则逗号分隔"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="调度过期策略" name="misfireStrategy">
              <TSelect
                v-model="formData.misfireStrategy"
                :options="misfireStrategyOptions"
                placeholder="请选择路由策略"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="阻塞处理策略" name="executorBlockStrategy">
              <TSelect
                v-model="formData.executorBlockStrategy"
                :options="blockStrategyOptions"
                placeholder="请选择路由策略"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="任务超时时间" name="executorTimeout">
              <TInput
                v-model:value="formData.executorTimeout"
                placeholder="请输入超时时间，单位秒，大于零时生效"
              />
            </TFormItem>
          </t-col>
          <t-col :span="6">
            <TFormItem label="失败重试次数" name="executorFailRetryCount">
              <TInput
                v-model:value="formData.executorFailRetryCount"
                placeholder="请输入失败重试次数"
              />
            </TFormItem>
          </t-col>
          <!-- <TFormItem label="调度状态" name="triggerStatus">-->
          <!--  <TRadioGroup v-model:value="formData.triggerStatus" :options="" />-->
          <!--</TFormItem>-->
          <t-col :span="12">
            <t-space
              size="small"
              style="display: flex; justify-content: space-between; margin-top: 30px"
            >
              <t-button
                theme="default"
                variant="base"
                @click="
                  () => {
                    visible = false
                  }
                "
                >取 消</t-button
              >
              <t-button v-if="mode == 'create'" theme="primary" @click="submit">新 增</t-button>
              <t-button v-else theme="primary" @click="submit">更 新</t-button>
            </t-space>
          </t-col>
        </t-row>
      </TForm>
    </TLoading>
  </TDialog>

  <CronDialog ref="cronDialogRef" />
</template>

<script lang="ts" setup>
import {
  addJobInfo,
  getJobInfoDetail,
  type JobInfoVO,
  updateJobInfo,
} from '@/api/xxljob/jobinfo/index.ts'
import { getGroupListAll, type JobGroupVO } from '@/api/xxljob/jobgroup'
import { type FormInstanceFunctions, type FormProps, type SelectProps } from 'tdesign-vue-next'
import useDict from '@/hooks/use-dict'
import { ref } from 'vue'
import CronDialog from "@/views/xxljob/jobinfo/components/CronDialog.vue";

const rules: FormProps['rules'] = {
  jobGroup: [{ required: true, message: '请选择执行器' }],
  author: [{ required: true, message: '请输入负责人' }],
  jobDesc: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  scheduleType: [{ required: true, message: '请选择调度类型', trigger: 'change' }],
  scheduleConf: [{ required: true, message: '请输入Cron表达式' }],
  glueType: [{ required: true, message: '请选择运行模式', trigger: 'blur' }],
  executorHandler: [{ required: true, message: '请输入执行器BEAN名称' }],
  misfireStrategy: [{ required: true, message: '请选择失败策略', trigger: 'blur' }],
  alarmEmail: [
    { email: { ignore_max_length: true }, message: '报警邮件格式不正确', type: 'error' },
  ],
  executorTimeout: [
    { required: true, message: '任务执行超时时间，单位秒不能为空', trigger: 'blur' },
  ],
  executorFailRetryCount: [{ required: true, message: '失败重试次数不能为空', trigger: 'blur' }],
  triggerStatus: [{ required: true, message: '调度状态不能为空', trigger: 'blur' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const cronDialogRef = ref<InstanceType<typeof CronDialog> | null>(null) // CRON表达式

const loading = ref(false)

const formData = ref<JobInfoVO>({})
const allGroupList = ref<JobGroupVO[]>([])

const [] = useDict()

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addJobInfo(formData.value)
      } else {
        await updateJobInfo(formData.value)
      }

      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  formData.value = await getJobInfoDetail(id)
  loading.value = false
}

const open = (id?: number, isCopy?: boolean) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  } else {
    mode.value = 'create'
    formData.value.glueType = 'BEAN'
    formData.value.scheduleType = 'CRON'
    formData.value.executorRouteStrategy = 'RANDOM'
    formData.value.misfireStrategy = 'DO_NOTHING'
    formData.value.executorBlockStrategy = 'SERIAL_EXECUTION'
    formData.value.executorTimeout = 0
    formData.value.executorFailRetryCount = 0
  }

  if (isCopy) {
    delete formData.value.addTime
    delete formData.value.glueUpdatetime
    delete formData.value.glueSource
    delete formData.value.glueRemark
    delete formData.value.id
    mode.value = 'create'
  }

  getGroupListAll().then((res: JobGroupVO[]) => {
    allGroupList.value = res
  })

  visible.value = true
}

defineExpose({ open })

const sheduleTypeOptions: SelectProps['options'] = [
  { label: '无', value: 'NONE' },
  { label: 'CRON', value: 'CRON' },
  // { value: 'FIX_RATE', label: '固定速度' },
]

const routeStrategyOptions = [
  { value: 'FIRST', label: '第一个' },
  { value: 'ROUND', label: '轮询' },
  { value: 'RANDOM', label: '随机' },
  { value: 'CONSISTENT_HASH', label: '一致性HASH' },
  { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
  { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
  { value: 'FAILOVER', label: '故障转移' },
  { value: 'BUSYOVER', label: '忙碌转移' },
  { value: 'SHARDING_BROADCAST', label: '分片广播' },
]

const misfireStrategyOptions = [
  { value: 'DO_NOTHING', label: '忽略' },
  { value: 'FIRE_ONCE_NOW', label: '立即执行一次' },
]
const blockStrategyOptions = [
  { value: 'SERIAL_EXECUTION', label: '单机串行' },
  { value: 'DISCARD_LATER', label: '丢弃后续调度' },
  { value: 'COVER_EARLY', label: '覆盖之前调度' },
]
const glueTypeOptions = [{ value: 'BEAN', label: 'BEAN' }]
</script>
<style scoped lang="scss">
.input-padding-no-right {
  padding-right: 0 !important;
}
:deep(.input-padding-no-right) {
  padding-right: 0 !important;
}
</style>
