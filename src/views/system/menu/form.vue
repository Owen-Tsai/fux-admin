<script setup lang="ts">
import { createMenu, updateMenu, getMenuDetail, type MenuVO } from '@/api/system/menu'
import { MENU_TYPES } from '@/utils/constant'
import type { FormProps, TreeSelectProps, FormInstanceFunctions } from 'tdesign-vue-next'

const { treeData } = defineProps<{
  treeData: TreeSelectProps['data']
}>()
const emit = defineEmits(['success'])

const [statusOpts] = useDict('common_status')
const message = useMessage()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写菜单名称' }],
  type: [{ required: true, message: '请选择菜单类型' }],
  path: [{ required: true, message: '请填写路由地址' }],
  component: [{ required: true, message: '请填写组件文件路径' }],
}

const visible = ref(false)
const loading = ref(false)

const mode = ref<'create' | 'update'>('create')
const formRef = ref<FormInstanceFunctions>()
const isCustomLayout = ref(false)

const formData = ref<MenuVO>({
  alwaysShow: true,
  type: 1,
  status: 0,
  sort: 1,
  keepAlive: true,
  visible: true,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (formData.value.parentId === undefined) {
        formData.value.parentId = 0
      }

      if (mode.value === 'create') {
        await createMenu(formData.value)
      } else {
        await updateMenu(formData.value)
      }

      emit('success')
      visible.value = false
      message.success('操作成功')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const data = await getMenuDetail(id)
  if (data.parentId === 0) {
    data.parentId = undefined
  }
  formData.value = data
  isCustomLayout.value = !!data.customLayout
  loading.value = false
}

const open = (type: 'create' | 'update', id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  mode.value = type

  if (type === 'create') {
    console.log(id)
    // add sub menu
    formData.value.id = undefined
    if (id !== undefined) {
      formData.value.parentId = id
    }
  }

  if (type === 'update') {
    loadData(id!)
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增菜单' : '编辑菜单'"
    :confirm-loading="loading"
    width="680px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="110">
        <TFormItem label="上级菜单" name="parentId">
          <TTreeSelect
            v-model:value="formData.parentId"
            :data="treeData"
            :keys="{ label: 'name', value: 'id' }"
            clearable
          />
        </TFormItem>
        <TFormItem label="菜单名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入菜单名称" />
        </TFormItem>
        <TFormItem label="菜单类型" name="type">
          <TRadioGroup v-model:value="formData.type" :options="MENU_TYPES" />
        </TFormItem>
        <template v-if="formData.type !== 3">
          <TFormItem label="菜单图标" name="tdIcon">
            <IconSelect v-model:value="formData.tdIcon" placeholder="请选择菜单图标" />
          </TFormItem>
          <TFormItem label="路由地址" name="path">
            <TInput v-model:value="formData.path" placeholder="请输入路由地址" />
          </TFormItem>
          <TFormItem label="布局类型">
            <TRadioGroup v-model:value="isCustomLayout">
              <TRadioButton :value="false">默认布局</TRadioButton>
              <TRadioButton :value="true">非默认布局</TRadioButton>
            </TRadioGroup>

            <template #status-icon>
              <TTooltip
                content="当菜单或目录启用非默认布局时，组件内容将不再渲染到默认布局组件中。另外，当目录启用非默认布局时，其下所有子菜单都将渲染到【组件路径】字段对应的组件中作为子路由。"
                placement="right"
              >
                <TIcon name="help-circle-filled" />
              </TTooltip>
            </template>
          </TFormItem>
        </template>
        <TFormItem v-if="isCustomLayout" label="布局组件路径">
          <TInput
            v-model:value="formData.customLayout"
            placeholder="请输入非默认布局组件的文件路径"
          />
        </TFormItem>
        <template v-if="formData.type === 2">
          <TFormItem label="组件路径">
            <TInput v-model:value="formData.component" placeholder="请输入组件文件路径" />
          </TFormItem>
          <TFormItem label="组件名称">
            <TInput v-model:value="formData.componentName" placeholder="请输入组件名称" />
          </TFormItem>
          <TFormItem label="路由参数">
            <TInput v-model:value="formData.params" placeholder="请输入路由参数" />
          </TFormItem>
        </template>
        <TFormItem v-if="formData.type !== 1" label="权限标识" name="permission">
          <TInput v-model:value="formData.permission" placeholder="请输入权限标识" />
        </TFormItem>
        <TRow>
          <TCol :span="12" :lg="6" v-if="formData.type !== 3">
            <TFormItem label="显示排序" name="sort">
              <TInputNumber v-model:value="formData.sort" theme="column" class="w-full" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="启用状态" name="status">
              <TRadioGroup
                v-model:value="formData.status"
                :options="statusOpts"
                option-type="button"
              />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6" v-if="formData.type === 2">
            <TFormItem label="缓存策略" name="keepAlive" option-type="button">
              <TRadioGroup v-model:value="formData.keepAlive" option-type="button">
                <TRadioButton :value="true">缓存</TRadioButton>
                <TRadioButton :value="false">不缓存</TRadioButton>
              </TRadioGroup>
            </TFormItem>
          </TCol>
          <template v-if="formData.type !== 3">
            <TCol :span="12" :lg="6">
              <TFormItem label="显示状态" name="visible">
                <TRadioGroup v-model:value="formData.visible" option-type="button">
                  <TRadioButton :value="true">显示</TRadioButton>
                  <TRadioButton :value="false">隐藏</TRadioButton>
                </TRadioGroup>
              </TFormItem>
            </TCol>
            <TCol :span="12" :lg="6">
              <TFormItem label="总是显示" name="alwaysShow">
                <TRadioGroup v-model:value="formData.alwaysShow" option-type="button">
                  <TRadioButton :value="true">是</TRadioButton>
                  <TRadioButton :value="false">否</TRadioButton>
                </TRadioGroup>
              </TFormItem>
            </TCol>
          </template>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
