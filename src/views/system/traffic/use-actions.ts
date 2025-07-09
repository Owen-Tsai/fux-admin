import { message } from 'ant-design-vue'
import { deleteIpTraffic, type IpTrafficVO } from '@/api/system/traffic'

const useActions = (execute: () => void) => {
  const onDelete = (record: IpTrafficVO) => {
    deleteIpTraffic(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
