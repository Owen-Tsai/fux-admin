import request from '@/utils/request'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}

export type DeptTreeVO = DeptTreeNode[]

export type DeptVO = {
  createTime?: number
  email?: string
  id?: number
  leaderUserId?: number
  name?: string
  parentId?: number
  phone?: string
  sort?: number
  status?: number
  // 新增地区字段
  region?: string[] // 省市区编码数组
  provinceId?: string
  cityId?: string
  countyId?: string
  provinceName?: string
  cityName?: string
  countyName?: string
}

export type TreeQueryParams = {
  name?: string
  status?: number
  leaderUserId?: number
}

// 新增地区树节点类型
export type RegionTreeNode = {
  code: string
  name: string
  isLeaf?: boolean
  children?: RegionTreeNode[]
}

const prefix = '/admin-api/system/dept'
const regionPrefix = '/admin-api/system/area'

// 部门接口
export const getDeptTree = (params?: TreeQueryParams) => {
  return request.get<DeptTreeVO>({
    url: `${prefix}/tree-list`,
    params,
  })
}

// 地区接口
export const getTopRegions = () => {
  return request.get<RegionTreeNode[]>({
    url: `${regionPrefix}/top`,
  })
}

export const getChildrenRegions = (parentId: string) => {
  return request.get<RegionTreeNode[]>({
    url: `${regionPrefix}/children/${parentId}`,
  })
}

//获取地区路径
export const getRegionPath = (id: string) => {
  return request.get<RegionTreeNode[]>({
    url: `${regionPrefix}/path/${id}`,
  })
}

export const getRegionName = (code: string) => {
  return request.get<string>({
    url: `${regionPrefix}/name/${code}`,
  })
}

export const getRegionNames = (codes: string[]) => {
  return request.post<Record<string, string>>({
    url: `${regionPrefix}/names`,
    data: { codes },
  })
}

export const getDeptDetail = (id: number) => {
  return request.get<DeptVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createDept = (data: DeptVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateDept = (data: DeptVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteDept = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const getDeptSimpleList = () => {
  return request.get<Array<{ id: number; name: string }>>({
    url: `${prefix}/simple-list`,
  })
}
