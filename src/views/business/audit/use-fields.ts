import type { AppSchema } from '@fusionx/core/types'
import type { TaskNodeConfigMap } from '@fusionx/core/types/flow'
import FuxRenderer from '@fusionx/core/form-renderer/index.vue'

const useFields = (
  appSchema: Ref<AppSchema | undefined>,
  fuxRenderer: Ref<InstanceType<typeof FuxRenderer> | null>,
) => {
  const { query } = useRoute()
  const taskUID = query.taskKey as string

  const getFields = (): Record<string, any> => {
    if (!fuxRenderer.value) return {}
    const currTask = appSchema.value?.flow.nodes.find((node) => node.uid === taskUID)
    if (!currTask) return {}

    const fields = (currTask as TaskNodeConfigMap['audit']).props.fieldsInteractivity || []
    const editableFields = fields
      .filter((item) => item.config === 'writable')
      .map((item) => item.name!)
    const formData = fuxRenderer.value?.getFormData()

    return editableFields.reduce(
      (prev, curr) => {
        prev[curr] = formData?.[curr]
        return prev
      },
      {} as Record<string, any>,
    )
  }

  return {
    getFields,
  }
}

export default useFields
