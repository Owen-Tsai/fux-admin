<template>
  <TDescriptions bordered :column="1" :label-style="{ width: '160px' }">
    <TDescriptionsItem v-for="item in uploadList" :key="item.name" :label="item.name">
      <div>
        <template v-if="item.attachDO && IMAGE_SUFFIXES.includes(item.attachDO.uploadType)">
          <div class="h-160px">
            <TImageViewer
              :images="[`${item.attachDO.uploadPath}${item.attachDO.generatename}`]"
              :z-index="9999"
            />
          </div>
        </template>
        <template v-else-if="item.attachDO && !IMAGE_SUFFIXES.includes(item.attachDO.uploadType)">
          <TLink
            :href="`${item.attachDO.uploadPath}/${item.attachDO.generatename}`"
            target="_blank"
          >
            {{ item.attachDO.uploadname }}
          </TLink>
        </template>
        <template v-else>用户未上传</template>
      </div>
    </TDescriptionsItem>
  </TDescriptions>
</template>

<script setup lang="ts">
import { getUploadList, type UploadList } from '@/api/business/attachment'
import { useRendererCtxInject, useBusinessCtxInject } from '@fusionx/core/hooks'

const IMAGE_SUFFIXES = ['jpg', 'jpeg', 'png', 'gif', 'bmp']

const bizCtx = useBusinessCtxInject()
const rendererCtx = useRendererCtxInject()
const { appId, planId, applyId } = bizCtx || {}

const isProd = computed(
  () => rendererCtx && rendererCtx.mode !== 'dev' && rendererCtx.mode !== 'preview',
)

if (isProd.value && (!appId || !planId || !applyId)) {
  throw new Error('appId, planId, applyId are required')
}

const uploadList = ref<UploadList>([])
const loading = ref(false)

const load = async () => {
  if (!isProd.value) return
  if (!appId || !planId?.value || !applyId) return
  loading.value = true
  uploadList.value = await getUploadList(appId, planId.value, applyId.value)
  loading.value = false
}

load()
</script>
