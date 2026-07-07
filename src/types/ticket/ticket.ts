/**
 * 工单模块类型定义
 * 字段来源以 docs/1.x/1.0/backend.md 为准
 */

// ── 枚举常量 ──

export const TICKET_STATUS = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  WAIT_CONFIRM: 'WAIT_CONFIRM',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]

export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const
export type TicketPriority = (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY]

export const TICKET_OPERATION_TYPE = {
  CREATE: 'CREATE',
  ASSIGN: 'ASSIGN',
  PROCESS: 'PROCESS',
  CONFIRM: 'CONFIRM',
  CANCEL: 'CANCEL',
} as const
export type TicketOperationType = (typeof TICKET_OPERATION_TYPE)[keyof typeof TICKET_OPERATION_TYPE]

export const TICKET_COMMENT_TYPE = {
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL',
} as const
export type TicketCommentType = (typeof TICKET_COMMENT_TYPE)[keyof typeof TICKET_COMMENT_TYPE]
export type TicketOverdueFlag = '0' | '1'

// ── 字典选项 ──

export const statusOptions = [
  { label: '待分派', value: TICKET_STATUS.NEW },
  { label: '处理中', value: TICKET_STATUS.PROCESSING },
  { label: '待确认', value: TICKET_STATUS.WAIT_CONFIRM },
  { label: '已关闭', value: TICKET_STATUS.CLOSED },
  { label: '已取消', value: TICKET_STATUS.CANCELLED },
]

export const priorityOptions = [
  { label: '低', value: TICKET_PRIORITY.LOW },
  { label: '中', value: TICKET_PRIORITY.MEDIUM },
  { label: '高', value: TICKET_PRIORITY.HIGH },
  { label: '紧急', value: TICKET_PRIORITY.URGENT },
]

// ── 状态按钮映射 ──

/** 每个状态可显示的操作按钮 */
export const STATUS_ACTIONS: Record<string, string[]> = {
  [TICKET_STATUS.NEW]: ['assign', 'cancel'],
  [TICKET_STATUS.PROCESSING]: ['process', 'cancel'],
  [TICKET_STATUS.WAIT_CONFIRM]: ['confirm'],
  [TICKET_STATUS.CLOSED]: [],
  [TICKET_STATUS.CANCELLED]: [],
}

/** 按钮对应的权限标识 */
export const ACTION_PERMISSION: Record<string, string> = {
  assign: 'ticket:ticket:assign',
  process: 'ticket:ticket:process',
  confirm: 'ticket:ticket:confirm',
  cancel: 'ticket:ticket:cancel',
}

// ── VO ──

/** 工单详情 */
export interface TicketVO {
  ticketId: number
  ticketNo: string
  title: string
  content: string
  categoryId?: number
  categoryName?: string
  priority: string
  status: string
  creatorId?: number
  creatorName?: string
  assigneeId?: number
  assigneeName?: string
  deptId?: number
  deptName?: string
  processedAt?: string
  closedAt?: string
  responseDueAt?: string
  resolveDueAt?: string
  responseOverdue?: TicketOverdueFlag
  resolveOverdue?: TicketOverdueFlag
  createTime?: string
  updateTime?: string
  remark?: string
  comments?: TicketComment[]
  logs?: TicketOperationLog[]
  customFields?: TicketCustomFieldValue[]
  /** 自定义字段值（v2.1，fieldKey → value 映射） */
  customFieldValues?: Record<string, any>
  /** 当前流程节点名（v2.0） */
  currentNode?: string
  /** 流程实例ID（v2.0） */
  workflowId?: number
  /** 流程历史（v2.0） */
  workflowHistory?: TicketWorkflowHistory[]
}

/** 流程历史（v2.0） */
export interface TicketWorkflowHistory {
  id: number
  ticketId: number
  nodeName: string
  action: string
  operatorName?: string
  comment?: string
  createTime?: string
}

/** 工单评论 */
export interface TicketComment {
  commentId: number
  ticketId: number
  userId?: number
  content: string
  commentType: TicketCommentType
  userName?: string
  createTime?: string
}

/** 操作日志 */
export interface TicketOperationLog {
  logId: number
  ticketId: number
  operationType: TicketOperationType
  fromStatus?: string
  toStatus?: string
  operatorId?: number
  operatorName?: string
  comment?: string
  operateTime?: string
}

/** 自定义字段值（v2.1，v1.0 仅声明类型占位） */
export interface TicketCustomFieldValue {
  fieldId?: number
  fieldKey?: string
  value?: string
}

// ── DTO ──

/** 工单查询 */
export interface TicketQueryDTO {
  status?: string
  priority?: string
  categoryId?: number
  keyword?: string
  beginTime?: string
  endTime?: string
  pageNum?: number
  pageSize?: number
}

/** 创建工单 */
export interface TicketCreateDTO {
  title: string
  content?: string
  categoryId?: number
  priority?: string
  /** 自定义字段值 v2.1 */
  customFields?: Record<string, any>
}

/** 分派 */
export interface TicketAssignDTO {
  assigneeId: number
  comment?: string
}

/** 处理 */
export interface TicketProcessDTO {
  comment: string
}

/** 确认关闭 */
export interface TicketConfirmDTO {
  comment?: string
}

/** 取消 */
export interface TicketCancelDTO {
  comment: string
}

/** 添加评论 */
export interface TicketCommentCreateDTO {
  content: string
  commentType?: TicketCommentType
}
