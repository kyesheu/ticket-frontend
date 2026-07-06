import type { BaseEntity } from "../common";

/** 工单分类 */
export interface TicketCategory extends BaseEntity {
  /** 分类ID */
  categoryId?: number;
  /** 父分类ID */
  parentId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 祖级列表 */
  ancestors?: string;
  /** 排序号 */
  orderNum?: number;
  /** 关联流程标识 */
  workflowKey?: string;
  /** 子分类 */
  children?: TicketCategory[];
}

/** 分类树节点 */
export interface TicketCategoryTreeVO {
  /** 节点ID */
  id?: number;
  /** 节点名称 */
  label?: string;
  /** 子节点 */
  children?: TicketCategoryTreeVO[];
}

/** 分类查询参数 */
export interface TicketCategoryQueryDTO {
  /** 分类名称 */
  categoryName?: string;
  /** 状态 */
  status?: string;
}

/** 创建分类DTO */
export interface TicketCategoryCreateDTO {
  /** 父分类ID */
  parentId?: number;
  /** 分类名称 */
  categoryName: string;
  /** 排序号 */
  orderNum?: number;
}

/** 修改分类DTO */
export interface TicketCategoryUpdateDTO {
  /** 分类ID */
  categoryId: number;
  /** 父分类ID */
  parentId?: number;
  /** 分类名称 */
  categoryName: string;
  /** 排序号 */
  orderNum?: number;
}
