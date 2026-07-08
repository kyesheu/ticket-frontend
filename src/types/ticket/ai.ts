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
  status: string
  chunkCount: number
  summary?: string
  lastImportedAt?: string
  lastImportResult?: string
  failureReasonSummary?: string
  type?: string
  importTime?: string
  createTime?: string
}

/** 知识文档查询 */
export interface AiDocumentQueryDTO extends PageDomain {
  title?: string
  type?: string
}

/** AI 分诊建议 v3.1 */
export interface TicketAiTriage {
  suggestionId: number
  suggestedCategoryId?: number
  suggestedCategoryName?: string
  suggestedPriority?: string
  suggestedAssigneeId?: number
  suggestedAssigneeName?: string
  confidence: number
  reasoning: string
  sources: AiSource[]
  degraded: boolean
  reason?: string
}

/** 采纳分诊建议参数 */
export interface TicketTriageApplyDTO {
  categoryId?: number
  priority?: string
  assigneeId: number
  comment?: string
}
