<script setup lang="ts">
import {
  getConfigDetail,
  createConfig,
  updateConfig,
  type FileConfigVO,
} from '@/api/infra/file/config'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const [infraFileStorage] = useDict('infra_file_storage')

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)
const formData = ref<FileConfigVO>({
  config: {},
})

enum STORAGE_TYPE {
  DATABASE = 1,
  DISK = 10,
  FTP = 11,
  SFTP = 12,
  OSS = 20,
}

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写配置名称' }],
  storage: [{ required: true, message: '请选择存储器' }],
  'config.domain': [{ required: true, message: '请填写自定义域名' }],
  'config.basePath': [{ required: true, message: '请输入基础路径' }],
  'config.host': [{ required: true, message: '请输入主机地址' }],
  'config.port': [{ required: true, message: '请输入端口' }],
  'config.username': [{ required: true, message: '请输入用户名' }],
  'config.password': [{ required: true, message: '请输入密码' }],
  'config.mode': [{ required: true, message: '请选择连接模式' }],
  'config.endpoint': [{ required: true, message: '请输入节点地址' }],
  'config.bucket': [{ required: true, message: '请输入存储桶' }],
  'config.accessKey': [{ required: true, message: '请输入 Access Key' }],
  'config.accessSecret': [{ required: true, message: '请输入 Access Secret' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createConfig(formData.value)
      } else {
        await updateConfig(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getConfigDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增文件配置' : '编辑文件配置'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TForm ref="formRef" :data="formData" :rules="rules" :label-width="120">
      <TFormItem label="配置名称" name="name">
        <TInput v-model:value="formData.name" placeholder="如：私有云存储" />
      </TFormItem>
      <TFormItem label="备注" name="remark">
        <TTextarea v-model:value="formData.remark" />
      </TFormItem>
      <TFormItem label="存储器" name="storage">
        <TSelect v-model:value="formData.storage" :options="infraFileStorage" />
      </TFormItem>
      <template
        v-if="
          formData.storage &&
          formData.storage !== STORAGE_TYPE.DATABASE &&
          formData.storage !== STORAGE_TYPE.OSS
        "
      >
        <TFormItem label="基础路径" name="config.basePath">
          <TInput v-model:value="formData.config!.basePath" placeholder="请输入基础路径" />
        </TFormItem>
      </template>
      <template
        v-if="formData.storage === STORAGE_TYPE.FTP || formData.storage === STORAGE_TYPE.SFTP"
      >
        <TFormItem label="主机地址" name="config.host">
          <TInput v-model:value="formData.config!.host" placeholder="请输入主机地址" />
        </TFormItem>
        <TFormItem label="主机端口" name="config.port">
          <TInput
            v-model:value="formData.config!.port"
            type="number"
            placeholder="请输入主机端口"
          />
        </TFormItem>
        <TFormItem label="用户名" name="config.username">
          <TInput v-model:value="formData.config!.username" placeholder="请输入用户名" />
        </TFormItem>
        <TFormItem label="密码" name="config.password">
          <TInput
            v-model:value="formData.config!.password"
            type="password"
            placeholder="请输入密码"
          />
        </TFormItem>
      </template>
      <template v-if="formData.storage === STORAGE_TYPE.FTP">
        <TFormItem label="连接模式" name="config.mode">
          <TRadioGroup v-model:value="formData.config!.mode">
            <TRadio value="Active">主动模式</TRadio>
            <TRadio value="Passive">被动模式</TRadio>
          </TRadioGroup>
        </TFormItem>
      </template>
      <template v-if="formData.storage === STORAGE_TYPE.OSS">
        <TFormItem label="节点地址" name="config.endpoint">
          <TInput v-model:value="formData.config!.endpoint" placeholder="请输入节点地址" />
        </TFormItem>
        <TFormItem label="存储桶" name="config.bucket">
          <TInput v-model:value="formData.config!.bucket" placeholder="请输入存储桶" />
        </TFormItem>
        <TFormItem label="Access Key" name="config.accessKey">
          <TInput v-model:value="formData.config!.accessKey" placeholder="请输入 Access Key" />
        </TFormItem>
        <TFormItem label="Access Secret" name="config.accessSecret">
          <TInput
            v-model:value="formData.config!.accessSecret"
            placeholder="请输入 Access Secret"
          />
        </TFormItem>
      </template>
      <TFormItem
        v-if="formData.storage"
        label="自定义域名"
        :name="formData.storage === STORAGE_TYPE.OSS ? undefined : 'config.domain'"
      >
        <TInput v-model:value="formData.config!.domain" placeholder="请输入自定义域名" />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
