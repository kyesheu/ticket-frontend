import request from '@/utils/request'
import type { AjaxResult } from '@/types/api/common'
import type { TicketSearchParams, TicketSearchResponse, SearchIndexStatus } from '@/types/ticket/search'

/** 全文检索 */
export function searchTickets(params: TicketSearchParams): Promise<AjaxResult<TicketSearchResponse>> {
  return request({ url: '/ticket/search', method: 'get', params })
}

/** 触发索引重建 */
export function rebuildIndex(): Promise<AjaxResult> {
  return request({ url: '/ticket/search/rebuild', method: 'post' })
}

/** 查询重建进度 */
export function getRebuildProgress(): Promise<AjaxResult<SearchIndexStatus>> {
  return request({ url: '/ticket/search/rebuild', method: 'get' })
}

/** 重试失败事件 */
export function retrySearchEvents(): Promise<AjaxResult> {
  return request({ url: '/ticket/search/events/retry', method: 'post' })
}
