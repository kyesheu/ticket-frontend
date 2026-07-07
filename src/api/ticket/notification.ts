import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { TicketNotification, TicketNotificationQueryDTO } from '@/types/ticket/notification'

/** 我的通知列表 */
export function listNotification(query?: TicketNotificationQueryDTO): Promise<TableDataInfo<TicketNotification>> {
  return request({
    url: '/ticket/notification/list',
    method: 'get',
    params: query,
  })
}

/** 未读数量 */
export function getUnreadCount(): Promise<AjaxResult<number>> {
  return request({
    url: '/ticket/notification/unread-count',
    method: 'get',
  })
}

/** 单条已读 */
export function markRead(id: number): Promise<AjaxResult> {
  return request({
    url: '/ticket/notification/' + id + '/read',
    method: 'put',
  })
}

/** 全部已读 */
export function markAllRead(): Promise<AjaxResult> {
  return request({
    url: '/ticket/notification/read-all',
    method: 'put',
  })
}
