import request from '@/utils/request'

export type ProfileVO = {
  id?: string // 主键
  username?: string // 用户名
  email?: string // email
  regdate?: Date // 注册时间
  name?: string // 单位名称
  code?: string // 单位编码
  memstartdate?: Date // 会员开始时间
  memenddate?: Date // 会员结束时间
  creditrate?: string // 统一社会信用代码
  unitnature?: number // 单位性质
  introduce?: string // 单位介绍
  scalesize?: number // 规模
  regfund?: number // 注册资金
  tradeinfoid?: number // 行业类别
  address?: string // 单位地址
  contact?: string // 联系人
  mobile?: string // 手机号
  telphone?: string // 电话
  fax?: string // 传真
  compemail?: string // email
  homepage?: string // 主页
  licensepic?: number // 营业执照
  businesslicensenum?: string // 商业许可证
  faxbooknum?: string // 传真
  logopic?: string // logo
  bank?: string // 银行
  account?: string // 银行账号
  isreceiveemail?: number // 是否接收邮件
  logontimes?: number // 登录时间
  lastlogonip?: string // 最后登录Ip
  lastlogondate?: Date // 最后登录时间
  isvip?: number // 是否vip
  isunionmember?: number // 是否工会会员
  ismarket?: number // 是否市场会员
  marstartdate?: Date // 市场会员开始时间
  marenddate?: Date // 市场会员结束时间
  downresutimes?: number // 下载次数
  pubjobtimes?: number // 工作时间
  isenable?: number // 是否可用
  remark?: string // 备注
  legalrepresent?: string // 法定代表人
  province?: number // 省
  locusid?: number // 地点
  county?: number // 市
  towns?: number // 城镇
  street?: string // 街道
  inarea?: number // 所属区县
  taxNumber?: string // 税务登记号
  website?: string // 单位网站
  belongTo?: string // 隶属关系
  businessScope?: string // 业务范围
  talentTjType?: string // 人才统计类型
  unitSize?: number // 单位规模
  institutionType?: number // 机构类型
  unitType?: number // 单位类型
  technicalField?: string // 技术领域
  holdingSituation?: string // 控股情况
  fgyzqydjzclx?: string // 非公有制企业登记注册类型
}

export type ListQueryParams = CommonQueryParams & {
  name?: string // 单位名称
  contact?: string // 联系人
  username?: string // 用户名
  creditrate?: string // 统一社会信用代码
  institutionType?: number // 机构类型
  unitType?: number // 单位类型
  technicalField?: string // 技术领域
  unitnature?: number // 单位性质
  introduce?: string // 单位介绍
  scalesize?: number // 规模
  regfund?: number // 注册资金
  tradeinfoid?: number // 行业类别
}

const prefix = '/system/unit-info'

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ProfileVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: string) => {
  return request.get<ProfileVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const setEnabled = (id: string, status: number) => {
  return request.put({
    url: `${prefix}/update-unit-status`,
    data: {
      id,
      status,
    },
  })
}

export const exportExcel = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params,
  })
}
