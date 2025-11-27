<template>
  <TDialog v-model:visible="visible" header="函数" width="800px">
    <div class="flex gap-6 items-start pr-1">
      <div class="w-1/4 min-w-0 max-h-400px">
        <Scrollbar>
          <div
            v-for="(func, uid) in funcConfig"
            :key="uid"
            class="text-center relative py-1 px-2 border border-[var(--td-border-level-2-color)] border-solid rounded-lg mb-2 cursor-pointer hover:text-[var(--td-text-color-primary)] truncate"
            :class="{
              'border-[var(--td-brand-color)] !text-[var(--td-brand-color)] !bg-[unset]':
                actived === uid,
            }"
            @click="actived = uid"
          >
            {{ func.name }}
          </div>
          <TButton theme="default" block @click="createFunc">
            <template #icon>
              <Icon name="plus" />
            </template>
            创建函数
          </TButton>
        </Scrollbar>
      </div>
      <div class="w-3/4 min-w-0">
        <template v-if="actived">
          <TForm label-align="left" label-width="80px">
            <TFormItem label="函数名称">
              <TInput v-model="funcConfig[actived].name" />
            </TFormItem>
          </TForm>
          <CodeEditor v-model="funcConfig[actived].body" :height="160" />
        </template>
        <TEmpty
          v-else
          :title="Object.keys(funcConfig).length <= 0 ? '请先创建一个函数' : '请选择一个函数'"
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
          @click="deleteFunc(actived!)"
        >
          删除此函数
        </TButton>
        <TButton @click="save">保存</TButton>
      </TSpace>
    </template>
  </TDialog>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { generateId } from '@fusionx/core/utils'

const message = useMessage()

const { appSchema } = useDesignerCtxInject()!
const funcConfig = ref(appSchema.value.form.function || {})

const actived = ref<string>()

const visible = ref(false)

const open = () => {
  visible.value = true
  funcConfig.value = appSchema.value.form.function || {}
}

const save = () => {
  appSchema.value.form.function = funcConfig.value
  message.success('保存成功')
  visible.value = false
}

const createFunc = () => {
  const uid = generateId()
  funcConfig.value[uid] = {
    name: '新函数',
    body: '',
  }
  actived.value = uid
}

const deleteFunc = (uid: string) => {
  actived.value = undefined
  delete funcConfig.value[uid]
}

defineExpose({ open })
</script>
