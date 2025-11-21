export default defineStore('business', () => {
  // 当前办理的申报计划
  const currentPlanId = ref('')

  return {
    currentPlanId,
  }
})
