export const treeValueModeOpts = [
  { label: '仅显示子节点', value: 'onlyLeaf' },
  { label: '优先显示父节点', value: 'parentFirst' },
  { label: '同时展示父子节点', value: 'all' },
]

export const dateModeOpts = [
  { label: '年选择', value: 'year' },
  { label: '季度选择', value: 'quarter' },
  { label: '月选择', value: 'month' },
  { label: '周选择', value: 'week' },
  { label: '日选择', value: 'date' },
]

export const dateValueTypeOpts = [
  { value: 'time-stamp', label: '时间戳' },
  { value: 'Date', label: '原生日期对象' },
  { value: 'YYYY', label: 'YYYY' },
  { value: 'YYYY-MM', label: 'YYYY-MM' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'YYYY-MM-DD HH', label: 'YYYY-MM-DD HH' },
  { value: 'YYYY-MM-DD HH:mm', label: 'YYYY-MM-DD HH:mm' },
  { value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
  { value: 'YYYY-MM-DD HH:mm:ss:SSS', label: 'YYYY-MM-DD HH:mm:ss:SSS' },
]
