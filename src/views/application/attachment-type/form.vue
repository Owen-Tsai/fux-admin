<script setup lang="ts">
import { ref } from 'vue';
import {
  getAttachmentTypeDetail,
  createAttachmentType,
  updateAttachmentType,
  type AttachmentTypeVO,
} from '@/api/app/attachment'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()
const route = useRoute()
const routeAppId = ref<string>(route.query?.appId as string || route.query?.appId as string || '')

const [ attachmentLibTypeOpts ] = useDict('attach_lib_type')

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)
const defaultData: AttachmentTypeVO = {
  required: false,
  isLib: false,
  allowedFileTypes: [],
  appId: routeAppId.value,
}
const formData = ref<AttachmentTypeVO>({ ...defaultData })

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入附件类型名称' }],
  moduleName: [{ required: true, message: '请输入附件类型编码' }],
  allowedFileTypes: [
    { validator: (v: string[]) => v.length > 0, message: '请输入允许上传的文件类型' },
  ],
  isLib: [{ required: true, message: '请选择是否从附件库中选取' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createAttachmentType(formData.value)
      } else {
        await updateAttachmentType(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: string) => {
  loading.value = true
  const res = await getAttachmentTypeDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value = { ...defaultData }
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }
  visible.value = true
}

const onIsLibChange = (v: boolean) => {
  if (!v) {
    formData.value.libType = undefined
  }
}


interface CustomOptionInfo {
  group?: string;
  divider?: boolean;
  label?: string;
  value?: string;
  children?: CustomOptionInfo[];
}

const canSelectTypeSuffix = ref<CustomOptionInfo[]>( [
  {
    group: "图片",
    children: [
      { label: 'jpeg', value: 'jpeg' },
      { label: 'png', value: 'png' },
    ],
  },
  {
    group: '文档',
    children: [
      { label: 'doc', value: 'doc' },
      { label: 'docx', value: 'docx' },
      { label: 'xls', value: 'xls' },
      { label: 'xlsx', value: 'xlsx' },
      { label: 'ppt', value: 'ppt' },
      { label: 'pptx', value: 'pptx' },
      { label: 'txt', value: 'txt' }
    ],
  },
  {
    group: '压缩文件',
    divider: true,
    children: [
      { label: 'zip', value: 'zip' },
      { label: 'rar', value: 'rar' }
    ]
  },
  {
    group: '其他类型',
    divider: true,
    children: [
    ]
  }
])
const editOrCreate = ref('create');
const newOption = ref('');

const onAdd = () => {
  editOrCreate.value = 'edit';
};
const onAddConfirm = () => {
  canSelectTypeSuffix.value.push({ label: newOption.value, value: newOption.value });
  newOption.value = '';
  editOrCreate.value = 'create';
};
const onAddCancel = () => {
  editOrCreate.value = 'create';
};
const createOptions = (val: string) => {
  canSelectTypeSuffix.value.push({
    label: `${val}`,
    value: val,
  });
};
defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增附件类型' : '编辑附件类型'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TForm ref="formRef" :data="formData" :rules="rules" :label-width="140">
      <TFormItem label="附件类型名称" name="name">
        <TInput v-model:value="formData.name" placeholder="如：身份证" />
      </TFormItem>
      <TFormItem label="附件类型编码" name="moduleName">
        <TInput v-model:value="formData.moduleName" placeholder="如：idCard" />
      </TFormItem>
      <TFormItem
        label="允许的文件类型"
        name="allowedFileTypes"
        help="支持手动文件后缀"
      >
        <t-select v-model="formData.allowedFileTypes" :options="canSelectTypeSuffix" placeholder="请选择文件类型" clearable multiple>
          <!--<t-option v-for="item in canSelectTypeSuffix" :key="item.value" :value="item.value" :label="item.label"></t-option>-->
          <!-- 自定义底部内容 -->
          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="editOrCreate === 'create'" theme="primary" variant="text" block @click="onAdd">新增选项</t-button>
              <div v-else>
                <t-input v-model="newOption" autofocus></t-input>
                <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel"> 取消 </t-button>
              </div>
            </div>
          </template>
        </t-select>
      </TFormItem>
      <TFormItem label="文件大小" name="maxFileSize">
        <TInputNumber v-model:value="formData.maxFileSize" :min="0" suffix="MB" />
      </TFormItem>
      <TFormItem label="是否必需" name="required">
        <TSwitch v-model:value="formData.required" />
      </TFormItem>
      <TFormItem label="从附件库选取" name="isLib">
        <TSwitch v-model:value="formData.isLib" @change="(v) => onIsLibChange(v as boolean)" />
      </TFormItem>
      <TFormItem v-if="formData.isLib" label="附件库类型" name="libType">
        <TSelect v-model:value="formData.libType" :options="attachmentLibTypeOpts" />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
