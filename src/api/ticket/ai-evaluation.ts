import request from '@/utils/request'
import type { AjaxResult } from '@/types/api/common'
import type { AiEvaluationCase, AiEvaluationResult } from '@/types/ticket/ai-evaluation'

export function getEvaluationCases(): Promise<AjaxResult<AiEvaluationCase[]>> {
  return request({ url: '/ticket/ai/evaluation/cases', method: 'get' })
}

export function runEvaluation(): Promise<AjaxResult> {
  return request({ url: '/ticket/ai/evaluation/run', method: 'post' })
}

export function getEvaluationResults(): Promise<AjaxResult<AiEvaluationResult[]>> {
  return request({ url: '/ticket/ai/evaluation/results', method: 'get' })
}
