<template>
  <div class="w-full h-full relative">
    <TLoading class="w-full h-full" :loading="loading">
      <div class="view">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <div class="flex items-center gap-4">
              <TTooltip content="返回列表">
                <TButton variant="outline" theme="default" shape="square">
                  <template #icon>
                    <Icon name="arrow-left" />
                  </template>
                </TButton>
              </TTooltip>
              <div>
                <h2 class="my-0">{{ plan?.item }} 审核</h2>
                <div class="flex items-center text-muted gap-10">
                  <div>所属应用：{{ app?.name }}</div>
                  <div>提交人：{{ starter }}</div>
                  <div>提交时间：{{ submitTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4 pb-4">
          <div class="flex-1">
            <TCard title="申请信息">
              <FormRenderer
                v-if="appSchema"
                ref="fuxRenderer"
                :app-schema="appSchema"
                mode="audit"
                :task-key="$route.query.taskKey as string"
              />
            </TCard>

            <TCard class="!mt-4" title="审核意见">
              <TForm ref="formRef" colon :rules="rules" :data="state" @submit="onSubmit">
                <TRow>
                  <TCol :span="6">
                    <TFormItem label="申请人">{{ starter }}</TFormItem>
                  </TCol>
                  <TCol :span="6">
                    <TFormItem label="提交时间">{{ submitTime }}</TFormItem>
                  </TCol>
                  <TCol :span="6">
                    <TFormItem label="审核结论" name="conclusion">
                      <TRadioGroup v-model:value="state.conclusion" :options="auditOptions" />
                    </TFormItem>
                  </TCol>
                  <TCol :span="6">
                    <TFormItem
                      v-if="state.conclusion === 'RETURN'"
                      label="退回到"
                      name="rtnToTaskKey"
                    >
                      <TSelect
                        v-model:value="state.rtnToTaskKey"
                        :options="taskRtnOpts"
                        :keys="{ label: 'name', value: 'taskDefinitionKey' }"
                      />
                    </TFormItem>
                  </TCol>
                  <TCol :span="12">
                    <TFormItem label="审核意见" name="reason">
                      <TTextarea v-model:value="state.reason" />
                    </TFormItem>
                  </TCol>
                  <TCol :span="12" class="text-right">
                    <TButton type="submit" :loading="auditLoading">提交</TButton>
                  </TCol>
                </TRow>
              </TForm>
            </TCard>
          </div>
          <div class="flex-none w-220px">
            <div class="sticky top-0">
              <h2 class="my-0 mb-2 text-lg">审核记录</h2>
              <Timeline />
            </div>
          </div>
        </div>
      </div>
    </TLoading>
  </div>
</template>

<script setup lang="ts">
import useData from './use-data'
import useAudit from './use-audit'
import Timeline from './timeline.vue'
import FormRenderer from '@fusionx/core/form-renderer/index.vue'
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'

const fuxRenderer = useTemplateRef('fuxRenderer')
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const rules: FormProps['rules'] = {
  conclusion: [{ required: true, message: '请选择审核结论', trigger: 'change' }],
  reason: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
  rtnToTaskKey: [{ required: true, message: '请选择需要退回到的流程环节', trigger: 'change' }],
}

const { loading, appSchema, plan, app, starter, submitTime } = useData(fuxRenderer)
const { taskRtnOpts, onSubmit, state, loading: auditLoading } = useAudit(formRef)

const [auditOptions] = useDict('app_audit_options')
</script>
