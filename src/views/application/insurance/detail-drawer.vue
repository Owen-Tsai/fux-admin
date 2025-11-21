<template>
    <TDrawer
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="'医疗保险详情'"
      size="40%"
      placement="right"
      :destroy-on-close="false"
    >
    <TLoading :loading="loading">
      <div class="detail-container">
        <div class="detail-item">
          <span class="detail-label">参保人证件号：</span>
          <span class="detail-value">{{ detailData.idcard || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">参保人姓名：</span>
          <span class="detail-value">{{ detailData.name || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">缴费单位名称：</span>
          <span class="detail-value">{{ detailData.companyName || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">统一社会信用代码：</span>
          <span class="detail-value">{{ detailData.orgNum || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">缴费额度：</span>
          <span class="detail-value">{{ detailData.paymentAmount || '-' }}</span>
        </div>
        <div class="detail-item even">
          <span class="detail-label">缴费基数：</span>
          <span class="detail-value">{{ detailData.paymentBase || '-' }}</span>
        </div>
        <!-- <div class="detail-item">
          <span class="detail-label">人员参保状态：</span>
          <span class="detail-value">{{ getStatusText(detailData.status) }}</span>
        </div> -->
        <div class="detail-item even">
          <span class="detail-label">开始时间：</span>
          <span class="detail-value">{{ formatDate(detailData.startDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">备注：</span>
          <span class="detail-value">{{ detailData.remark || '-' }}</span>
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
import { getMedicalInsuranceDetail, type MedicalInsuranceVO } from '@/api/application/insurance'

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
const detailData = ref<MedicalInsuranceVO>({})

// /**
//  * 获取参保状态文本
//  * @param status 状态码
//  * @returns 状态文本
//  */
// const getStatusText = (status?: number): string => {
//   switch (status) {
//     case 0:
//       return '未参保'
//     case 1:
//       return '已参保'
//     case 2:
//       return '暂停参保'
//     case 3:
//       return '终止参保'
//     default:
//       return '-'
//   }
// }

/**
 * 格式化日期
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
const formatDate = (date?: Date): string => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 加载详情数据
 */
const loadData = async () => {
  if (!props.id) return

  loading.value = true
  try {
    const res = await getMedicalInsuranceDetail(props.id)
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

/**
 * 关闭抽屉
 */
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
