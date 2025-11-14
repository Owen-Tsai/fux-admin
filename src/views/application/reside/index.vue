
<template>
  <div class="view">
    <!-- filter form -->
    <TCard class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
            <TFormItem  label="姓名" name="name" class="col">
              <TInput v-model:value="query.name" placeholder="请输入姓名" allow-clear />
            </TFormItem>
            <TFormItem  label="身份证号码" name="idcard" class="col">
              <TInput v-model:value="query.idcard" placeholder="请输入身份证号码" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="户籍地" name="registeredAddress" class="col">
              <TInput v-model:value="query.registeredAddress" placeholder="请输入户籍地" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="现居住地" name="currentAddress" class="col">
              <TInput v-model:value="query.currentAddress" placeholder="请输入现居住地" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="核发时间" name="issueTime" class="col">
              <TDateRangePicker
                v-model:value="query.issueTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>
              <!-- <TFormItem  v-show='expanded' label="创建时间" name="createTime" class="col">
              <TDateRangePicker
                v-model:value="query.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem> -->

        <QueryActions v-model:expanded="expanded" class="col" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="居住证核发信息表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
                  v-if="permission.has('applications:reside-card:create')"
                  theme="primary"
                  @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>
          <TButton
            theme="primary"
            variant="outline"
            @click="importDrawerVisible = true"
          >
            <template #icon>
              <Icon name="upload" />
            </template>
            导入
          </TButton>
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <div class="overflow-x-auto">
        <TTable
          :data="data?.list"
          row-key="id"
          :columns="columns"
          :pagination="pagination"
          :loading="pending"
          @page-change="onPageChange"
        >
             <template #issueTime="{ row }">
              {{ dayjs(row.issueTime).format('YYYY-MM-DD') }}
            </template>
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip content="查看详情">
                  <TButton shape="square" theme="default" variant="text" @click="openDetail(row.id!)">
                    <template #icon>
                      <Icon name="zoom-in" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip  content="编辑"
                  v-if='permission.has("applications:reside-card:update")'
                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" v-if="permission.has('applications:reside-card:delete')">
                  <TPopconfirm
                          content="该操作无法撤销，确定要删除吗？"
                          theme="danger"
                          @confirm="onDelete(row.id!)"
                  >
                    <TButton shape="square" theme="danger" variant="text">
                      <template #icon>
                        <Icon name="delete" />
                      </template>
                    </TButton>
                  </TPopconfirm>
                </TTooltip>
              </div>
            </template>
        </TTable>
      </div>
    </TCard>

    <Form ref="formRef" @success="execute" />
    <DetailDrawer
      ref="detailDrawerRef"
      v-model:visible="detailVisible"
      :id="selectedId"
    />

    <!-- 导入抽屉 -->
    <TDrawer
      v-model:visible="importDrawerVisible"
      title="导入居住证核发信息"
      size="large"
      :footer="null"
    >
      <div class="space-y-6">
        <!-- 导入说明 -->
        <TAlert theme="info" title="导入说明">
          <ul class="list-disc pl-6 space-y-2">
            <li>请下载导入模板并填写完整信息</li>
            <li>仅支持模版原文件上传</li>
            <li>导入完成后可下载结果文件查看导入情况</li>
          </ul>
        </TAlert>

        <!-- 下载模板  -->
        <!-- <div>
          <TButton theme="default" @click="downloadTemplate">
            <template #icon>
              <Icon name="download" />
            </template>
            下载导入模板
          </TButton>
        </div> -->

        <!-- 文件上传 -->
        <div>
          <TUpload
            v-model:fileList="uploadFileList"
            :auto-upload="false"
            :accept="['.xls']"
            :multiple="false"
            @change="handleFileChange"
          >
            <TButton theme="default">选择文件</TButton>
          </TUpload>
        </div>

        <!-- 进度显示 -->
        <div v-if="importing">
          <TProgress :value="importProgress" :percentage="true" />
          <p class="text-center mt-2">{{ importMessage }}</p>
        </div>

        <!-- 导入结果 -->
        <div v-if="importResult" class="space-y-4">
          <TAlert theme="success" title="导入完成">
            <div class="space-y-2">
              <p>成功导入: {{ importResult.successCount }} 条</p>
              <p>失败导入: {{ importResult.failCount }} 条</p>
              <div v-if="importResult.resultFileName">
                <TButton
                  theme="primary"
                  variant="link"
                  @click="downloadResultFile"
                >
                  <template #icon>
                    <Icon name="download" />
                  </template>
                  下载导入结果文件
                </TButton>
              </div>
            </div>
          </TAlert>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2">
          <TButton @click="importDrawerVisible = false">关闭</TButton>
          <TButton
            theme="primary"
            @click="handleImport"
            :disabled="!canImport || importing"
          >
            开始导入
          </TButton>
        </div>
      </div>
    </TDrawer>
  </div>
</template>

<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import dayjs from 'dayjs'
    import { useToggle } from '@vueuse/core'
    import useDict from '@/hooks/use-dict'
    import { useTable, columns } from './use-table'
    import Form from './form.vue'
    import DetailDrawer from './detail-drawer.vue'
    import type { FormInstanceFunctions } from 'tdesign-vue-next'
    import request from '@/utils/request'
    import useMessage from '@/hooks/use-message'
    import { TUploadProps } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
  const detailDrawerRef = useTemplateRef<InstanceType<typeof DetailDrawer>>('detailDrawerRef')

  const { permission } = usePermission()
  const message = useMessage()

  const {
    data,
    pending,
    execute,
    query,
    onQueryChange,
    pagination,
    onPageChange,
    onDelete
  } = useTable(queryForm)
  const expanded = ref(false)
  const detailVisible = ref(false)
  const selectedId = ref<string>('')

  // 打开详情抽屉
  const openDetail = (id: string) => {
    selectedId.value = id
    detailVisible.value = true
  }

  // 导入相关状态
  const importDrawerVisible = ref(false)
  const uploadFileList = ref<TUploadProps['fileList']>([])
  const importing = ref(false)
  const importProgress = ref(0)
  const importMessage = ref('')
  const importResult = ref<{
    successCount: number
    failCount: number
    resultFileName?: string
  } | null>(null)

  // 计算属性：是否可以导入
  const canImport = computed(() => uploadFileList.value.length > 0)

  /**
   * 下载导入模板
   */
  const downloadTemplate = async () => {
    try {
      await request.download({
        url: '/applications/reside-card/template',
        filename: '居住证核发导入模板.xls'
      })
    } catch (error) {
      message.error('模板下载失败')
      console.error('下载模板失败:', error)
    }
  }

  /**
   * 处理文件选择变化
   */
  const handleFileChange = (files: TUploadProps['fileList']) => {
    // 重置之前的导入结果
    importResult.value = null
    uploadFileList.value = files
  }

  /**
   * 处理导入操作
   */
  const handleImport = async () => {
    if (!canImport.value) return

    const file = uploadFileList.value[0]?.raw
    if (!file) {
      message.error('请选择有效的文件')
      return
    }

    // 重置导入状态
    importing.value = true
    importProgress.value = 0
    importMessage.value = '开始导入...'
    importResult.value = null

    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', file)

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (importProgress.value < 90) {
          importProgress.value += 10
        }
      }, 500)

      // 调用导入接口
      const response = await request.upload<{
        successCount: number
        failCount: number
        resultFileUrl: string
      }>({
        url: '/applications/reside-card/import',
        data: formData
      })

      // 清除进度模拟
      clearInterval(progressInterval)
      importProgress.value = 100
      importMessage.value = '导入完成'

      // 处理导入结果
      if (response.code === 0) {
        importResult.value = response.data
        message.success('导入成功')
        // 重新加载数据
        execute()
      } else {
        message.error(response.msg || '导入失败')
      }
    } catch (error) {
      console.error('导入失败:', error)
      message.error('导入失败，请重试')
    } finally {
      importing.value = false
    }
  }

  /**
   * 下载导入结果文件
   */
  const downloadResultFile = async () => {
    if (!importResult.value?.resultFileName) return

    try {
      // 调用下载接口，传入fileName参数
      await request.download({
        url: '/applications/reside-card/download-import-result',
        params: {
          fileName: importResult.value.resultFileName
        },
        filename: `居住证核发导入结果_${dayjs().format('YYYYMMDD_HHmmss')}.xls`
      })
    } catch (error) {
      message.error('结果文件下载失败')
      console.error('下载结果文件失败:', error)
    }
  }

  defineOptions({ name: 'ResideCard' })
</script>
