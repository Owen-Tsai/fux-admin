<template>
    <TDrawer
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="'居住证核发详情'"
      size="40%"
      placement="right"
      :destroy-on-close="false"
    >
    <TLoading :loading="loading">
      <div class="detail-container">
        <div class="detail-item">
          <span class="detail-label">姓名：</span>
          <span class="detail-value">{{ detailData.name || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">身份证号码：</span>
          <span class="detail-value">{{ detailData.idcard || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">户籍地：</span>
          <span class="detail-value">{{ detailData.registeredAddress || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">现居住地：</span>
          <span class="detail-value">{{ detailData.currentAddress || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">核发时间：</span>
          <span class="detail-value">{{ formatDate(detailData.issueTime) }}</span>
        </div>
        <!-- <div class="detail-item even">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ formatDate(detailData.createTime) }}</span>
        </div> -->
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
import { ref, computed, watchEffect } from 'vue'
import dayjs from 'dayjs'
import { getResideCardDetail, type ResideCardVO } from '@/api/application/reside/index'

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
const detailData = ref<ResideCardVO>({})

// 监听ID变化，加载详情数据
const loadData = async () => {
  if (!props.id) return

  loading.value = true
  try {
    const res = await getResideCardDetail(props.id)
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

// 格式化日期
const formatDate = (date: Date | undefined) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '-'
}

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
