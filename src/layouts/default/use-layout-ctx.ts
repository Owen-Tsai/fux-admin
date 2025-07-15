const useLayout = () => {
  const CTX_KEY = Symbol('layout')

  const routerAlive = ref(true)

  const reload = () => {
    routerAlive.value = false

    nextTick(() => (routerAlive.value = true))
  }

  const useProvider = () => {
    provide(CTX_KEY, reload)
  }

  const useInjection = () => {}
}

export default useLayout
