<template>
  <template v-if="selectedWidget?.class === 'form'">
    <TFormItem label="是否必填" class="boolean-setter">
      <TSwitch
        v-model:value="selectedWidget.props.field.required"
        @change="validation.toggleRule(selectedWidget, 'required')"
      />
    </TFormItem>
    <TFormItem label="校验规则">
      <div class="w-full">
        <TSelect
          v-model:value="validateType"
          :options="validationOpts"
          clearable
          class="mb-2"
          @change="onValidationTypeChange"
        />
        <CodeEditor
          v-if="validateType === 'regexp' || validateType === 'custom'"
          v-model="selectedWidget.props.field.rules"
          :height="140"
        />
      </div>
    </TFormItem>
    <pre>{{ validation.generateRules(selectedWidget) }}</pre>
  </template>
</template>

<script setup lang="ts">
import { validation, validationOpts } from '@fusionx/core/utils'
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import type { FormWidget } from '@fusionx/core/types'
import type { SelectProps } from 'tdesign-vue-next'

const { selectedWidget } = useDesignerCtxInject()!

const validateType = ref('')

const onValidationTypeChange: SelectProps['onChange'] = (v) => {
  if (v !== 'regexp' && v !== 'custom') {
    validation.removeRulesAndAdd(selectedWidget.value as FormWidget, v as string)
  } else {
    validation.removeRulesAndAdd(selectedWidget.value as FormWidget)
  }
}
</script>
