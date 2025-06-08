export default defineStore('app', () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'theme-mode',
    storageKey: 'fux-theme-mode',
  })

  const toggleDark = useToggle(isDark)

  const htmlTitle = useTitle()

  const setTitle = (val: string) => {
    htmlTitle.value = `${val} | ${import.meta.env.VITE_APP_TITLE_SHORT}`
  }

  return {
    isDark,
    toggleDark,
    htmlTitle,
    setTitle,
  }
})
