import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { TicketCustomField, TicketCustomFieldFormDTO, TicketCustomFieldFormVO } from '@/types/ticket/custom-field'

/** 创建表单字段（按分类获取） */
export function getCustomFieldForm(categoryId: number): Promise<AjaxResult<TicketCustomFieldFormVO[]>> {
  return request({ url: '/ticket/custom-field/form/' + categoryId, method: 'get' })
}

/** 字段列表 */
export function listCustomField(categoryId: number): Promise<AjaxResult<TicketCustomField[]>> {
  return request({ url: '/ticket/custom-field/list/' + categoryId, method: 'get' })
}

/** 字段详情 */
export function getCustomField(id: number): Promise<AjaxResult<TicketCustomField>> {
  return request({ url: '/ticket/custom-field/' + id, method: 'get' })
}

/** 新增字段 */
export function addCustomField(data: TicketCustomFieldFormDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/custom-field', method: 'post', data })
}

/** 编辑字段 */
export function updateCustomField(id: number, data: TicketCustomFieldFormDTO): Promise<AjaxResult> {
  return request({ url: '/ticket/custom-field/' + id, method: 'put', data })
}
