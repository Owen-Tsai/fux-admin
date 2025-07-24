import { message } from 'ant-design-vue'
import { deleteTalentInfo, type TalentInfoVO } from '@/api/member/talent/talent-info'

const useActions = (execute: () => void) => {
  const onDelete = (record: TalentInfoVO) => {
    deleteTalentInfo(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
