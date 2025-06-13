<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增部门' : '编辑部门'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :label-col="{ style: { width: '80px' } }"
      :rules="rules"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <AFormItem
          v-show="formData.parentId !== 0 || mode === 'create'"
          label="上级部门"
          name="parentId"
        >
          <ATreeSelect
            v-model:value="formData.parentId"
            show-search
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :field-names="{ label: 'name', value: 'id' }"
            tree-default-expand-all
            :tree-data="treeData"
          />
        </AFormItem>
        <AFormItem label="部门名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入菜单名称" />
        </AFormItem>
        <AFormItem label="负责人" name="leaderUserId">
          <ASelect
            v-model:value="formData.leaderUserId"
            :options="userData"
            :field-names="{ label: 'nickname', value: 'id' }"
            placeholder="请输入用户名称进行过滤"
            show-search
            :filter-option="(input, option) => filterOption(input, option, 'nickname')"
          />
        </AFormItem>
        <AFormItem label="联系电话" name="phone">
          <AInput v-model:value="formData.phone" placeholder="请输入联系电话" />
        </AFormItem>
        <AFormItem label="邮箱" name="email">
          <AInput v-model:value="formData.email" placeholder="请输入邮箱" />
        </AFormItem>

        <ASpin :spinning="regionLoading">
          <AFormItem label="所在地区" name="region">
            <ACascader
              v-model:value="formData.region"
              placeholder="请选择省市区"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
              :load-data="loadRegionData"
              :options="regionOptions"
              change-on-select
            />
          </AFormItem>
        </ASpin>

        <AFormItem label="详细地址" name="address">
          <AInput v-model:value="formData.address" placeholder="请输入详细地址" />
        </AFormItem>

        <ARow>
          <ACol :span="12">
            <AFormItem label="显示顺序" name="sort">
              <AInputNumber v-model:value="formData.sort" class="w-full" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="状态" name="status">
              <ASelect v-model:value="formData.status" :options="commonStatus" />
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import {
  getDeptDetail,
  createDept,
  updateDept,
  type DeptVO,
  getTopRegions,
  getChildrenRegions,
  getRegionPath,
} from '@/api/system/dept'
import { filterOption } from '@fusionx/utils'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'
import type { SimpleUserListVO } from '@/api/system/user'

const loading = ref(false)
const regionLoading = ref(false)

const [commonStatus] = useDict('common_status')

const rules = ref<FormProps['rules']>({
  name: [{ required: true, message: '请输入部门名称' }],
  // 可根据需要添加地区验证规则
})

const { treeData, userData } = defineProps<{
  treeData?: TreeSelectProps['treeData']
  userData?: SimpleUserListVO
}>()

const visible = ref(false)
const mode = ref<'create' | 'update'>('create')
const emit = defineEmits(['success', 'update:open'])
const formRef = ref<FormInstance>()

const formData = ref<DeptVO>({
  region: [], // 存储选中的地区编码数组
})

// 新增地区相关状态
const regionOptions = ref<any[]>([]) // 级联选择器选项
const loadedRegions = new Map<string, any[]>() // 记录已加载过的地区ID及其子项（避免重复加载）

// 加载省级数据
const loadTopRegions = async () => {
  regionLoading.value = true
  try {
    const res = await getTopRegions()
    regionOptions.value = res.map((region) => ({
      ...region,
      isLeaf: false, // 标记为非叶子节点（有下级）
    }))
  } catch (e) {
    message.error('加载省级地区数据失败，请重试')
  } finally {
    regionLoading.value = false
  }
}

// 动态加载子级地区
const loadRegionData = async (selectedOptions: any[]) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  targetOption.loading = true

  try {
    // 检查是否已加载过
    if (loadedRegions.has(targetOption.id)) {
      const children = loadedRegions.get(targetOption.id)
      if (children && children.length > 0) {
        targetOption.children = children
      } else {
        targetOption.isLeaf = true
      }
      targetOption.loading = false
      return
    }

    const res = await getChildrenRegions(targetOption.id)
    if (res.length === 0) {
      targetOption.isLeaf = true // 无子节点时标记为叶子节点
      loadedRegions.set(targetOption.id, [])
    } else {
      const children = res.map((region) => ({
        ...region,
        isLeaf: false, // 默认标记为非叶子节点
      }))
      targetOption.children = children
      loadedRegions.set(targetOption.id, children)
    }

    regionOptions.value = [...regionOptions.value] // 触发响应式更新
  } catch (e) {
    message.error('加载地区数据失败，请重试')
  } finally {
    targetOption.loading = false
  }
}

// 加载地区路径并处理回显数据
const loadRegionPathData = async (deptId: number) => {
  regionLoading.value = true
  try {
    const res = await getRegionPath(deptId)
    if (res && res.length > 0) {
      // 提取地区ID数组用于回显
      const regionIds = res.map((item) => item.id)
      formData.value.region = regionIds

      // 预加载回显所需的数据结构
      await loadRegionDataForPath(res)
    }
  } catch (e) {
    console.error('加载地区路径数据失败', e)
    message.error('加载地区路径数据失败')
  } finally {
    regionLoading.value = false
  }
}

// 为回显路径预加载数据
const loadRegionDataForPath = async (regionPath: any[]) => {
  if (!regionPath || regionPath.length === 0) return

  // 确保省级数据已加载
  if (regionOptions.value.length === 0) {
    await loadTopRegions()
  }

  // 逐级加载子节点
  for (let i = 0; i < regionPath.length - 1; i++) {
    const currentRegion = regionPath[i]

    // 查找当前节点
    const targetOption = findOptionById(regionOptions.value, currentRegion.id)

    if (targetOption) {
      // 如果存在但还没有加载子节点
      if (!targetOption.children) {
        const childrenRegions = await getChildrenRegions(currentRegion.id)
        const children = childrenRegions.map((region) => ({
          ...region,
          isLeaf: false,
        }))

        targetOption.children = children
        loadedRegions.set(currentRegion.id, children)
      }
    }
  }

  // 强制更新选项列表
  regionOptions.value = [...regionOptions.value]
}

// 递归查找选项
const findOptionById = (options: any[], id: string): any => {
  for (const option of options) {
    if (option.id === id) {
      return option
    }
    if (option.children) {
      const found = findOptionById(option.children, id)
      if (found) return found
    }
  }
  return null
}

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    if (mode.value === 'update') {
      await updateDept(formData.value)
    } else {
      await createDept(formData.value)
    }
    message.success('保存成功')
    visible.value = false
    emit('success')
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
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
    await loadRegionPathData(id)
  } catch (e) {
    console.error('加载部门详情失败', e)
    message.error('加载部门详情失败')
  } finally {
    loading.value = false
  }
}

const open = async (id?: number) => {
  formRef.value?.resetFields()
  mode.value = 'create'

  // 重置地区数据
  regionOptions.value = []
  loadedRegions.clear()

  // 每次打开弹窗时加载省级数据
  await loadTopRegions()

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
    }
  }

  visible.value = true
}

defineExpose({ open })
</script>
