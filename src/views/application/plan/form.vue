<script setup lang="ts">
import { getPlanDetail, createPlan, updatePlan, type PlanVO } from '@/api/app/plan'
import type { AppVO } from '@/api/app/app'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import { getCanSelectAttachTypeListByAppId } from '@/api/app/attachment.ts'

const route = useRoute()
const routeAppId = ref<string>(
  (route.params?.appId as string) || (route.query?.appId as string) || '',
)

const { appList } = defineProps<{
  appList?: AppVO[]
}>()

const { data: attachmentTypes, pending } = useRequest(
  () => getCanSelectAttachTypeListByAppId(routeAppId.value),
  {
    immediate: true,
    initialData: [],
  },
)

const message = useMessage()

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)
const defaultData: PlanVO = {
  daily: false,
  startTime: undefined,
  endTime: undefined,
  appId: routeAppId.value,
}
const formData = ref<PlanVO>({ ...defaultData })

const rules: FormProps['rules'] = {
  appId: [{ required: true, message: '请选择所属应用' }],
  item: [{ required: true, message: '请输入计划名称' }],
  startTime: [{ required: true, message: '非常态化申报计划需要指定起止时间' }],
  endTime: [{ required: true, message: '非常态化申报计划需要指定起止时间' }],
}

const submit = async () => {
  loading.value = true
  try {
    formData.value.flow = appList?.find((app) => app.id === formData.value.appId)?.processIds

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
  formData.value = {
    ...res,
    attachmentTypeIds: res.attachmentTypeIds || [],
  }
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value = { ...defaultData }
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

const onDailyChange = (val: boolean) => {
  if (val) {
    formData.value.startTime = new Date().getTime().toString()
    formData.value.endTime = new Date('2099-01-01').getTime().toString()
  } else {
    formData.value.startTime = undefined
    formData.value.endTime = undefined
  }
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
        <TSelect
          v-model:value="formData.appId"
          :options="appList"
          :keys="{ label: 'name', value: 'id' }"
          filterable
          :disabled="routeAppId !== ''"
        />
      </TFormItem>
      <TFormItem label="所需附件" name="attachmentTypeIds" help="可在附件管理中设置附件类别">
        <TSelect
          v-model:value="formData.attachmentTypeIds"
          multiple
          :options="attachmentTypes"
          :keys="{ label: 'name', value: 'id' }"
          :loading="pending"
        />
      </TFormItem>
      <TFormItem label="常态化申报" name="daily" help="常态化申报始终开启">
        <TSwitch v-model:value="formData.daily" @change="(v) => onDailyChange(v as boolean)" />
      </TFormItem>
      <template v-if="!formData.daily">
        <TFormItem label="开始时间" name="startTime">
          <TDatePicker
            v-model:value="formData.startTime"
            value-type="time-stamp"
            enable-time-picker
          />
        </TFormItem>
        <TFormItem label="截止时间" name="endTime">
          <TDatePicker
            v-model:value="formData.endTime"
            value-type="time-stamp"
            enable-time-picker
          />
        </TFormItem>
      </template>
    </TForm>
  </TDialog>
</template>
