<script setup lang="ts">
import type { FormInstanceFunctions, TreeSelectProps, FormProps,CascaderProps } from 'tdesign-vue-next'
import { getDeptDetail, createDept, updateDept, type DeptVO } from '@/api/system/dept'
import useDict from '@/hooks/use-dict'
import type { SimpleUserListVO } from '@/api/system/user'

const loading = ref(false)
const message = useMessage()

const [commonStatus] = useDict('common_status')

const rules = ref<FormProps['rules']>({
  unitId: [{ required: true, message: '请选择所属单位' }],
  name: [{ required: true, message: '请输入部门名称' }],
  // 可根据需要添加地区验证规则
})

const { treeData, userData,unitData,regionData } = defineProps<{
  treeData?: TreeSelectProps['data']
  userData?: SimpleUserListVO
  unitData?: TreeSelectProps['data']
  regionData?: CascaderProps['options']
}>()

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const visible = ref(false)
const mode = ref<'create' | 'update'>('create')
const emit = defineEmits(['success', 'update:open'])

const formData = ref<DeptVO>({
  id: undefined,
  status: 0,
  sort: 0,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'update') {
        // edit
        await updateDept(formData.value)
      } else {
        // add
        await createDept(formData.value)
      }

      message.success('保存成功')
      visible.value = false
      emit('success')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  try {
    const data = await getDeptDetail(id)

    console.log('res:')
    console.log(data)

    // 确保数据中包含地区信息
    if (!data.region) {
      data.region = []
    }

    formData.value = data

    // 加载并设置地区路径
    // await loadRegionPathData(id)
  } catch (e) {
    console.error('加载部门详情失败', e)
    message.error('加载部门详情失败')
  } finally {
    loading.value = false
  }
}

const open = async (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  mode.value = 'create'
  formData.value.id = undefined

  if (id) {
    await loadData(id)
    mode.value = 'update'
  } else {
    formData.value = {
      parentId: undefined,
      name: '',
      sort: 0,
      status: 0,
      region: [],
      unitId: undefined,
    }
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增部门' : '编辑部门'"
    :confirm-loading="loading"
    width="500px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="88">
        <TFormItem
          v-show="formData.unitId !== 0 || mode === 'create'"
          label="所属单位"
          name="unitId"
        >
          <TTreeSelect
            v-model:value="formData.unitId"
            filterable
            :keys="{ label: 'name', value: 'id' }"
            :data="unitData"
          />
        </TFormItem>
        <TFormItem
          v-show="formData.parentId !== 0 || mode === 'create'"
          label="上级部门"
          name="parentId"
        >
          <TTreeSelect
            v-model:value="formData.parentId"
            filterable
            :keys="{ label: 'name', value: 'id' }"
            :data="treeData"
          />
        </TFormItem>
        <TFormItem label="部门名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入菜单名称" />
        </TFormItem>
        <TFormItem label="负责人" name="leaderUserId">
          <TSelect
            v-model:value="formData.leaderUserId"
            :options="userData"
            :keys="{ label: 'nickname', value: 'id' }"
            placeholder="请输入用户名称进行过滤"
            filterable
          />
        </TFormItem>
        <TFormItem label="所属区域">
          <TCascader
            v-model:value="formData.region"
            :options="regionData"
            value-type="full"
            :keys="{ label: 'name', value: 'code' }"
            placeholder="请选择所属区域"
          />
        </TFormItem>
        <TFormItem label="联系电话" name="phone">
          <TInput v-model:value="formData.phone" placeholder="请输入联系电话" />
        </TFormItem>
        <TFormItem label="邮箱" name="email">
          <TInput v-model:value="formData.email" placeholder="请输入邮箱" />
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
