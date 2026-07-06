/** 分类树节点（供 tree-select 使用） */
export interface TicketCategoryTreeVO {
  id: number
  label: string
  children?: TicketCategoryTreeVO[]
}

/** 工单分类实体 */
export interface TicketCategory {
  categoryId?: number
  parentId?: number
  categoryName?: string
  ancestors?: string
  orderNum?: number
  workflowKey?: string
  status?: string
  createTime?: string
  updateTime?: string
  children?: TicketCategory[]
}

/** 分类查询参数 */
export interface TicketCategoryQueryDTO {
  categoryName?: string
  status?: string
}

/** 创建分类 */
export interface TicketCategoryCreateDTO {
  parentId?: number
  categoryName: string
  orderNum?: number
}

/** 修改分类 */
export interface TicketCategoryUpdateDTO {
  categoryId: number
  parentId?: number
  categoryName: string
  orderNum?: number
  status?: string
}
