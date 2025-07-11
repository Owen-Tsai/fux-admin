import { message } from 'ant-design-vue'
import { deleteInformation, type InformationVO } from '@/api/information/list'

const useActions = (requestData: () => void) => {
  const entry = ref<InformationVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: InformationVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: InformationVO) => {
    deleteInformation(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
  }
}

export default useActions
