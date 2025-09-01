import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  name?: string
  type?: number
}

export type PolicyLabelVO = {
    id?: string // 表单编号
    name?: string // 标签名
    clickNum?: number // 点击量
    type?: number // 标签类别
    value?: string // 字典键值
}

const prefix = `/system/policy-label`

export const getPolicyLabelList = (params: ListQueryParams) => {
  return request.get<PaginatedList<PolicyLabelVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getPolicyLabelDetail = (id: string) => {
  return request.get<PolicyLabelVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createPolicyLabel = (data: PolicyLabelVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updatePolicyLabel = (data: PolicyLabelVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deletePolicyLabel = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
