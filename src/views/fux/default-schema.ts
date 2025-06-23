import type { AppSchema } from '@fusionx/core/types'

const defaultSchema: AppSchema = {
  form: {
    widgets: [],
    labelWidth: '100px',
    labelAlign: 'left',
  },
  flow: {},
  info: {
    tables: [],
    gridColumns: 2,
    paginated: false,
  },
  version: '1',
}

export default defaultSchema
