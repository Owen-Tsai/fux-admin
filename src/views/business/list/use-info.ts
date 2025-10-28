import { getApplicationDetail } from '@/api/app/app'
import useTabsStore from '@/stores/tabs'

const useInfo = () => {
  const route = useRoute()
  const appId = route.params.appId as string
  const taskKey = route.query.taskDefKey as string

  const { setTabTitle } = useTabsStore()

  const { data, pending } = useRequest(() => getApplicationDetail(appId), {
    immediate: true,
    onSuccess: (res) => {
      setTabTitle(res.name + (taskKey === 'All' ? '信息库' : '待审核'))
    },
  })

  return {
    app: data,
    loadingAppInfo: pending,
  }
}

export default useInfo
