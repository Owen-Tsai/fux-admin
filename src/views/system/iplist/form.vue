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
        <AFormItem label="列表类型" name="listType">
          <ARadioGroup v-model:value="formData.listType" :options="SYSTEM_IP_LIST" />
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
import { createIpList, updateIpList, getDetail, type IpListVO } from '@/api/system/iplist'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import logger from '@/utils/logger'

const rules: FormProps['rules'] = {}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = ref<IpListVO>({})

const [INFRA_BOOLEAN_STRING, SYSTEM_IP_LIST] = useDict('infra_boolean_string', 'system_ip_list')

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()

    if (mode.value === 'create') {
      await createIpList(formData.value)
    } else {
      await updateIpList(formData.value)
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
  formData.value.id = undefined

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
