<template>
  <TDialog v-model:visible="visible" header="API" width="660px">
    <div class="flex gap-6 items-start pr-1">
      <div class="w-1/4 min-w-0 max-h-400px">
        <Scrollbar>
          <div
            v-for="(api, uid) in apiConfig"
            :key="uid"
            class="text-center relative py-1 px-2 border border-[var(--td-border-level-2-color)] border-solid rounded-lg mb-2 cursor-pointer hover:text-[var(--td-text-color-primary)] truncate"
            :class="{
              'border-[var(--td-brand-color)] !text-[var(--td-brand-color)] !bg-[unset]':
                actived === uid,
            }"
            @click="actived = uid"
          >
            {{ api.name || '未命名' }}
          </div>
          <TButton theme="default" block @click="createApi">
            <template #icon>
              <Icon name="plus" />
            </template>
            创建 API
          </TButton>
        </Scrollbar>
      </div>
      <div class="w-3/4 min-w-0">
        <template v-if="actived">
          <TForm :data="apiConfig[actived]" label-align="left" label-width="80px" :rules="rules">
            <TFormItem label="API名称" name="name">
              <TInput v-model="apiConfig[actived].name" />
            </TFormItem>
            <TFormItem label="数据索引" name="dataIndex">
              <TInput v-model="apiConfig[actived].dataIndex" />
            </TFormItem>
            <TFormItem label="请求方法" name="method">
              <TRadioGroup v-model="apiConfig[actived].method" :options="methodOptions" />
            </TFormItem>
            <TFormItem label="请求地址" name="url">
              <TInput v-model="apiConfig[actived].url" />
            </TFormItem>
            <TFormItem label="请求参数" name="params">
              <CodeEditor v-model="apiConfig[actived].params" :height="160" />
            </TFormItem>
          </TForm>
        </template>
        <TEmpty
          v-else
          :title="Object.keys(apiConfig).length <= 0 ? '请先创建一个API' : '请选择一个API'"
        />
      </div>
    </div>

    <template #footer>
      <TSpace>
        <TButton
          v-show="actived !== undefined"
          :disabled="!actived"
          theme="danger"
          variant="text"
          @click="deleteApi(actived!)"
        >
          删除此 API
        </TButton>
        <TButton @click="save">保存</TButton>
      </TSpace>
    </template>
  </TDialog>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { generateId } from '@fusionx/core/utils'
import type { FormRules } from 'tdesign-vue-next'

const message = useMessage()

const { appSchema } = useDesignerCtxInject()!
const apiConfig = ref(appSchema.value.form.api || {})

const actived = ref<string>()

const visible = ref(false)

const rules: FormRules = {
  name: [{ required: true, message: '请输入API名称', trigger: 'blur' }],
  dataIndex: [{ required: true, message: '请输入数据索引' }],
  method: [
    { required: true, message: '请选择请求方法' },
    {
      enum: ['get'],
      type: 'warning',
      message: '建议：FusionX 规范推荐使用 GET 请求',
      trigger: 'change',
    },
  ],
  url: [{ required: true, message: '请输入请求地址' }],
}

const open = () => {
  visible.value = true
}

const save = () => {
  appSchema.value.form.api = apiConfig.value
  message.success('保存成功')
  visible.value = false
}

const createApi = () => {
  const uid = generateId()
  apiConfig.value[uid] = {
    method: 'get',
    dataIndex: uid,
    url: '/example/url',
    name: '新API',
  }
  actived.value = uid
}

const deleteApi = (uid: string) => {
  actived.value = undefined
  delete apiConfig.value[uid]
}

const methodOptions = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DELETE', value: 'delete' },
]

defineExpose({ open })
</script>
