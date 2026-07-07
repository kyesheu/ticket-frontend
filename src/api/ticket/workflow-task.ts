import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { WorkflowTask, WorkflowTaskCompleteDTO, WorkflowTaskReturnDTO, WorkflowHistory } from '@/types/ticket/workflow'

/** 待办列表 */
export function listWorkflowTasks(): Promise<TableDataInfo<WorkflowTask>> {
  return request({ url: '/ticket/workflow/task/list', method: 'get' })
}

/** 待办详情 */
export function getWorkflowTask(id: number): Promise<AjaxResult<WorkflowTask>> {
  return request({ url: '/ticket/workflow/task/' + id, method: 'get' })
}

/** 完成任务 */
export function completeWorkflowTask(id: number, data: WorkflowTaskCompleteDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/task/' + id + '/complete', method: 'put', data })
}

/** 退回任务 */
export function returnWorkflowTask(id: number, data: WorkflowTaskReturnDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/task/' + id + '/return', method: 'put', data })
}

/** 取消流程实例 */
export function cancelWorkflowInstance(ticketId: number): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/task/ticket/' + ticketId + '/cancel', method: 'put' })
}

/** 终止流程实例 */
export function terminateWorkflowInstance(ticketId: number): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/task/ticket/' + ticketId + '/terminate', method: 'put' })
}
