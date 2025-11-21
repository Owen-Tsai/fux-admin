import { generateId } from '@fusionx/core/utils'
import type { TaskNodeConfigMap } from '@fusionx/core/types'

export const initialTaskNodeConfig: TaskNodeConfigMap = {
  start: {
    uid: generateId(),
    name: '开始',
    type: 'start',
    props: {},
  },
  audit: {
    uid: '',
    name: '审核人',
    type: 'audit',
    props: {
      actor: {},
      fieldsInteractivity: [],
      joint: false,
    },
  },
  condition: {
    uid: '',
    name: '条件',
    type: 'condition',
    props: {},
  },
  group: {
    uid: '',
    name: '',
    type: 'group',
    props: {
      children: [],
    },
  },
}
