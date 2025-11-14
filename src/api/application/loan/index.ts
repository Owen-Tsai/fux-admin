import request from '@/utils/request'

// 公积金贷款信息 VO
export type ReserveFundLoanVO = {
    id?: string // 主键ID
    loanTotal?: number // 贷款总额
    fundLoanAmount?: number // 公积金贷款金额
    bankName?: string // 银行名称
    borrowerName?: string // 借款人姓名
    borrowerIdcard?: string // 借款人证件号码
    unitName?: string // 单位名称
    spouseName?: string // 配偶姓名
    spouseIdcard?: string // 配偶证件号
    phone?: string // 手机号码
}

const prefix = '/applications/reserve-fund-loan'

export type ListQueryParams = CommonQueryParams & Partial<ReserveFundLoanVO>

// 查询公积金贷款信息分页
export const getReserveFundLoanList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ReserveFundLoanVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getReserveFundLoanDetail = (id: number) => {
    return request.get<ReserveFundLoanVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addReserveFundLoan = (data: ReserveFundLoanVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateReserveFundLoan = (data: ReserveFundLoanVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteReserveFundLoan = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportReserveFundLoan = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '公积金贷款信息表'
    })
}

