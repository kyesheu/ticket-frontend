export interface AiEvaluationCase {
  id: number
  title: string
  category: string
  expectedOutputType: string
  input?: string
  expectedOutput?: string
}

export interface AiEvaluationResult {
  id: number
  caseId: number
  passed: boolean
  score: number
  notes?: string
  runTime?: string
}
