import type { PageDomain } from '@/types/api/common'

/** 流程定义状态 */
export type WorkflowStatus = 'DRAFT' | 'PUBLISHED'

/** 节点类型 */
export type NodeType = 'START' | 'END' | 'APPROVAL' | 'CONDITION'

/** 处理人分配类型 */
export type AssignType = 'USER' | 'ROLE' | 'DEPT_LEADER' | 'CREATOR_LEADER' | 'INITIATOR'

/** 任务状态 */
export type TaskStatus = 'PENDING' | 'COMPLETED' | 'RETURNED' | 'CANCELLED' | 'TERMINATED'

/** 流程定义 */
export interface WorkflowDefinition {
  id: number
  name: string
  description?: string
  status: WorkflowStatus
  version?: number
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
  categoryId?: number
  categoryName?: string
  createBy?: string
  createTime?: string
  updateTime?: string
}

/** 流程节点 */
export interface WorkflowNode {
  id?: number
  nodeKey: string
  name: string
  type: NodeType
  assignType?: AssignType
  assignValue?: string
  positionX?: number
  positionY?: number
}

/** 流程连线 */
export interface WorkflowEdge {
  id?: number
  edgeKey: string
  sourceNodeKey: string
  targetNodeKey: string
  condition?: string
}

/** 流程定义查询 */
export interface WorkflowQueryDTO extends PageDomain {
  name?: string
  status?: string
}

/** 流程定义表单 */
export interface WorkflowFormDTO {
  name: string
  description?: string
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
}

/** 分类绑定 */
export interface WorkflowBindCategoryDTO {
  workflowId: number
  categoryId: number
}

/** 待办任务 */
export interface WorkflowTask {
  id: number
  ticketId: number
  ticketNo: string
  title?: string
  nodeName: string
  status: TaskStatus
  assigneeId?: number
  assigneeName?: string
  createTime?: string
  completeTime?: string
}

/** 任务操作 */
export interface WorkflowTaskCompleteDTO {
  comment?: string
  approved?: boolean
}

export interface WorkflowTaskReturnDTO {
  targetNodeKey: string
  comment?: string
}

/** 流程历史 */
export interface WorkflowHistory {
  id: number
  ticketId: number
  nodeName: string
  action: string
  operatorName?: string
  comment?: string
  createTime?: string
}

/** 字典选项 */
export const workflowStatusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '已发布', value: 'PUBLISHED' },
]

export const nodeTypeOptions = [
  { label: '开始', value: 'START' },
  { label: '结束', value: 'END' },
  { label: '人工审批', value: 'APPROVAL' },
  { label: '条件分支', value: 'CONDITION' },
]

export const assignTypeOptions = [
  { label: '指定用户', value: 'USER' },
  { label: '角色', value: 'ROLE' },
  { label: '部门负责人', value: 'DEPT_LEADER' },
  { label: '创建人上级', value: 'CREATOR_LEADER' },
  { label: '流程发起人', value: 'INITIATOR' },
]

export const taskStatusLabel = (status?: string): string => {
  const m: Record<string, string> = {
    PENDING: '待处理', COMPLETED: '已完成', RETURNED: '已退回', CANCELLED: '已取消', TERMINATED: '已终止',
  }
  return m[status || ''] || status || '-'
}
