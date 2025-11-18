import request from '@/utils/request'

// 医疗保险业务对接 VO
export type MedicalInsuranceVO = {
    id?: string // 主键ID
    idcard?: string // 参保人证件号
    name?: string // 参保人姓名
    companyName?: string // 缴费单位名称
    orgNum?: string // 统一社会信用代码
    paymentAmount?: number // 缴费额度
    paymentBase?: number // 缴费基数
    status?: number // 人员参保状态
    startDate?: Date // 开始时间
    remark?: string // 备注
}

const prefix = '/applications/medical-insurance'

export type ListQueryParams = CommonQueryParams & Partial<MedicalInsuranceVO>

// 查询医疗保险业务对接分页
export const getMedicalInsuranceList = (params: ListQueryParams) => {
    return request.get<PaginatedList<MedicalInsuranceVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getMedicalInsuranceDetail = (id: number) => {
    return request.get<MedicalInsuranceVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addMedicalInsurance = (data: MedicalInsuranceVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateMedicalInsurance = (data: MedicalInsuranceVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteMedicalInsurance = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportMedicalInsurance = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '医疗保险业务对接'
    })
}

