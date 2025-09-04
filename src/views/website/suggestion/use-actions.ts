import { message } from 'ant-design-vue'
import { deleteSuggestion, type SuggestionVO } from '@/api/website/suggestion'

const useActions = (execute: () => void) => {
  const onDelete = (record: SuggestionVO) => {
    deleteSuggestion(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
