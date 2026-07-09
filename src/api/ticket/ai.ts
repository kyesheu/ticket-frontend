import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { AiDocument, AiDocumentQueryDTO, TicketAiAssist, TicketAiTriage, TicketTriageApplyDTO } from '@/types/ticket/ai'

/** 导入知识文档 */
export function importDocument(sourceId: string, file: File, categoryName?: string): Promise<AjaxResult> {
  const formData = new FormData()
  formData.append('sourceId', sourceId)
  formData.append('file', file)
  if (categoryName) formData.append('categoryName', categoryName)
  return request({
    url: '/ticket/ai/document/import',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 知识文档列表 */
export function listAiDocuments(query?: AiDocumentQueryDTO): Promise<TableDataInfo<AiDocument>> {
  return request({ url: '/ticket/ai/documents', method: 'get', params: query })
}

/** 知识文档详情 */
export function getAiDocument(sourceId: string): Promise<AjaxResult<AiDocument>> {
  return request({ url: '/ticket/ai/documents/' + sourceId, method: 'get' })
}

/** 重导知识文档 */
export function reimportAiDocument(sourceId: string): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/documents/' + sourceId + '/reimport', method: 'put' })
}

/** 删除知识文档 */
export function deleteAiDocument(sourceId: string): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/documents/' + sourceId, method: 'delete' })
}

/** 同步已关闭工单历史 */
export function syncClosedTicketHistory(params?: { lastTicketId?: number; limit?: number }): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/history/sync', method: 'post', params })
}

/** 检索相似知识 */
export function getSimilarKnowledge(ticketId: number): Promise<AjaxResult<TicketAiAssist>> {
  return request({ url: '/ticket/ai/ticket/similar', method: 'post', params: { ticketId } })
}

/** 生成处理建议 */
export function getTicketAssist(ticketId: number, topK?: number): Promise<AjaxResult<TicketAiAssist>> {
  return request({ url: '/ticket/ai/ticket/assist', method: 'post', params: { ticketId, topK: topK || 5 } })
}

/** 获取分诊建议 v3.1 */
export function getTicketTriage(ticketId: number): Promise<AjaxResult<TicketAiTriage>> {
  return request({ url: '/ticket/ai/ticket/triage', method: 'post', params: { ticketId } })
}

/** 采纳分诊建议 */
export function applyTicketTriage(suggestionId: number, data: TicketTriageApplyDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/triage/' + suggestionId + '/apply', method: 'post', data })
}

/** 拒绝分诊建议 */
export function rejectTicketTriage(suggestionId: number): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/triage/' + suggestionId + '/reject', method: 'post' })
}
