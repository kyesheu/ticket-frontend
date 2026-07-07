import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { WorkflowDefinition, WorkflowQueryDTO, WorkflowFormDTO, WorkflowBindCategoryDTO } from '@/types/ticket/workflow'

/** 流程定义列表 */
export function listWorkflow(query?: WorkflowQueryDTO): Promise<TableDataInfo<WorkflowDefinition>> {
  return request({ url: '/ticket/workflow/list', method: 'get', params: query })
}

/** 流程定义详情 */
export function getWorkflow(id: number): Promise<AjaxResult<WorkflowDefinition>> {
  return request({ url: '/ticket/workflow/' + id, method: 'get' })
}

/** 创建草稿 */
export function createWorkflow(data: WorkflowFormDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow', method: 'post', data })
}

/** 编辑草稿 */
export function updateWorkflow(id: number, data: WorkflowFormDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/' + id, method: 'put', data })
}

/** 复制 */
export function copyWorkflow(id: number): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/' + id + '/copy', method: 'post' })
}

/** 发布 */
export function publishWorkflow(id: number): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/' + id + '/publish', method: 'put' })
}

/** 绑定分类 */
export function bindWorkflowCategory(data: WorkflowBindCategoryDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/workflow/bind-category', method: 'put', data })
}
