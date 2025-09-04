import { type InformationVO } from '@/api/information/audit'

const useActions = () => {
  const entry = ref<InformationVO | undefined>()
  const visible = ref(false)

  const onAudit = (record?: InformationVO) => {
    entry.value = record
    visible.value = true
  }

  return {
    entry,
    visible,
    onAudit,
  }
}

export default useActions
