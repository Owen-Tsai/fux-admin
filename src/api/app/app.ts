import request from '@/utils/request'
import type { ColumnVO } from '@/api/infra/code-gen'

export type AppVO = {
  id?: string
  name?: string
  type?: string
  code?: string // 业务标志？
  dept?: string
  sort?: number
  iconFe?: string
  iconBe?: string
  createTime?: string
  updateTime?: string
  published?: number
  description?: string
  processIds?: string
  userType?: string
  comopen?: number
}

export type ListQueryParams = {
  name?: string
  type?: string
  published?: number
  updateTime?: string
} & CommonQueryParams

export type TableVO = {
  tableName: string
  tableComment?: string
}

export type TableColumnsVO = {
  table: string
  tableComment?: string
  columns: ColumnVO[]
}

const url = '/system/application'

export const getApplicationList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<AppVO>>({
    url: `${url}/page`,
    params,
  })
}

export const getApplicationSimpleList = () => {
  return request.get<Pick<AppVO, 'id' | 'name' | 'processIds'>[]>({
    url: `${url}/get-list`,
  })
}

export const getApplicationDetail = (id: string) => {
  return request.get<AppVO>({
    url: `${url}/get?id=${id}`,
  })
}

export const addApplication = (data: AppVO) => {
  return request.post({
    url: `${url}/create`,
    data,
  })
}

export const updateApplication = (data: AppVO) => {
  return request.put({
    url: `${url}/update`,
    data,
  })
}

export const deleteApplication = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

export const setPublished = (id: string, published: boolean) => {
  return request.put({
    url: `${url}/update-published`,
    data: { id, published },
  })
}

export const getTables = (dataSourceConfigId?: number) => {
  return request.get<TableVO[]>({
    url: `${url}/get-tables`,
    params: {
      dataSourceConfigId: dataSourceConfigId || 0,
    },
  })
}

export const getTableColumns = (tables: string[], dataSourceConfigId?: number) => {
  return request.get<TableColumnsVO[]>({
    url: `${url}/get-table-fields`,
    params: {
      tables,
      dataSourceConfigId: dataSourceConfigId || 0,
    },
  })
}
