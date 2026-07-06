import request from '@/utils/request'
import type {
  TicketCategory,
  TicketCategoryTreeVO,
  TicketCategoryQueryDTO,
  TicketCategoryCreateDTO,
  TicketCategoryUpdateDTO,
} from '@/types/ticket/category'
import type { AjaxResult } from '@/types/api/common'

/** 分类树 */
export function getCategoryTree(): Promise<AjaxResult<TicketCategoryTreeVO[]>> {
  return request({
    url: '/ticket/category/tree',
    method: 'get',
  })
}

/** 分类列表（平铺） */
export function listCategory(query?: TicketCategoryQueryDTO): Promise<AjaxResult<TicketCategory[]>> {
  return request({
    url: '/ticket/category/list',
    method: 'get',
    params: query,
  })
}

/** 分类详情 */
export function getCategory(id: number): Promise<AjaxResult<TicketCategory>> {
  return request({
    url: '/ticket/category/' + id,
    method: 'get',
  })
}

/** 新增分类 */
export function addCategory(data: TicketCategoryCreateDTO): Promise<AjaxResult> {
  return request({
    url: '/ticket/category',
    method: 'post',
    data,
  })
}

/** 修改分类 */
export function updateCategory(data: TicketCategoryUpdateDTO): Promise<AjaxResult> {
  return request({
    url: '/ticket/category',
    method: 'put',
    data,
  })
}

/** 删除分类 */
export function delCategory(id: number): Promise<AjaxResult> {
  return request({
    url: '/ticket/category/' + id,
    method: 'delete',
  })
}
