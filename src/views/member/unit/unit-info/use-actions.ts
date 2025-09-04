import { message } from 'ant-design-vue'
import { deleteUnitInfo, type UnitInfoVO } from '@/api/member/unit/unit-info'

const useActions = (execute: () => void) => {
  const onDelete = (record: UnitInfoVO) => {
    deleteUnitInfo(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
