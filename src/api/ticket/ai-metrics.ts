import request from '@/utils/request'
import type { AjaxResult } from '@/types/api/common'
import type { AiMetricsSummary } from '@/types/ticket/ai-metrics'

export function getAiMetricsSummary(): Promise<AjaxResult<AiMetricsSummary>> {
  return request({ url: '/ticket/ai/metrics/summary', method: 'get' })
}
