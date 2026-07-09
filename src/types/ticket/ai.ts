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

/** AI 前置问答请求 */
export interface TicketAiAskDTO {
  question: string
  category?: string
  topK?: number
}

/** AI 前置问答结果 */
export interface TicketAiQuestionAnswer {
  sessionId?: number
  answer: string
  suggestion: string
  confidence: number
  needHuman: boolean
  sources: AiSource[]
  degraded: boolean
  reason?: string
}

/** AI 转人工建单请求 */
export interface TicketAiEscalateDTO {
  sessionId?: number
  question: string
  aiAnswer?: string
  aiSuggestion?: string
  userComment?: string
  categoryId: number
  categoryName?: string
  priority?: string
  attachmentIds?: number[]
}

/** AI 转人工建单结果 */
export interface TicketAiEscalateResult {
  ticketId: number
  autoAssigned: boolean
  dispatchReason: string
  triage?: TicketAiTriage
}

/** 知识文档 */
export interface AiDocument {
  sourceId: string
  title: string
  categoryName?: string
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
  categoryName?: string
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
