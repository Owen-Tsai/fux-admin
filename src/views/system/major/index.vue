<template>
  <div class="view h-full">
    <div class="h-full grid grid-cols-3 gap-4">
      <TCard class="tree-card h-full">
        <template #content>
          <div class="flex-1 flex flex-col">
            <div class="flex-none flex items-center gap-2">
              <TInput
                v-model:value="filterText"
                placeholder="输入专业名称过滤"
                clearable
                class="flex-1"
              >
                <template #suffixIcon>
                  <TIcon name="search" />
                </template>
              </TInput>
              <TTooltip content="新增顶级条目">
                <TButton shape="square" class="flex-none" @click="onAppend">
                  <template #icon>
                    <Icon name="add" />
                  </template>
                </TButton>
              </TTooltip>
            </div>

            <TLoading ref="treeWrapperEl" :loading="majorLoading" class="flex-1 mt-4 min-h-0">
              <TTree
                ref="treeRef"
                v-model:actived="activeNodes"
                :keys="{ label: 'name', value: 'id' }"
                :data="majorTree"
                :filter="filter"
                activable
                :height="height"
                :scroll="{ type: 'lazy' }"
                @active="(value, context) => formRef?.onActive(value, context)"
              >
                <template #operations="{ node }">
                  <div class="flex items-center gap-1 pl-2">
                    <TTooltip content="新增下一级">
                      <TButton
                        shape="square"
                        theme="primary"
                        variant="text"
                        size="small"
                        @click="formRef?.onAdd(node)"
                      >
                        <template #icon>
                          <Icon name="add" />
                        </template>
                      </TButton>
                    </TTooltip>
                    <TPopconfirm
                      content="确定要删除该专业吗？该操作无法撤销"
                      theme="danger"
                      @confirm="onDelete(node.data.id)"
                    >
                      <TTooltip content="删除">
                        <TButton shape="square" theme="danger" variant="text" size="small">
                          <template #icon>
                            <Icon name="close" />
                          </template>
                        </TButton>
                      </TTooltip>
                    </TPopconfirm>
                  </div>
                </template>
              </TTree>
            </TLoading>
          </div>
        </template>
      </TCard>
      <Form ref="formRef" v-model:activeNodes="activeNodes" @success="execute" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteMajor, addMajor, type MajorVO } from '@/api/system/major'
import useMajorTree from './use-tree'
import Form from './form.vue'
import type { TreeInstanceFunctions } from 'tdesign-vue-next'

const { filterText, majorTree, majorLoading, filter, activeNodes, execute } = useMajorTree()

const treeWrapperEl = useTemplateRef('treeWrapperEl')
const formRef = useTemplateRef('formRef')
const treeRef = useTemplateRef<TreeInstanceFunctions>('treeRef')

const { height } = useElementSize(treeWrapperEl)

const onDelete = async (id: string) => {
  majorLoading.value = true
  await deleteMajor(id)
  activeNodes.value = []
  execute()
}

const onAppend = async () => {
  const newMajorData: MajorVO = {
    name: '新专业',
    pid: '-1',
  }
  majorLoading.value = true
  await addMajor(newMajorData)
  execute()
}

defineOptions({ name: 'SystemMajor' })
</script>

<style lang="scss" scoped>
.tree-card {
  @apply flex flex-col;
  :deep(.t-card__header) {
    @apply flex-none;
  }
  :deep(.t-card__body) {
    @apply flex-1 h-full flex flex-col;
  }
}
</style>
