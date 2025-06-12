import { message } from 'ant-design-vue'
import { deleteIpList, type IpListVO } from '@/api/system/iplist'

const useActions = (execute: () => void) => {
  const onDelete = (record: IpListVO) => {
    deleteIpList(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
