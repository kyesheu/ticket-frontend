import request from '@/utils/request'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'
import type { AjaxResult } from '@/types/api/common'

/** 分类树 */
export function getCategoryTree(): Promise<AjaxResult<TicketCategoryTreeVO[]>> {
  return request({
    url: '/ticket/category/tree',
    method: 'get',
  })
}
