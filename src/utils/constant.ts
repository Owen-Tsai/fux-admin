export const MENU_TYPES = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '操作', value: 3 },
]

export enum FILE_UPLOAD_STORAGE {
  /** 不需要登录即可查看的公开文件 */
  PUBLIC = 7,
  /** 前台个人头像  */
  AVATAR = 2,
  /** 前台单位 logo */
  LOGO = 3,
  /** 资讯类附件 */
  INFO = 28,
  /** 个人申报附件 */
  BUSINESS_PERSONAL = 5,
  /** 单位申报附件 */
  BUSINESS_COMPANY = 6,
}

export enum AUDIT_PROCESS {
  /** 已通过 */
  APPROVED = '1',
  /** 未通过 */
  REJECTED = '2',
  /** 已退回到发起人 */
  RETURNED = '3',
  /** 未提交 */
  UNCOMMITTED = '-2',
  /** 已提交 / 审核中 */
  SUBMITTED = '0',
}
