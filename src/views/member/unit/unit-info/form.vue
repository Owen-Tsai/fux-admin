<template>
  <AModal
    v-model:open="visible"
    :title="isViewMode ? '查看单位信息' : mode === 'create' ? '新增' : '编辑'"
    :confirm-loading="loading"
    :footer="isViewMode ? null : undefined"
    @ok="submit"
    width="800px"
    class="company-modal"
  >
    <ASpin :spinning="loading">
      <div class="company-info-card">
        <div class="card-header">
          <h2 class="card-title">{{ formData.name || '企业信息' }}</h2>
          <div class="card-subtitle">{{ '统一社会信用代码 : ' + formData.creditrate || '无' }}</div>
        </div>

        <div class="card-body">
          <div class="info-section">
            <h3 class="section-title">基本信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="item-label">用户名:</span>
                <span class="item-value">{{ formData.username || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">email:</span>
                <span class="item-value">{{ formData.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">注册时间:</span>
                <span class="item-value">{{ formatDate(formData.regdate) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">单位编码:</span>
                <span class="item-value">{{ formData.code || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">单位性质:</span>
                <span class="item-value">{{
                  getDictLabel(UNIT_TYPE, formData.unitType) || '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">单位规模:</span>
                <span class="item-value">{{
                  getDictLabel(SCALE_SIZE, formData.unitSize) || '-'
                }}</span>
              </div>
              <!-- <div class="info-item">
                <span class="item-label">注册资金:</span>
                <span class="item-value">{{ formData.regfund || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">行业类别:</span>
                <span class="item-value">{{ formData.tradeinfoid || '-' }}</span>
              </div> -->
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">联系信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="item-label">单位地址:</span>
                <span class="item-value">{{ formData.address || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">联系人:</span>
                <span class="item-value">{{ formData.contact || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">手机号:</span>
                <span class="item-value">{{ formData.mobile || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">电话:</span>
                <span class="item-value">{{ formData.telphone || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">传真:</span>
                <span class="item-value">{{ formData.fax || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">email:</span>
                <span class="item-value">{{ formData.email || '-' }}</span>
              </div>
              <!-- <div class="info-item">
                <span class="item-label">主页:</span>
                <span class="item-value">{{ formData.homepage || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">单位网站:</span>
                <span class="item-value">{{ formData.website || '-' }}</span>
              </div> -->
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">会员信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="item-label">会员开始时间:</span>
                <span class="item-value">{{ formatDate(formData.memstartdate) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">会员结束时间:</span>
                <span class="item-value">{{ formatDate(formData.memenddate) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">是否市场会员:</span>
                <span class="item-value">{{
                  formData.ismarket ? '是' : formData.ismarket === false ? '否' : '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">市场会员开始时间:</span>
                <span class="item-value">{{ formatDate(formData.marstartdate) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">市场会员结束时间:</span>
                <span class="item-value">{{ formatDate(formData.marenddate) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">是否接收邮件:</span>
                <span class="item-value">{{
                  getDictLabel(YES_NO, formData.isreceiveemail) || '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">是否可用:</span>
                <span class="item-value">{{ getDictLabel(YES_NO, formData.isenable) || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">是否VIP:</span>
                <span class="item-value">{{
                  formData.isvip ? '是' : formData.isvip === false ? '否' : '-'
                }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">更多信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="item-label">法定代表人:</span>
                <span class="item-value">{{ formData.legalrepresent || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">银行:</span>
                <span class="item-value">{{ formData.bank || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">银行账号:</span>
                <span class="item-value">{{ formData.account || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">税务登记号:</span>
                <span class="item-value">{{ formData.taxNumber || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">隶属关系:</span>
                <span class="item-value">{{
                  getDictLabel(COMPANY_RELATION, formData.belongTo) || '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">机构类型:</span>
                <span class="item-value">{{
                  getDictLabel(ORG_TYPE, formData.institutionType) || '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">技术领域:</span>
                <span class="item-value">{{
                  getDictLabel(TEC_FIELD, formData.technicalField) || '-'
                }}</span>
              </div>
              <div class="info-item">
                <span class="item-label">控股情况:</span>
                <span class="item-value">{{
                  getDictLabel(COM_HOLDINGS, formData.holdingSituation) || '-'
                }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">单位介绍</h3>
            <div class="info-textarea">
              {{ formData.introduce || '暂无介绍' }}
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">备注</h3>
            <div class="info-textarea">
              {{ formData.remark || '无' }}
            </div>
          </div>
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import {
  createUnitInfo,
  updateUnitInfo,
  getDetail,
  type UnitInfoVO,
} from '@/api/member/unit/unit-info'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'
import dayjs from 'dayjs'

const rules: FormProps['rules'] = {}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const isViewMode = ref(false)
const formData = ref<UnitInfoVO>({})

const [
  UNIT_TYPE,
  SCALE_SIZE,
  YES_NO,
  COMPANY_RELATION,
  ORG_TYPE,
  TEC_FIELD,
  COM_HOLDINGS,
  NON_PUBLIC_COM_TYPE,
] = useDict(
  'unit_type',
  'scale_size',
  'yes_no',
  'company_relation',
  'org_type',
  'tec_field',
  'com_holdings',
  'non_public_com_type',
)

// 格式化日期
const formatDate = (timestamp: number | string | undefined) => {
  if (!timestamp) return ''
  return dayjs(Number(timestamp)).format('YYYY-MM-DD')
}

// 获取字典标签
const getDictLabel = (dict: any[], value: any) => {
  if (!value) return ''
  const item = dict.find((item) => item.value === value)
  return item ? item.label : ''
}

const submit = async () => {
  loading.value = true
  try {
    if (mode.value === 'create') {
      await createUnitInfo(formData.value)
    } else {
      await updateUnitInfo(formData.value)
    }

    message.success('保存成功')
    emit('success')
    visible.value = false
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getDetail(id)
  formData.value = res
  loading.value = false
}

const open = (options?: { id?: number; isViewMode?: boolean }) => {
  const { id, isViewMode: viewMode = false } = options || {}
  isViewMode.value = viewMode

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

<style scoped>
.company-modal {
  --ant-modal-content-bg: #f0f7ff;
}

.company-info-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e6f7ff;
}

.card-header {
  padding: 16px 24px;
  background-color: #e6f7ff;
  border-bottom: 1px solid #bae7ff;
}

.card-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0050b3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card-subtitle {
  margin-top: 4px;
  font-size: 14px;
  color: #0050b3;
}

.card-body {
  padding: 24px;
  background-color: #fff;
}

.info-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e8e8e8;
}

.info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  margin: 0 0 16px;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #0050b3;
  border-bottom: 1px solid #e6f7ff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.info-item:hover {
  background-color: #f0f7ff;
}

.item-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.item-value {
  font-size: 14px;
  color: #1f2329;
  word-break: break-word;
}

.info-textarea {
  padding: 12px;
  background-color: #f0f7ff;
  border-radius: 4px;
  font-size: 14px;
  color: #1f2329;
  min-height: 80px;
  word-break: break-word;
  border: 1px solid #e6f7ff;
}
</style>
