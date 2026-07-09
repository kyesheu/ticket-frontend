import request from '@/utils/request'
import type {
  TicketCategory,
  TicketCategoryTreeVO,
  TicketCategoryQueryDTO,
  TicketCategoryCreateDTO,
  TicketCategoryUpdateDTO,
} from '@/types/ticket/category'
import type { AjaxResult } from '@/types/api/common'

export function getKnowledgeCategoryTree(): Promise<AjaxResult<TicketCategoryTreeVO[]>> {
  return request({ url: '/ticket/knowledge/category/tree', method: 'get' })
}

export function listKnowledgeCategory(query?: TicketCategoryQueryDTO): Promise<AjaxResult<TicketCategory[]>> {
  return request({ url: '/ticket/knowledge/category/list', method: 'get', params: query })
}

export function getKnowledgeCategory(id: number): Promise<AjaxResult<TicketCategory>> {
  return request({ url: '/ticket/knowledge/category/' + id, method: 'get' })
}

export function addKnowledgeCategory(data: TicketCategoryCreateDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/knowledge/category', method: 'post', data })
}

export function updateKnowledgeCategory(data: TicketCategoryUpdateDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/knowledge/category', method: 'put', data })
}

export function delKnowledgeCategory(id: number): Promise<AjaxResult> {
  return request({ url: '/ticket/knowledge/category/' + id, method: 'delete' })
}
