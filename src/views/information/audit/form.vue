<template>
  <TDialog
    v-model:visible="visible"
    header="资讯审核"
    :confirm-loading="loading"
    mode="full-screen"
    lazy
  >
    <TLoading :loading="loading">
      <TDescriptions bordered :label-style="{ width: '140px' }">
        <TDescriptionsItem label="资讯标题" :span="2">
          <div class="flex items-center gap-2">
            {{ info.title }}
            <TTag v-if="info.isInHome" theme="primary" variant="light-outline">首页展示</TTag>
            <TTag v-if="info.isPinned" theme="danger" variant="light-outline">置顶</TTag>
          </div>
        </TDescriptionsItem>
        <TDescriptionsItem label="资讯类别">
          {{ typeTree?.find((item) => item.id === info.infoType)?.name || '—' }}
        </TDescriptionsItem>
        <TDescriptionsItem label="发布时间">
          {{ info.publishTime ? dayjs(info.publishTime).format('YYYY-MM-DD HH:mm:ss') : '—' }}
        </TDescriptionsItem>
        <TDescriptionsItem label="资讯图片">
          <TImage :src="info.image" class="max-h-80" fit="cover" />
        </TDescriptionsItem>
        <TDescriptionsItem label="资讯附件">
          <template v-if="info.attachment?.length">
            <div class="flex flex-wrap gap-2">
              <a v-for="(item, i) in info.attachment" :key="i" :href="item" target="_blank">{{
                item
              }}</a>
            </div>
          </template>
          <span v-else>无附件</span>
        </TDescriptionsItem>
        <TDescriptionsItem label="资讯内容" :span="2">
          <article v-html="info.content" />
        </TDescriptionsItem>
      </TDescriptions>
    </TLoading>

    <template #footer>
      <TSpace>
        <TButton theme="default" :loading="loading" @click="visible = false">取消</TButton>
        <TButton theme="default" :loading="loading" @click="setAuditState(2)">不通过</TButton>
        <TButton theme="primary" :loading="loading" @click="setAuditState(1)">通过</TButton>
      </TSpace>
    </template>
  </TDialog>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { updateInfoAuditState } from '@/api/information/audit'
import type { InformationVO } from '@/api/information'
import type { InfoTypeTreeVO } from '@/api/information/type'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const { typeTree } = defineProps<{
  typeTree?: InfoTypeTreeVO
}>()

const info = ref<InformationVO>({})

const visible = ref(false)
const message = useMessage()

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const setAuditState = async (state: number) => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await updateInfoAuditState({
        id: info.value.id,
        auditState: state,
        review: '审核意见',
      })
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

const open = (record: InformationVO) => {
  info.value = record
  visible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.modal-content-wrapper {
  @apply flex flex-col;
}
.document-wrapper {
  background-color: var(--color-bg-layout);
  height: calc(100% - 72px);
}
</style>
