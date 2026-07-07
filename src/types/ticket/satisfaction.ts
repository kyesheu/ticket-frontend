import type { PageDomain } from '@/types/api/common'

/** 满意度评价 */
export interface TicketSatisfaction {
  /** 评价ID */
  satisfactionId: number
  /** 工单ID */
  ticketId: number
  /** 工单编号 */
  ticketNo?: string
  /** 评分（1-5） */
  score: number
  /** 评价内容 */
  content?: string
  /** 评价人ID */
  userId?: number
  /** 评价人名称 */
  userName?: string
  /** 创建时间 */
  createTime?: string
}

/** 提交评价 */
export interface TicketSatisfactionCreateDTO {
  /** 评分（1-5） */
  score: number
  /** 评价内容（最长500字） */
  content?: string
}

/** 评价查询参数 */
export interface TicketSatisfactionQueryDTO extends PageDomain {
  /** 工单编号 */
  ticketNo?: string
  /** 最小评分 */
  minScore?: number
  /** 最大评分 */
  maxScore?: number
}

/** 评分选项 */
export const scoreOptions = [
  { label: '1 分（非常不满意）', value: 1 },
  { label: '2 分（不满意）', value: 2 },
  { label: '3 分（一般）', value: 3 },
  { label: '4 分（满意）', value: 4 },
  { label: '5 分（非常满意）', value: 5 },
]

/** 评分标签类型映射 */
export function scoreTagType(score?: number): string {
  if (!score) return 'info'
  if (score >= 4) return 'success'
  if (score >= 3) return ''
  return 'danger'
}
