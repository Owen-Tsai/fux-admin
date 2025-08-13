import type { AppSchema } from '@fusionx/core/types'

const defaultSchema: AppSchema = {
  form: {
    widgets: [],
    labelWidth: '100px',
    labelAlign: 'left',
  },
  flow: {
    nodes: [
      {
        name: '发起人',
        type: 'start',
        uid: 'start-node',
        props: {},
      },
    ],
  },
  info: {
    tables: [],
    gridColumns: 2,
    paginated: false,
    viewModePaginated: false,
  },
  version: '1',
}

export default defaultSchema
