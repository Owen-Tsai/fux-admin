<script setup lang="ts">
import { getPlanDetail, createPlan, updatePlan, type PlanVO } from '@/api/app/plan'
import type { AppVO } from '@/api/app/app'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const { appList } = defineProps<{
  appList: AppVO[]
}>()

const message = useMessage()

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<PlanVO>({})

const rules: FormProps['rules'] = {
  appId: [{ required: true, message: '请选择所属应用' }],
  item: [{ required: true, message: '请输入计划名称' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createPlan(formData.value)
      } else {
        await updatePlan(formData.value)
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

const loadData = async (id: string) => {
  loading.value = true
  const res = await getPlanDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增计划' : '编辑计划'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <TFormItem label="计划名称" name="item">
        <TInput v-model:value="formData.item" placeholder="如：2025年人才分类认定申报计划" />
      </TFormItem>
      <TFormItem label="所属应用" name="appId">
        <TSelect v-model:value="formData.appId" :options="appList" />
      </TFormItem>
      <TFormItem label="常态化申报" name="daily" help="常态化申报始终开启">
        <TSwitch v-model:value="formData.daily" />
      </TFormItem>
      <TFormItem label="开始时间" name="startTime">
        <TDatePicker
          v-model:value="formData.startTime"
          value-type="YYYY-MM-DD HH:mm:ss"
          enable-time-picker
        />
      </TFormItem>
      <TFormItem label="截止时间" name="endTime">
        <TDatePicker
          v-model:value="formData.endTime"
          value-type="YYYY-MM-DD HH:mm:ss"
          enable-time-picker
        />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
