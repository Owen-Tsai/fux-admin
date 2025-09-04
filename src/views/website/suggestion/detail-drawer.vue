<template>
  <ADrawer v-model:open="visible" title="投诉建议详情" width="40%" @close="onClose">
    <ASpin :spinning="loading">
      <div class="view-form mt-4">
        <div class="form-section">
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell">类型</td>
                <td class="value-cell">
                  {{ getDictLabel(COMPLAINT_SUGGESTION_TYPE, formData.type) || '-' }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">姓名</td>
                <td class="value-cell">{{ formData.name || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">手机</td>
                <td class="value-cell">{{ formData.mobile || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">状态</td>
                <td class="value-cell">
                  {{ getDictLabel(COMPLAINT_SUGGESTION_STATUS, formData.status) || '-' }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">内容</td>
                <td class="value-cell" colspan="3">{{ formData.content || '-' }}</td>
              </tr>
              <tr v-if="formData.status !== 1">
                <td class="label-cell">回复内容</td>
                <td class="value-cell" colspan="3">{{ formData.replyContent || '-' }}</td>
              </tr>
              <tr v-if="formData.status !== 1">
                <td class="label-cell">回复时间</td>
                <td class="value-cell" colspan="3">{{ formatDate(formData.replyTime) || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 回复区域 -->
        <div v-if="formData.status === 1" class="reply-section">
          <AForm layout="vertical">
            <AFormItem label="回复内容">
              <AInput
                v-model:value="replyContent"
                type="textarea"
                :rows="4"
                placeholder="请输入回复内容"
              />
            </AFormItem>
            <AFormItem>
              <AButton type="primary" @click="handleReply">回复</AButton>
            </AFormItem>
          </AForm>
        </div>
      </div>
    </ASpin>
    <!-- <template #extra>
      <AButton @click="visible = false">关闭</AButton>
    </template> -->
  </ADrawer>
</template>

<script lang="ts" setup>
import { getDetail, replySuggestion, type SuggestionVO } from '@/api/website/suggestion'
import { type FormInstance } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'
import dayjs from 'dayjs'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance() as any

const visible = ref(false)

const loading = ref(false)

const formData = ref<SuggestionVO>({})

const replyContent = ref('')

const [COMPLAINT_SUGGESTION_TYPE, COMPLAINT_SUGGESTION_STATUS, YES_NO] = useDict(
  'complaint_suggestion_type',
  'complaint_suggestion_status',
  'yes_no',
)

// 获取字典标签
const getDictLabel = (dict: any[], value: any) => {
  if (!value) return ''
  const item = dict.find((item) => item.value === value)
  return item ? item.label : ''
}

// 格式化日期
const formatDate = (timestamp: number | string | undefined) => {
  if (!timestamp) return ''
  return dayjs(Number(timestamp)).format('YYYY-MM-DD')
}

const loadData = async (id: number) => {
  loading.value = true
  try {
    const res = await getDetail(id)
    formData.value = res
  } catch (e) {
    logger.error(import.meta.url, '加载数据失败。', e)
  } finally {
    loading.value = false
  }
}

const open = (id?: number) => {
  if (id) {
    loadData(id)
  }
  visible.value = true
}

const onClose = () => {
  formData.value = {}
}

// 处理回复
const emit = defineEmits(['success'])

const handleReply = async () => {
  if (!replyContent.value) {
    proxy.$message.warning('请输入回复内容')
    return
  }

  try {
    console.log(formData.value.id as string)
    await replySuggestion(formData.value.id as string, replyContent.value)
    proxy.$message.success('回复成功')
    visible.value = false
    // 通知父组件重新加载数据
    emit('success')
  } catch (e) {
    logger.error(import.meta.url, '回复失败。', e)
  }
}

defineExpose({ open })
</script>

<style scoped>
.view-form {
  padding: 16px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.talent-table {
  width: 100%;
  border-collapse: collapse;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  border-top: 1px dashed #b5b5b5;
}

.talent-table tr {
  border-bottom: 1px solid #e8e8e8;
}

.talent-table tr:last-child {
  border-bottom: none;
}

.talent-table td {
  padding: 12px 16px;
  vertical-align: top;
}

.label-cell {
  width: 20%;
  background-color: #f5f5f5; /* 浅灰色背景 */
  font-weight: 700;
  color: #6b6b6b;
  text-align: left;
  padding-right: 16px;
}

.value-cell {
  width: 30%;
  padding-left: 16px;
  word-break: break-word;
}

.reply-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}
</style>
