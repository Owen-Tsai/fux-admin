import request from '@/utils/request'

export type ProfileEducationEntry = {
  id?: string
  schoolName?: string
  educationLevel?: number
  major?: string
  startDate?: string
  endDate?: string
  degreeCertificateNo?: string
  diplomaNo?: string
}

export type ProfileHonorEntry = {
  id?: string
  awardName?: string
  awardDate?: number
  certificateNo?: string
}

export type ProfilePatentEntry = {
  id?: string
  patentName?: string
  patentType?: string
  patentNo?: string
  applicationDate?: string
}

export type ProfilePublicationEntry = {
  id?: string
  title?: string
  publishDate?: number
}

export type ProfileSkillEntry = {
  id?: string
  skillName?: string
  skillLevel?: string
  obtainDate?: number
}

export type ProfileTitleEntry = {
  id?: string
  titleName?: string
  titleLevel?: string
  professionalField?: string
  qualificationName?: string
  obtainDate?: number
  certificateNo?: string
}

export type ProfileWorkEntry = {
  id?: string
  companyName?: string
  position?: string
  department?: string
  startDate?: string
  endDate?: string
  workStatus?: number
  jobDescription?: string
}

export type ProfileVO = {
  id?: string
  name?: string
  englishname: string
  companyName?: string
  nationality?: number
  sex?: number
  idcard?: string
  idtype?: number
  birthday?: number
  diploma?: number
  companyid?: string
  nation?: number
  mobile?: string
  email?: string
  address?: string
  eduschool?: string
  edudate?: string
  politicalstatus?: number
  postcode?: string
  diplomatype?: number
  firstmajor?: string
  degree?: number
  selfeval?: string
  regdate?: number
  isenable?: boolean
  educationList?: ProfileEducationEntry[]
  honorList?: ProfileHonorEntry[]
  patentList?: ProfilePatentEntry[]
  publicationList?: ProfilePublicationEntry[]
  skillList?: ProfileSkillEntry[]
  titleList?: ProfileTitleEntry[]
  workList?: ProfileWorkEntry[]
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  companyName?: string
  diploma?: number
  degree?: number
  birthday?: number[]
  sex?: number
  diplomatype?: number
  politicalstatus?: number
}

const prefix = '/system/talent-info'

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ProfileVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: string) => {
  return request.get<ProfileVO>({
    url: `${prefix}/get-detail?id=${id}`,
  })
}

export const setEnabled = (id: string, isEnabled: boolean) => {
  return request.put({
    url: `${prefix}/update-talent-status`,
    data: {
      id,
      isenable: isEnabled,
    },
  })
}

export const exportExcel = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params,
  })
}
