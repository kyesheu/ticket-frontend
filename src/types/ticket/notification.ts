import type { PageDomain } from '@/types/api/common'

/** 通知类型枚举 */
export type NotificationType = 'ASSIGN' | 'PROCESS' | 'CLOSE' | 'CANCEL' | 'COMMENT' | 'SLA_OVERDUE'

/** 通知类型选项 */
export const notificationTypeOptions = [
  { label: '分派', value: 'ASSIGN' },
  { label: '处理', value: 'PROCESS' },
  { label: '关闭', value: 'CLOSE' },
  { label: '取消', value: 'CANCEL' },
  { label: '评论', value: 'COMMENT' },
  { label: 'SLA超时', value: 'SLA_OVERDUE' },
]

/** 通知信息 */
export interface TicketNotification {
  /** 通知ID */
  id: number
  /** 通知类型 */
  type: NotificationType | string
  /** 标题 */
  title: string
  /** 内容摘要 */
  content?: string
  /** 关联工单ID */
  ticketId?: number
  /** 是否已读 */
  isRead: boolean
  /** 创建时间 */
  createTime?: string
}

/** 通知查询参数 */
export interface TicketNotificationQueryDTO extends PageDomain {
  /** 是否已读 */
  isRead?: boolean
}
