
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
         <TFormItem label="个人账户" name="personalAccount">
          <TInput v-model:value="formData.personalAccount" placeholder="请输入个人账户" />
        </TFormItem>
         <TFormItem label="单位账户" name="unitAccount">
          <TInput v-model:value="formData.unitAccount" placeholder="请输入单位账户" />
        </TFormItem>
         <span>请选择字典类型以生成选择框</span>
         <TFormItem label="缴款月份起" name="payStartMonth">
          <TInput v-model:value="formData.payStartMonth" placeholder="请输入缴款月份起" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addFundInfo, updateFundInfo, getFundInfoDetail, type FundInfoVO } from '@/api/application/imported/fund'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<FundInfoVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addFundInfo(formData.value)
        } else {
          await updateFundInfo(formData.value)
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
    const res = await getFundInfoDetail(id)
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
