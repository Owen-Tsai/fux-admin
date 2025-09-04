import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
}

export type PolicyVO = {
    id?: string // 表单编号
    subsite?: number // 子网站
    title?: string // 政策标题
    type?: string[] // 政策分类
    infoSources?: string // 信息来源
    image?: string // 政策相关图片
    releaseGov?: string // 发布机关
    sendDate?: Date // 成文日期
    policyDescribe?: string // 描述
    hrefUrl?: string // 链接地址
    isRecommond?: boolean // 是否推荐
    deptId?: number // 发布部门
    userId?: number // 发布人
    isInMobile?: boolean // 是否手机端显示
    visitNum?: number // 访问量
    attachUrl?: string // 相关附件
    pushSite?: number // 推送站点
    pushTo?: string // 推送至
    oldId?: string // 原id
    microPlatformColumn?: string // 微平台栏目
    microPlatformId?: string // 微平台原id
    auditState?: number // 审核状态
    auditId?: number // 审核人
    auditTime?: Date // 审核时间
    sort?: number // 排序
    oplog?: string // 操作日志
    talentType?: number // 人才类型
    talentProjectType?: number // 人才工程类型
    level?: number // 政策级别
    prerequisites?: number // 资格条件
    selection?: number // 遴选程序
    supporting?: number // 扶持政策
    subtitle?: string // 副标题
    content1?: number // 就业政策标签
    content2?: number // 对象
    content3?: number // 人才队伍领域
    content4?: number // 内容4
    content5?: number // 内容5
    declareId?: string // 申报id
    classification?: string[] // 政策分类
    label?: string[] // 政策标签
    document?: string // 政策文件
    supportObject?: string // 支持对象
    supportPolicy?: string // 支持政策
    declarationConditions?: string // 申报条件
    applicationMaterials?: string // 申报材料
    competentDepartment?: string // 主管部门
    contact?: string // 联系方式
    education?: string // 学历
    dicplanProject?: string // 计划工程
    appellation?: string // 称号
    region?: string // 区域
    technicalTitle?: string // 职称
    startDate?: Date // 开始日期
    endDate?: Date // 结束日期
    county?: number // 区县
    uid?: string // Uid
    policyObject?: string // 政策对象
    dynamicSql?: string // 动态sql
}

export type CheckboxDataVO = {
  name?: string // 名称
  optionName?: string[] // 数据值
  optionValue?: number[] // 数据键
}

const prefix = `/system/policy`

export const getPolicyList = (params: ListQueryParams) => {
  return request.get<PaginatedList<PolicyVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getPolicyDetail = (id: string) => {
  return request.get<PolicyVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const getCheckboxData = () => {
  return request.get<CheckboxDataVO[]>({
    url: `${prefix}/get-checkbox-data`,
  })
}

export const createPolicy = (data: PolicyVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updatePolicy = (data: PolicyVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deletePolicy = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
