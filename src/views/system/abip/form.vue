<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增' : '编辑'"
    :confirm-loading="loading"
    @ok="submit"
  >
    <ASpin :spinning="loading">
      <AForm
        ref="formRef"
        :label-col="{ style: { width: '80px' } }"
        :model="formData"
        :rules="rules"
        class="mt-4"
      >
        <AFormItem label="访问详情" name="abnormalDetail">
          <AInput v-model:value="formData.abnormalDetail" placeholder="请输入访问详情" />
        </AFormItem>
        <AFormItem label="添加时间" name="createTime">
          <ADatePicker
            v-model:value="formData.createTime"
            value-format="x"
            placeholder="请选择添加时间"
          />
        </AFormItem>
        <!-- <AFormItem label="更新时间" name="updateTime">
          <ADatePicker v-model:value="formData.updateTime" value-format="x" placeholder="请选择更新时间" />
        </AFormItem> -->
        <!-- <AFormItem label="更新人id" name="updater">
          <AInput v-model:value="formData.updater" placeholder="请输入更新人id" />
        </AFormItem>
         <AFormItem label="更新人姓名" name="updatedName">
          <AInput v-model:value="formData.updatedName" placeholder="请输入更新人姓名" />
        </AFormItem> -->
        <AFormItem label="异常 IP 地址" name="ipAddress">
          <AInput v-model:value="formData.ipAddress" placeholder="请输入异常 IP 地址" />
        </AFormItem>
        <AFormItem label="异常类型" name="abnormalType">
          <ARadioGroup v-model:value="formData.abnormalType" :options="SYSTEM_ABNORMAL" />
        </AFormItem>
        <AFormItem label="访问时间" name="accessTime">
          <ADatePicker
            v-model:value="formData.accessTime"
            value-format="x"
            placeholder="请选择访问时间"
          />
        </AFormItem>
        <AFormItem label="访问的资源" name="accessResource">
          <AInput v-model:value="formData.accessResource" placeholder="请输入访问的资源" />
        </AFormItem>
        <AFormItem label="处理状态" name="handlingStatus">
          <ARadioGroup v-model:value="formData.handlingStatus" :options="SYSTEM_PROCESSING" />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import {
  createIpManagement,
  updateIpManagement,
  getDetail,
  type IpManagementVO,
} from '@/api/system/abip'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'

const rules: FormProps['rules'] = {}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = ref<IpManagementVO>({})

const [SYSTEM_ABNORMAL, SYSTEM_PROCESSING] = useDict('SYSTEM_ABNORMAL', 'SYSTEM_PROCESSING')

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    formData.value.id = undefined
    if (mode.value === 'create') {
      await createIpManagement(formData.value)
    } else {
      await updateIpManagement(formData.value)
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

const open = (id?: number) => {
  formRef.value?.resetFields()

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
