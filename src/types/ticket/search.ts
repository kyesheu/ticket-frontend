/** 检索请求参数 */
export interface TicketSearchParams {
  keyword: string
  pageSize?: number
  searchAfter?: string
  filters?: {
    status?: string
    priority?: string
    categoryId?: number
  }
}

/** 检索结果项 */
export interface TicketSearchResult {
  ticketId: number
  ticketNo: string
  title: string
  content: string
  highlights: string[]
  _score: number
  searchAfter?: string
}

/** 检索响应 */
export interface TicketSearchResponse {
  total: number
  list: TicketSearchResult[]
  searchAfter?: string
}

/** 索引状态 */
export interface SearchIndexStatus {
  totalDocs: number
  pendingEvents: number
  rebuilding: boolean
  rebuildProgress: number
  lastRebuildTime?: string
}
