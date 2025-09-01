import request from '@/utils/request'

export type MessageVO = {
  createTime?: number
  id?: number
  readStatus?: boolean
  readTime?: number
  templateCode?: string
  templateContent?: string
  templateId?: number
  templateNickname?: string
  templateParams?: Record<string, string | null | number>
  templateType?: number
  userId?: number
  userType?: number
}

export type ListQueryParams = CommonQueryParams & {
  userId?: string
  userType?: number
  templateCode?: string
  templateType?: number
}

const prefix = '/system/notify-message'

export const getAllMessageList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<MessageVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getSelfMessageList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<MessageVO>>({
    url: `${prefix}/my-page`,
    params,
  })
}

export const getMessageDetail = (id: number) => {
  return request.get<MessageVO>({
    url: `${prefix}/get?=${id}`,
  })
}

export const updateRead = (ids: number[]) => {
  return request.put({
    url: `${prefix}/update-read`,
    data: ids,
  })
}

export const updateAllRead = () => {
  return request.put({
    url: `${prefix}/update-all-read`,
  })
}

export const getUnreadList = (size?: number) => {
  return request.get<MessageVO[]>({
    url: `${prefix}/get-unread-list`,
    params: {
      size,
    },
  })
}

export const getUnreadCount = () => {
  return request.get<number>({
    url: `${prefix}/get-unread-count`,
  })
}
