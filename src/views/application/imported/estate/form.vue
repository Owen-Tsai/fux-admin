
<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增' : '编辑'"
    :confirm-loading="loading"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm
        ref="formRef"
        :label-width="100"
        :data="formData"
        :rules="rules"
      >
         <TFormItem label="不动产权证号" name="certNo">
          <TInput v-model:value="formData.certNo" placeholder="请输入不动产权证号" />
        </TFormItem>
         <TFormItem label="不动产单元号" name="unitNo">
          <TInput v-model:value="formData.unitNo" placeholder="请输入不动产单元号" />
        </TFormItem>
         <TFormItem label="权属状态" name="ownershipStatus">
          <TRadioGroup v-model:value="formData.ownershipStatus" />
        </TFormItem>
         <TFormItem label="坐落" name="location">
          <TInput v-model:value="formData.location" placeholder="请输入坐落" />
        </TFormItem>
         <TFormItem label="建筑面积" name="buildingArea">
          <TInput v-model:value="formData.buildingArea" placeholder="请输入建筑面积" />
        </TFormItem>
         <TFormItem label="所在层" name="floor">
          <TInput v-model:value="formData.floor" placeholder="请输入所在层" />
        </TFormItem>
         <TFormItem label="总层数" name="totalFloors">
          <TInput v-model:value="formData.totalFloors" placeholder="请输入总层数" />
        </TFormItem>
         <TFormItem label="竣工时间" name="completionTime">
          <TDatePicker v-model:value="formData.completionTime" value-format="x" placeholder="请选择竣工时间" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addEstateInfo, updateEstateInfo, getEstateInfoDetail, type EstateInfoVO } from '@/api/application/imported/estate'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<EstateInfoVO>({})

  const [
          YES_NO,
  ] = useDict(
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addEstateInfo(formData.value)
        } else {
          await updateEstateInfo(formData.value)
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
    const res = await getEstateInfoDetail(id)
    formData.value = res
    loading.value = false
  }

  const open = (id?: number) => {
    formRef.value?.reset({ type: 'initial' })
    formData.value.id = undefined
    mode.value = 'create'

    if (id) {
      loadData(id)
      mode.value = 'update'
    } else {
      mode.value = 'create'
    }

    visible.value = true
  }

  defineExpose({ open })
</script>
