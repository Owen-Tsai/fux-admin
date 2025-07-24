import request from '@/utils/request'

// 个人会员 VO
export type TalentInfoVO = {
  username?: string // 用户名
  code?: string // 编码
  personaltype?: number // 个人类型
  name?: string // 姓名
  idcard?: string // 身份证号
  idtype?: number // 证件类型
  englishname?: string // 英文名
  birthday?: Date // 出生年月
  sex?: number // 性别
  height?: number // 身高
  weight?: number // 体重
  nativeplace?: number // 出生地
  maritalstatus?: number // 婚姻状况
  nation?: number // 民族
  politicalstatus?: number // 政治面貌
  registeredresidence?: number // 注册公民
  jobexperience?: number // 工作经验
  mobile?: string // 手机号
  telephone?: string // 联系电话
  calltime?: string // 打电话时间
  qq?: string // qq
  homepage?: string // 个人主页
  email?: string // email
  address?: string // 地址
  postcode?: string // 邮编
  diploma?: number // 学历
  diplomatype?: number // 学历类型
  eduschool?: string // 毕业院校
  edudate?: Date // 毕业时间
  firstmajor?: number // 第一专业
  secondmajor?: number // 第二专业
  chineselevel?: number // 中文水平
  firstlang?: number // 第一外语
  foreignlanglevel?: number // 第一外语等级
  secondlang?: number // 第二外语
  foreignlanglevel2?: number // 第二外语等级
  certificate?: string // 证书
  titlelevel?: number // 头衔
  abilitydesc?: string // 个人能力
  selfeval?: string // 自我介绍
  jobstate?: number // 工作状态
  hopeworkplace?: string // 工作场所
  photoattach?: string // 头像上传Id
  idcardattach?: number // 身份证上传Id
  certificateattach?: number // 证书上传Id
  keywords?: string // 关键字
  auditstate?: number // 审核状态
  logontimes?: number // 登录时间
  lastlogondate?: Date // 最后一次登录时间
  lastlogonip?: string // 最后一次登录IP
  isenable?: number // 是否可用
  remark?: string // 备注
  regdate?: Date // 注册时间
  isrecommend?: number // 是否推荐
  isreceivemail?: number // 是否接收邮件
  technicalgrade?: number // 技术等级
  companyid?: string // 单位Id
  personstate?: number // 个人状态
  talentstype?: number // 人才类别
  schooltype?: number // 学校类别
  degree?: number // 学位
  nowaddress?: string // 现居住地
}

const prefix = '/admin-api/system/talent-info'

export type ListQueryParams = CommonQueryParams & Partial<TalentInfoVO>

// 查询个人会员分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<TalentInfoVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<TalentInfoVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createTalentInfo = (data: TalentInfoVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateTalentInfo = (data: TalentInfoVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteTalentInfo = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportTalentInfo = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '个人会员',
  })
}

// 更新人才账号能否登陆的状态
export const updateTalentStatus = (id: number, status: number) => {
  return request.put({
    url: `${prefix}/update-talent-status`,
    params: {
      id,
      status,
    },
  })
}

// 重置人才密码
export const resetPassword = (id: number) => {
  return request.put({
    url: `${prefix}/reset-password`,
    params: {
      id,
    },
  })
}
