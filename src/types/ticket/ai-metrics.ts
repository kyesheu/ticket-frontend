export interface AiMetricsSummary {
  totalRequests: number
  avgLatencyMs: number
  successRate: number
  activeModels: number
  recentRequests?: AiMetricsRequest[]
}

export interface AiMetricsRequest {
  timestamp: string
  endpoint: string
  latencyMs: number
  success: boolean
}
