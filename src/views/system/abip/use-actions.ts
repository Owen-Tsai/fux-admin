import { message } from 'ant-design-vue'
import { deleteIpManagement, type IpManagementVO } from '@/api/system/abip'

const useActions = (execute: () => void) => {
  const onDelete = (record: IpManagementVO) => {
    deleteIpManagement(record.id!).then(() => {
      message.success('添加成功')
      execute()
    })
  }

  const visible = ref(false)
  const entry = ref<IpManagementVO>()
  const onCheckDetail = (row: IpManagementVO) => {
    entry.value = row
    visible.value = true
  }

  return { onDelete, onCheckDetail }
}

export default useActions
