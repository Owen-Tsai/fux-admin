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
        <AFormItem label="是否删除" name="deleted">
          <ARadioGroup v-model:value="formData.deleted" :options="INFRA_BOOLEAN_STRING" />
        </AFormItem>
        <AFormItem label="IP地址" name="ipAddress">
          <AInput v-model:value="formData.ipAddress" placeholder="请输入IP地址" />
        </AFormItem>
        <AFormItem label="入站流量" name="inboundTraffic">
          <AInput v-model:value="formData.inboundTraffic" placeholder="请输入入站流量" />
        </AFormItem>
        <AFormItem label="出站流量" name="outboundTraffic">
          <AInput v-model:value="formData.outboundTraffic" placeholder="请输入出站流量" />
        </AFormItem>
        <AFormItem label="流量统计时间" name="trafficTime">
          <ADatePicker
            v-model:value="formData.trafficTime"
            value-format="x"
            placeholder="请选择流量统计时间"
          />
        </AFormItem>
        <AFormItem label="访问频率" name="accessFrequency">
          <AInputNumber v-model:value="formData.accessFrequency" />
        </AFormItem>
        <AFormItem label="流量速率，单位为Mbps" name="trafficRate">
          <AInput v-model:value="formData.trafficRate" placeholder="请输入流量速率，单位为Mbps" />
        </AFormItem>
        <AFormItem label="创建时间" name="createTime">
          <ADatePicker
            v-model:value="formData.createTime"
            value-format="x"
            placeholder="请选择创建时间"
          />
        </AFormItem>
      </AForm>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { createIpTraffic, updateIpTraffic, getDetail, type IpTrafficVO } from '@/api/system/traffic'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'

const rules: FormProps['rules'] = {}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = ref<IpTrafficVO>({})

const [INFRA_BOOLEAN_STRING] = useDict('infra_boolean_string')

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    formData.value.id = undefined
    if (mode.value === 'create') {
      await createIpTraffic(formData.value)
    } else {
      await updateIpTraffic(formData.value)
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
