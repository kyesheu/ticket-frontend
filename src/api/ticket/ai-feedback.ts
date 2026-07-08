import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { AiFeedback, AiFeedbackQueryDTO, AiFeedbackStatistics } from '@/types/ticket/ai-feedback'

export function listAiFeedback(query?: AiFeedbackQueryDTO): Promise<TableDataInfo<AiFeedback>> {
  return request({ url: '/ticket/ai/feedback/list', method: 'get', params: query })
}

export function getTicketAiFeedback(ticketId: number): Promise<AjaxResult<AiFeedback>> {
  return request({ url: '/ticket/ai/feedback/ticket/' + ticketId, method: 'get' })
}

export function addAiFeedback(data: { ticketId: number; value?: string; comment?: string; targetType?: string; targetId?: number; feedbackValue?: string; adopted?: boolean }): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/feedback', method: 'post', data })
}

export function getAiFeedbackStatistics(): Promise<AjaxResult<AiFeedbackStatistics>> {
  return request({ url: '/ticket/ai/feedback/statistics', method: 'get' })
}
