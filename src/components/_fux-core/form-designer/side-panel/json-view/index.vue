<template>
  <Scrollbar wrapper-class="!h-full relative" class="h-full" content-class="px-2">
    <pre v-html="json"></pre>

    <TTooltip :content="copied ? '已复制' : '复制'" placement="right">
      <TButton
        class="!absolute top-4 right-4"
        theme="primary"
        shape="square"
        variant="outline"
        size="small"
        @click="copy()"
      >
        <TIcon :name="copied ? 'check' : 'file-copy'" />
      </TButton>
    </TTooltip>
  </Scrollbar>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import highlightCode from '@/utils/highlighter'

const { appSchema } = useDesignerCtxInject()!

const { copied, copy } = useClipboard({
  source: JSON.stringify(appSchema.value.form.widgets, null, 2),
})

const json = computedAsync(async () => {
  return await highlightCode(JSON.stringify(appSchema.value.form.widgets, null, 2), 'json')
})
</script>
