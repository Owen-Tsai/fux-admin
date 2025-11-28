<template>
    <TDrawer
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="'青年创新创业人才详情'"
      size="40%"
      placement="right"
      :destroy-on-close="false"
    >
    <TLoading :loading="loading">
      <div class="detail-container">
        <div class="detail-item">
          <span class="detail-label">身份证号：</span>
          <span class="detail-value">{{ detailData.idcard || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">姓名：</span>
          <span class="detail-value">{{ detailData.name || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">出生年月：</span>
          <span class="detail-value">{{ detailData.birthday ? dayjs(detailData.birthday).format('YYYY-MM-DD') : '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">学历：</span>
          <span class="detail-value">{{ getDictLabel(USER_EDUCATION, detailData.diploma) || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">职称：</span>
          <span class="detail-value">{{ getDictLabel(PERSONAL_TITLE_LEVEL, detailData.professionalTitle) || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">工作单位：</span>
          <span class="detail-value">{{ detailData.workUnit || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">技术领域：</span>
          <span class="detail-value">{{ getDictLabel(TEC_FIELD, detailData.techField) || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">人才称号：</span>
          <span class="detail-value">{{ getDictLabel(YOUTH_CREATE_TITLE, detailData.talentTitle) || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">支持资金：</span>
          <span class="detail-value">{{ detailData.supportFund || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">入选年度：</span>
          <span class="detail-value">{{ detailData.selectionYear || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">所在县区：</span>
          <span class="detail-value">{{ getDictLabel(APPLY_INAREA, detailData.county) || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">本人联系方式：</span>
          <span class="detail-value">{{ detailData.contact || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">项目验收结果：</span>
          <span class="detail-value">{{ detailData.projectResult || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ detailData.createTime ? dayjs(detailData.createTime).format('YYYY-MM-DD') : '-' }}</span>
        </div>
      </div>
    </TLoading>

    <template #footer>
      <div class="flex justify-end gap-2">
        <TButton @click="handleClose">关闭</TButton>
      </div>
    </template>
  </TDrawer>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import type { YouthCreateVO } from '@/api/application/youth'
import { getYouthCreateDetail } from '@/api/application/youth'

// 获取字典数据
const [
  USER_EDUCATION,
  PERSONAL_TITLE_LEVEL,
  TEC_FIELD,
  YOUTH_CREATE_TITLE,
  APPLY_INAREA
] = useDict(
  'user_education',
  'personal_title_level',
  'tec_field',
  'youth_create_title',
  'apply_inarea'
)

// 定义props
const props = defineProps<{
  visible: boolean
  id?: string
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// 数据状态
const loading = ref(false)
const detailData = ref<YouthCreateVO>({})

// 根据字典值获取标签文本
const getDictLabel = (dict: any[], value?: string) => {
  if (!dict || !value) return ''
  const item = dict.find(item => item.value === value)
  return item ? item.label : ''
}

// 监听ID变化，加载详情数据
const loadData = async () => {
  if (!props.id) return

  loading.value = true
  try {
    const res = await getYouthCreateDetail(props.id)
    detailData.value = res
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听ID变化和可见状态变化，使用watchEffect
watchEffect(() => {
  if (props.id && props.visible) {
    loadData()
  }
})

// 关闭抽屉
const handleClose = () => {
  emit('update:visible', false)
}

// 暴露方法供父组件调用
defineExpose({
  loadData,
  handleClose
})
</script>

<style scoped>
.detail-container {
  width: 100%;
  padding: 0;
}

.detail-item {
  display: flex;
  padding: 16px 20px;
  transition: background-color 0.2s;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.detail-item:last-child {
  border-bottom: none;
}

/* 隔行变色效果 */
.detail-item.even {
  background-color: #f9fafb;
}

/* 鼠标悬停效果 */
.detail-item:hover {
  background-color: #f0f9ff;
}

.detail-label {
  flex-shrink: 0;
  width: 180px;
  font-weight: 500;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.detail-value {
  flex: 1;
  color: #333;
  font-size: 14px;
  padding-right: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-label {
    width: 120px;
    font-size: 13px;
  }

  .detail-value {
    font-size: 13px;
    padding-right: 10px;
  }

  .detail-item {
    padding: 12px 15px;
  }
}
</style>