import useUserStore from '@/stores/user'

const usePermission = () => {
  const permission = {
    has(...keys: string[]) {
      const { permissions } = storeToRefs(useUserStore())

      return keys.every((k) => permissions.value.includes(k))
    },
    hasOne(...keys: string[]) {
      const { permissions } = storeToRefs(useUserStore())

      return keys.filter((k) => permissions.value.includes(k)).length > 0
    },
    hasNone(...keys: string[]) {
      return !this.has(...keys)
    },
  }

  const role = {
    has(...keys: string[]) {
      const { roles } = storeToRefs(useUserStore())

      return keys.every((k) => roles.value.includes(k))
    },
    hasOne(...keys: string[]) {
      const { roles } = storeToRefs(useUserStore())

      return keys.filter((k) => roles.value.includes(k)).length > 0
    },
    hasNone(...keys: string[]) {
      return !this.has(...keys)
    },
  }

  return {
    permission,
    role,
  }
}

export default usePermission
