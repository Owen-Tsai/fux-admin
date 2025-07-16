<script setup lang="ts">
import { addApplication, updateApplication, getApplicationDetail, type AppVO } from '@/api/app/app'
import { getDeptSimpleList } from '@/api/system/dept'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()
const [typeOpts] = useDict('system_application_type')
const { data: deptOpts, pending } = useRequest(getDeptSimpleList, {
  immediate: true,
})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写应用名称' }],
  type: [{ required: true, message: '请选择应用类型' }],
  userType: [{ required: true, message: '请选择申报主体' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<AppVO>({
  published: 0,
  comopen: 0,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addApplication(formData.value)
      } else {
        await updateApplication(formData.value)
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
  const res = await getApplicationDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
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

const onUserTypeChange = (value: string) => {
  if (value === import.meta.env.VITE_USER_PERSONAL) {
    formData.value.comopen = 0
  } else {
    formData.value.comopen = undefined
  }
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增应用' : '编辑应用'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="应用名称" name="name">
          <TInput v-model:value="formData.name" placeholder="如：人才分类认定" />
        </TFormItem>
        <TFormItem label="应用代码" name="code">
          <TInput v-model:value="formData.code" placeholder="如：talent_classification" />
        </TFormItem>
        <TFormItem label="业务类别" name="type">
          <TSelect v-model:value="formData.type" :options="typeOpts" />
        </TFormItem>
        <TFormItem label="申报主体" name="userType">
          <TSelect
            v-model:value="formData.userType"
            @change="(v) => onUserTypeChange(v as '3' | '4')"
          >
            <TOption value="3" label="个人申报" />
            <TOption value="4" label="单位申报" />
          </TSelect>
        </TFormItem>
        <TFormItem
          v-if="formData.userType === '3'"
          label="自主申报"
          name="comopen"
          help="自主申报关闭时，个人用户需要所属单位为其开通申报权限方可申报"
        >
          <!-- 注意这里实际上是 “单位开通申报权限” 的相反值，即 自主申报开启 = 单位不需开通申报权限 = 0 -->
          <TSelect v-model:value="formData.comopen">
            <TOption :value="0" label="是" />
            <TOption :value="1" label="否" />
          </TSelect>
        </TFormItem>
        <TFormItem label="主管部门" name="dept">
          <TTreeSelect
            v-model:value="formData.dept"
            :options="deptOpts"
            :loading="pending"
            filterable
            clearable
            :keys="{ label: 'name', value: 'id' }"
            :tree-props="{ expandAll: true }"
          />
        </TFormItem>
        <TFormItem label="应用描述" name="description">
          <TTextarea v-model:value="formData.description" />
        </TFormItem>
        <div class="flex items-center">
          <TFormItem label="前台图标" name="iconFe" help="在用户端展示的图标"></TFormItem>
        </div>
      </TForm>
    </TLoading>
  </TDialog>
</template>
