import type { PageDomain, BaseEntity } from "../common";

/** 工单分页查询参数 */
export interface TicketQueryParams extends PageDomain {
  /** 工单标题 */
  title?: string;
  /** 工单状态 */
  status?: string;
  /** 优先级 */
  priority?: string;
  /** 分类ID */
  categoryId?: number;
  /** 受理人ID */
  assigneeId?: number;
  /** 创建人ID */
  creatorId?: number;
  /** 工单编号 */
  ticketNo?: string;
  /** 创建时间 */
  params?: {
    beginTime?: string;
    endTime?: string;
  };
}

/** 工单信息 */
export interface Ticket extends BaseEntity {
  /** 工单ID */
  ticketId?: number;
  /** 工单编号 */
  ticketNo?: string;
  /** 工单标题 */
  title?: string;
  /** 工单内容 */
  content?: string;
  /** 分类ID */
  categoryId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 优先级 LOW/MEDIUM/HIGH/URGENT */
  priority?: string;
  /** 状态 NEW/PROCESSING/WAIT_CONFIRM/CLOSED/CANCELLED */
  status?: string;
  /** 创建人ID */
  creatorId?: number;
  /** 创建人名称 */
  creatorName?: string;
  /** 受理人ID */
  assigneeId?: number;
  /** 受理人名称 */
  assigneeName?: string;
  /** 所属部门ID */
  deptId?: number;
  /** 所属部门名称 */
  deptName?: string;
  /** 处理时间 */
  processedAt?: string;
  /** 关闭时间 */
  closedAt?: string;
  /** 关联附件ID列表 */
  attachmentIds?: number[];
  /** 评论列表 */
  comments?: TicketComment[];
  /** 操作日志列表 */
  logs?: TicketOperationLog[];
  /** 自定义字段值 */
  customFieldValues?: Record<string, any>;
}

/** 工单列表项 */
export interface TicketListVO extends BaseEntity {
  ticketId?: number;
  ticketNo?: string;
  title?: string;
  categoryId?: number;
  categoryName?: string;
  priority?: string;
  status?: string;
  creatorId?: number;
  creatorName?: string;
  assigneeId?: number;
  assigneeName?: string;
  deptName?: string;
  processedAt?: string;
  closedAt?: string;
}

/** 创建工单DTO */
export interface TicketCreateDTO {
  /** 工单标题 */
  title: string;
  /** 工单内容 */
  content?: string;
  /** 分类ID */
  categoryId?: number;
  /** 优先级 */
  priority?: string;
  /** 附件ID列表 */
  attachmentIds?: number[];
  /** 自定义字段值 */
  customFieldValues?: Record<string, any>;
}

/** 分派工单DTO */
export interface TicketAssignDTO {
  /** 受理人ID */
  assigneeId: number;
  /** 备注 */
  comment?: string;
}

/** 处理工单DTO */
export interface TicketProcessDTO {
  /** 处理结果 */
  result?: string;
  /** 备注 */
  comment?: string;
  /** 附件ID列表 */
  attachmentIds?: number[];
}

/** 确认工单DTO */
export interface TicketConfirmDTO {
  /** 确认备注 */
  comment?: string;
}

/** 取消工单DTO */
export interface TicketCancelDTO {
  /** 取消原因 */
  reason: string;
}

/** 工单操作日志 */
export interface TicketOperationLog extends BaseEntity {
  /** 日志ID */
  logId?: number;
  /** 工单ID */
  ticketId?: number;
  /** 操作类型 CREATE/ASSIGN/PROCESS/CONFIRM/CANCEL */
  operationType?: string;
  /** 操作前状态 */
  fromStatus?: string;
  /** 操作后状态 */
  toStatus?: string;
  /** 操作人ID */
  operatorId?: number;
  /** 操作人名称 */
  operatorName?: string;
  /** 操作详情 */
  detail?: string;
}

/** 工单评论 */
export interface TicketComment extends BaseEntity {
  /** 评论ID */
  commentId?: number;
  /** 工单ID */
  ticketId?: number;
  /** 用户ID */
  userId?: number;
  /** 用户名称 */
  userName?: string;
  /** 评论内容 */
  content?: string;
  /** 评论类型 INTERNAL/EXTERNAL */
  commentType?: string;
}

/** 添加评论DTO */
export interface TicketCommentDTO {
  /** 评论内容 */
  content: string;
  /** 评论类型 INTERNAL/EXTERNAL */
  commentType?: string;
}
