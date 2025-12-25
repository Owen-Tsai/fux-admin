
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
        <TFormItem label="上级单位" name="parentId">
          <TTreeSelect
            v-show="formData.parentId !== 0 || mode === 'create'"
            v-model:value="formData.parentId"
            filterable
            :keys="{ label: 'name', value: 'id' }"
            :data="treeData"
          />
        </TFormItem>
         <TFormItem label="单位名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入单位名称" />
        </TFormItem>
         <TFormItem label="单位编码" name="code">
          <TInput v-model:value="formData.code" placeholder="请输入单位编码" />
        </TFormItem>
         <TFormItem label="单位简称" name="shortName">
          <TInput v-model:value="formData.shortName" placeholder="请输入单位简称" />
        </TFormItem>
         <TFormItem label="地址" name="address">
          <TInput v-model:value="formData.address" placeholder="请输入地址" />
        </TFormItem>

        <TRow>
          <TCol :span="12" :lg="6">
            <TFormItem label="显示顺序" name="sort">
              <TInputNumber v-model:value="formData.sort" theme="column" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="状态" name="status">
              <TRadioGroup v-model:value="formData.status">
                <TRadioButton v-for="opt in commonStatus" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </TRadioButton>
              </TRadioGroup>
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addUnit, updateUnit, getUnitDetail, type UnitVO } from '@/api/system/unit'
  import { type FormInstanceFunctions,type TreeSelectProps, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const [commonStatus] = useDict('common_status')

  const rules: FormProps['rules'] = {
        name: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '单位编码不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }],
  }
  const { treeData } = defineProps<{
    treeData?: TreeSelectProps['treeData']
  }>()
  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<UnitVO>({})

  const [
  ] = useDict(
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addUnit(formData.value)
        } else {
          await updateUnit(formData.value)
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
    const res = await getUnitDetail(id)
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
      formData.value = {
        parentId: undefined,
        name: '',
        sort: 0,
        status: 0,
      }
      mode.value = 'create'
    }

    visible.value = true
  }

  defineExpose({ open })
</script>