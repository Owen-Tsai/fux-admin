import { message } from 'ant-design-vue'
import { deleteType, type InformationTypeVO } from '@/api/information/type'

const useActions = (requestData: () => void) => {
  const onDelete = (record: InformationTypeVO) => {
    deleteType(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    onDelete,
  }
}

export default useActions
