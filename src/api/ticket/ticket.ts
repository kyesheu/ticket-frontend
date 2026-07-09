import request from '@/utils/request'
import type {
  TicketVO,
  TicketQueryDTO,
  TicketCreateDTO,
  TicketAssignDTO,
  TicketProcessDTO,
  TicketConfirmDTO,
  TicketCancelDTO,
  TicketOperationLog,
} from '@/types/ticket/ticket'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'

/** 工单分页列表 */
export function listTicket(query: TicketQueryDTO): Promise<TableDataInfo<TicketVO>> {
  return request({
    url: '/ticket/list',
    method: 'get',
    params: query,
  })
}

/** 我的待办工单 */
export function listMyTodoTickets(query: TicketQueryDTO): Promise<TableDataInfo<TicketVO>> {
  return request({
    url: '/ticket/workbench/my-todo',
    method: 'get',
    params: query,
  })
}

/** 工单详情（含评论和操作日志） */
export function getTicket(id: number): Promise<AjaxResult<TicketVO>> {
  return request({
    url: '/ticket/' + id,
    method: 'get',
  })
}

/** 创建工单 */
export function createTicket(data: TicketCreateDTO): Promise<AjaxResult> {
  return request({
    url: '/ticket',
    method: 'post',
    data,
  })
}

/** 分派工单 */
export function assignTicket(id: number, data: TicketAssignDTO): Promise<AjaxResult> {
  return request({
    url: `/ticket/${id}/assign`,
    method: 'put',
    data,
  })
}

/** 处理工单 */
export function processTicket(id: number, data: TicketProcessDTO): Promise<AjaxResult> {
  return request({
    url: `/ticket/${id}/process`,
    method: 'put',
    data,
  })
}

/** 确认关闭工单 */
export function confirmTicket(id: number, data?: TicketConfirmDTO): Promise<AjaxResult> {
  return request({
    url: `/ticket/${id}/confirm`,
    method: 'put',
    data,
  })
}

/** 取消工单 */
export function cancelTicket(id: number, data: TicketCancelDTO): Promise<AjaxResult> {
  return request({
    url: `/ticket/${id}/cancel`,
    method: 'put',
    data,
  })
}

/** 操作日志 */
export function getTicketLogs(ticketId: number): Promise<AjaxResult<TicketOperationLog[]>> {
  return request({
    url: `/ticket/${ticketId}/logs`,
    method: 'get',
  })
}
