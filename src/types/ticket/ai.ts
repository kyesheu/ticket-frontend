import type { PageDomain } from '@/types/api/common'

/** 知识来源类型 */
export type AiSourceType = 'KNOWLEDGE' | 'HISTORY_TICKET'

/** 知识来源 */
export interface AiSource {
  sourceId: string
  sourceType: AiSourceType | string
  title: string
  snippet: string
}

/** AI 辅助结果 */
export interface TicketAiAssist {
  suggestion: string
  replyDraft: string
  sources: AiSource[]
  degraded: boolean
  reason?: string
}

/** 知识文档 */
export interface AiDocument {
  sourceId: string
  title: string
  type: string
  status: string
  chunkCount: number
  importTime?: string
  createTime?: string
}

/** 知识文档查询 */
export interface AiDocumentQueryDTO extends PageDomain {
  title?: string
  type?: string
}
