type PaginatedList<T> = {
  total: number
  list: Array<T>
}

type CommonQueryParams = {
  pageSize?: number
  pageNo?: number
  createTime?: [string, string] | [Dayjs, Dayjs]
}
