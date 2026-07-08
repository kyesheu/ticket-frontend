import type { PageDomain } from '@/types/api/common'

export interface AiFeedback {
  id: number
  ticketId?: number
  ticketNo?: string
  targetType?: string
  value: string
  comment?: string
  userId?: number
  userName?: string
  createTime?: string
}

export interface AiFeedbackQueryDTO extends PageDomain {
  ticketNo?: string
}

export interface AiFeedbackStatistics {
  totalFeedback: number
  positiveCount: number
  negativeCount: number
  positiveRate: number
}
