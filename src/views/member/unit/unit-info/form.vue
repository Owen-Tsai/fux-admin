<template>
  <AModal
    v-model:open="visible"
    :confirm-loading="loading"
    :footer="isViewMode ? null : undefined"
    @ok="submit"
    width="800px"
    class="company-modal"
  >
    <ASpin :spinning="loading">
      <div class="view-form mt-4">
        <div class="card-header">
          <h2 class="card-title">{{ formData.name || '企业信息' }}</h2>
          <div class="card-subtitle">
            {{ getDictLabel(COMPANY_NATURE, formData.unitnature) || '' }}
          </div>
        </div>

        <!-- 基本信息表格 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell">用户名</td>
                <td class="value-cell">{{ formData.username || '-' }}</td>
                <td class="label-cell">单位编码</td>
                <td class="value-cell">{{ formData.code || '-' }}</td>
              </tr>
              <!-- <tr>
                <td class="label-cell">注册时间</td>
                <td class="value-cell">{{ formatDate(formData.regdate) || '-' }}</td>
              </tr> -->
              <tr>
                <td class="label-cell">统一信用代码</td>
                <td class="value-cell">{{ formData.creditrate || '-' }}</td>
                <td class="label-cell">单位规模</td>
                <td class="value-cell">{{ getDictLabel(SCALE_SIZE, formData.unitSize) || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell" style="vertical-align: top">单位简介</td>
                <td class="value-cell" colspan="3">{{ formData.introduce || '暂无介绍' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 联系信息表格 -->
        <div class="form-section">
          <h3 class="section-title">联系信息</h3>
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell">单位地址</td>
                <td class="value-cell">{{ formData.address || '-' }}</td>
                <td class="label-cell">联系人</td>
                <td class="value-cell">{{ formData.contact || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">手机号</td>
                <td class="value-cell">{{ formData.mobile || '-' }}</td>
                <td class="label-cell">电话</td>
                <td class="value-cell">{{ formData.telphone || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">传真</td>
                <td class="value-cell">{{ formData.fax || '-' }}</td>
                <td class="label-cell">email</td>
                <td class="value-cell">{{ formData.email || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 更多信息表格 -->
        <div class="form-section">
          <h3 class="section-title">更多信息</h3>
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell">法定代表人</td>
                <td class="value-cell">{{ formData.legalrepresent || '-' }}</td>
                <td class="label-cell">银行</td>
                <td class="value-cell">{{ formData.bank || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">银行账号</td>
                <td class="value-cell">{{ formData.account || '-' }}</td>
                <td class="label-cell">税务登记号</td>
                <td class="value-cell">{{ formData.taxNumber || '-' }}</td>
              </tr>
              <tr>
                <td class="label-cell">隶属关系</td>
                <td class="value-cell">
                  {{ getDictLabel(COMPANY_RELATION, formData.belongTo) || '-' }}
                </td>
                <td class="label-cell">机构类型</td>
                <td class="value-cell">
                  {{ getDictLabel(ORG_TYPE, formData.institutionType) || '-' }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">技术领域</td>
                <td class="value-cell">
                  {{ getDictLabel(TEC_FIELD, formData.technicalField) || '-' }}
                </td>
                <td class="label-cell">控股情况</td>
                <td class="value-cell">
                  {{ getDictLabel(COM_HOLDINGS, formData.holdingSituation) || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 备注 -->
        <div class="form-section">
          <h3 class="section-title">备注</h3>
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell" style="vertical-align: top">备注内容</td>
                <td class="value-cell" colspan="3">{{ formData.remark || '无' }}</td>
              </tr>
            </tbody>
          </table>
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
  COMPANY_NATURE,
] = useDict(
  'unit_type',
  'scale_size',
  'yes_no',
  'company_relation',
  'org_type',
  'tec_field',
  'com_holdings',
  'non_public_com_type',
  'company_nature',
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

.view-form {
  padding: 16px;
}

.card-header {
  padding: 16px 24px;
  background-color: #e6f7ff;
  border-bottom: 1px solid #bae7ff;
  margin-bottom: 20px;
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

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.section-title {
  padding: 12px 16px 12px 24px;
  font-size: 18px;
  font-weight: bold;
  color: #1f2329;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #1890ff;
  border-radius: 50%;
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
</style>
