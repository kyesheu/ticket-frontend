import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { TicketSatisfaction, TicketSatisfactionCreateDTO, TicketSatisfactionQueryDTO } from '@/types/ticket/satisfaction'

/** 提交评价 */
export function submitSatisfaction(ticketId: number, data: TicketSatisfactionCreateDTO): Promise<AjaxResult> {
  return request({
    url: '/ticket/satisfaction/' + ticketId,
    method: 'post',
    data,
  })
}

/** 查看工单评价 */
export function getTicketSatisfaction(ticketId: number): Promise<AjaxResult<TicketSatisfaction>> {
  return request({
    url: '/ticket/satisfaction/ticket/' + ticketId,
    method: 'get',
  })
}

/** 评价列表（管理员） */
export function listSatisfaction(query?: TicketSatisfactionQueryDTO): Promise<TableDataInfo<TicketSatisfaction>> {
  return request({
    url: '/ticket/satisfaction/list',
    method: 'get',
    params: query,
  })
}

/** 评价统计 */
export function getSatisfactionStatistics(): Promise<AjaxResult<any>> {
  return request({
    url: '/ticket/satisfaction/statistics',
    method: 'get',
  })
}
