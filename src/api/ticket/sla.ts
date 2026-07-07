import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { TicketSlaPolicy, TicketSlaPolicyForm, TicketSlaPolicyQueryDTO } from '@/types/ticket/sla'

/** SLA 策略分页列表 */
export function listSlaPolicy(query?: TicketSlaPolicyQueryDTO): Promise<TableDataInfo<TicketSlaPolicy>> {
  return request({
    url: '/ticket/sla/list',
    method: 'get',
    params: query,
  })
}

/** SLA 策略详情 */
export function getSlaPolicy(policyId: number): Promise<AjaxResult<TicketSlaPolicy>> {
  return request({
    url: '/ticket/sla/' + policyId,
    method: 'get',
  })
}

/** 新增 SLA 策略 */
export function addSlaPolicy(data: TicketSlaPolicyForm): Promise<AjaxResult> {
  return request({
    url: '/ticket/sla',
    method: 'post',
    data,
  })
}

/** 修改 SLA 策略 */
export function updateSlaPolicy(policyId: number, data: TicketSlaPolicyForm): Promise<AjaxResult> {
  return request({
    url: '/ticket/sla/' + policyId,
    method: 'put',
    data,
  })
}
