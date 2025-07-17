<template>
  <div class="view flex flex-col">
    <div class="flex flex-1 gap-4">
      <div class="min-w-0 w-1/4">
        <TCard>
          <div class="flex-center">
            <div class="relative">
              <TAvatar :image="data?.avatar" size="80px" />
              <div class="absolute -bottom-1 -right-1 z-2">
                <TTooltip content="更换头像" placement="right">
                  <FileUpload
                    v-model:value="src"
                    accept="image/*"
                    theme="custom"
                    auto-upload
                    :request-fn="uploadAvatar"
                    @success="onAvatarUploaded()"
                  >
                    <TButton shape="circle">
                      <template #icon>
                        <TIcon name="camera" />
                      </template>
                    </TButton>
                  </FileUpload>
                </TTooltip>
              </div>
            </div>
          </div>
          <TSkeleton :loading="pending" class="!mt-2">
            <div class="text-lg text-center">{{ data?.nickname }}</div>
            <div class="flex items-center justify-center gap-1 mt-2 flex-wrap">
              <TTag
                v-for="role in data?.roles"
                :key="role.id"
                theme="primary"
                variant="light-outline"
                >{{ role.name }}</TTag
              >
            </div>
            <div class="mt-4">
              <div class="info">
                <TIcon name="institution" />
                <div>部门：{{ data?.dept?.name || '暂无部门' }}</div>
              </div>
              <div class="info">
                <TIcon name="mobile" />
                <div>手机：{{ data?.mobile || '暂未绑定手机号码' }}</div>
              </div>
              <div class="info">
                <TIcon name="institution" />
                <div>邮箱：{{ data?.email || '暂未绑定邮箱地址' }}</div>
              </div>
            </div>
          </TSkeleton>
          <TDivider />
          <div class="font-bold">其他信息</div>
          <TSkeleton :loading="pending" class="!mt-4">
            <div>
              <div class="info">账号：{{ data?.username }}</div>
              <div class="info">
                上次登录时间：{{ dayjs(data?.loginDate).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div class="info">上次登录地点：{{ data?.loginIp }}</div>
              <div class="info">
                注册时间：{{ dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
          </TSkeleton>
        </TCard>
      </div>
      <div class="min-w-0 w-3/4">
        <TCard class="min-h-full">
          <TTabs v-model:value="tab">
            <TTabPanel label="基本信息" :value="0">
              <Profile :profile="data" class="!mt-6" />
            </TTabPanel>
            <TTabPanel label="修改密码" :value="1">
              <Password class="!mt-6" />
            </TTabPanel>
          </TTabs>
        </TCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Profile from './profile.vue'
import Password from './password.vue'
import { getProfile, updateProfile, updateAvatar } from '@/api/system/user/profile'
import useUserStore from '@/stores/user'
import type { UploadFile } from 'tdesign-vue-next'

const { user } = storeToRefs(useUserStore())
const src = ref('')

const tab = ref(0)

const { data, pending, execute } = useRequest(getProfile, { immediate: true })

const onAvatarUploaded = async () => {
  await updateProfile({
    ...data.value,
    avatar: src.value,
  })

  execute()
}

const uploadAvatar = (file: UploadFile) => {
  return updateAvatar(file.raw!)
}
</script>

<style lang="scss" scoped>
.info {
  @apply flex items-center gap-1 mb-1 text-secondary;
}
</style>
