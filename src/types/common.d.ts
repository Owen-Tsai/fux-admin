export {}

import type { TableProps } from 'tdesign-vue-next'

declare global {
  type PaginatedList<T> = {
    total: number
    list: Array<T>
  }

  type CommonQueryParams = {
    pageSize?: number
    pageNo?: number
    createTime?: string[] | number[] | Date[]
  }

  type TableScope<T> = {
    row: {
      [x in keyof T]: T[x]
    }
    col: undefined | Exclude<TableProps['columns'], undefined>[number]
    rowIndex: number
    colIndex: number
  }
}
