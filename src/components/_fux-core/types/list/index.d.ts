/**
 * 列表列配置
 */
interface Column {
  /** 列标题 */
  title: string
  /** 列键，对应数据项名称 */
  colKey: string
  /** 列宽度 */
  width?: number | string
  /** 列对齐方式 */
  align?: 'left' | 'right' | 'center'
  /** 列固定位置 */
  fixed?: 'left' | 'right'
  /** 列格式化函数 */
  formatter?: (value: any, row: any, index: number) => string
}
