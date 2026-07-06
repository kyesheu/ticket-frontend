/** 分类树节点（供 tree-select 使用） */
export interface TicketCategoryTreeVO {
  id: number
  label: string
  children?: TicketCategoryTreeVO[]
}
