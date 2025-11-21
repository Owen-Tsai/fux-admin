<script setup lang="ts">
import { getJobDetail, createJob, updateJob, type JobVO } from '@/api/infra/job'
import CronEditor from './cron-editor.vue'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const cronEditorRef = useTemplateRef('cronEditor')

const loading = ref(false)
const formData = ref<JobVO>({})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写任务名称' }],
  handlerName: [{ required: true, message: '请填写处理器名称' }],
  cronExpression: [{ required: true, message: '请填写CRON表达式' }],
  retryCount: [{ required: true, message: '请填写重试次数' }],
  retryInterval: [{ required: true, message: '请填写重试间隔' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createJob(formData.value)
      } else {
        await updateJob(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getJobDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

const onCronPresetSelect = (option: any) => {
  if (option.value === -1) {
    cronEditorRef?.value?.open()
    return
  }
  formData.value.cronExpression = option.value
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增定时任务' : '编辑定时任务'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="120">
        <TFormItem label="配置名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入任务名称" />
        </TFormItem>
        <TFormItem label="处理器名称" name="handlerName">
          <TInput
            v-model:value="formData.handlerName"
            :readonly="mode === 'update'"
            placeholder="请输入处理器名称"
          />
        </TFormItem>
        <TFormItem label="处理器参数" name="handlerParam">
          <TInput v-model:value="formData.handlerParam" placeholder="请输入处理器参数" />
        </TFormItem>
        <TFormItem label="CRON 表达式" name="cronExpression">
          <div class="w-full flex items-center gap-1">
            <TInput
              v-model:value="formData.cronExpression"
              class="flex-1"
              placeholder="请输入CRON表达式，或使用快捷设置"
            />
            <TDropdown min-column-width="140px" @click="onCronPresetSelect">
              <TButton theme="default">快捷设置</TButton>
              <TDropdownMenu>
                <TDropdownItem value="0 * * * * ?">每分钟</TDropdownItem>
                <TDropdownItem value="0 0 * * * ?">每小时</TDropdownItem>
                <TDropdownItem value="0 0 0 * * ?">每天零点</TDropdownItem>
                <TDropdownItem value="0 0 0 1 * ?">每月一号零点</TDropdownItem>
                <TDropdownItem value="0 0 0 L * ?">每月最后一天零点</TDropdownItem>
                <TDropdownItem divider value="0 0 0 ? * 1">每周星期日零点</TDropdownItem>
                <TDropdownItem :value="-1">自定义</TDropdownItem>
              </TDropdownMenu>
            </TDropdown>
          </div>
        </TFormItem>
        <TFormItem label="重试次数" name="retryCount">
          <TInputNumber
            v-model:value="formData.retryCount"
            type="number"
            placeholder="请输入重试次数，为 0 表示不重试"
          />
        </TFormItem>
        <TFormItem label="重试间隔" name="retryInterval">
          <TInputNumber
            v-model:value="formData.retryInterval"
            placeholder="请输入重试间隔(毫秒)，为 0 表示立即重试"
          />
        </TFormItem>
        <TFormItem label="监控超时时间" name="monitorTimeout">
          <TInputNumber
            v-model:value="formData.monitorTimeout"
            placeholder="请输入监控超时时间(毫秒)"
          />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>

  <CronEditor ref="cronEditor" />
</template>
