import { message } from 'ant-design-vue'
import { deleteIpManagement, type IpManagementVO } from '@/api/system/abip'

const useActions = (execute: () => void) => {
  const onDelete = (record: IpManagementVO) => {
    console.log('~~~~~~~~~~~~~   操作对象如下：')
    console.log(record)

    deleteIpManagement(record.id!).then(() => {
      message.success('删除成功')
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
