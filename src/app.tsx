import useUserStore from '@/stores/user'
import { Watermark, ConfigProvider } from 'tdesign-vue-next'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import { RouterView } from 'vue-router'
import dayjs from 'dayjs'

export default defineComponent({
  setup() {
    const watermarkEnabled = import.meta.env.VITE_APP_WATERMARK === 'true'
    const { user } = storeToRefs(useUserStore())
    const time = dayjs().format('YYYY.MM.DD HH:mm:ss')

    const watermarkText = computed(() => [
      { text: user.value?.nickname },
      { text: time }
    ])

    const appMain = computed(() =>
      watermarkEnabled ? (
        <Watermark watermark-content={watermarkText.value} height={80} width={160} x={80} y={100} class="h-full">
          <RouterView />
        </Watermark>
      ) : (
        <RouterView />
      )
    )

    return () => (
      <ConfigProvider global-config={zhConfig}>
        {appMain.value}
      </ConfigProvider>
    )
  }
})
