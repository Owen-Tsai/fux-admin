<template>
  <Scrollbar wrapper-class="!h-full" class="h-full">
    <TTree
      ref="treeRef"
      v-model:actived="actived"
      :data="tree"
      line
      expand-all
      activable
      :label="getLabel"
      class="schema-view"
    />
  </Scrollbar>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { findWidgetByUid } from '@fusionx/core/utils'
import type { TreeProps, TreeInstanceFunctions } from 'tdesign-vue-next'
import type { Widget } from '@fusionx/core/types'

const { appSchema, selectedWidget } = useDesignerCtxInject()!

type Tree = {
  label: string
  name?: string
  value: string
  children?: Tree[]
  disabled?: boolean
}

const treeRef = useTemplateRef<TreeInstanceFunctions>('treeRef')

const actived = computed<string[]>({
  get: () => (selectedWidget.value?.uid ? [selectedWidget.value.uid] : []),
  set: (val) => {
    console.log('val is', val)
    const widget = findWidgetByUid(appSchema.value.form.widgets, val[0])
    selectedWidget.value = widget || undefined
  },
})

const schemaToTree = (widgets: Widget[]) => {
  if (!widgets) return []

  const tree: Tree[] = []

  const visit = (ws: Widget[], node: Tree[]) => {
    ws?.forEach((w) => {
      const treeNode: Tree = {
        label: w.props.field?.label || w.name,
        name: w.props.field?.name,
        value: w.uid,
      }

      if (w.class === 'layout') {
        treeNode.children = []
        if (w.type === 'steps' || w.type === 'tabs') {
          if (w.props.children) {
            w.props.children.forEach((child, i) => {
              treeNode.children?.push({
                label: child.title || '',
                value: `${w.uid}-${i}`,
                children: [],
              })
              visit(child.widgets!, treeNode.children![i].children!)
            })
          }
        }
      }

      node.push(treeNode)
    })
  }

  visit(widgets, tree)

  return [
    {
      label: '组件树',
      name: '',
      children: tree,
      value: 'root',
    },
  ]
}

const tree = computed(() => schemaToTree(appSchema.value.form.widgets))

const getLabel: TreeProps['label'] = (h, node) => {
  return h('span', { class: 'tree-node' }, [
    node.data.label as string,
    h('span', { class: 'tree-node-caption' }, [node.data.name]),
  ])
}
</script>

<style lang="scss" scoped>
.schema-view {
  :deep(.tree-node) {
    .tree-node-caption {
      color: var(--td-text-color-placeholder);
      margin-left: 4px;
      font-style: italic;
    }
  }
}
</style>
