import request from '@/utils/request'
import type { AjaxResult, TableDataInfo } from '@/types/api/common'
import type { TicketSlaAlert, TicketSlaAlertQueryDTO } from '@/types/ticket/sla'

/** SLA 告警分页列表 */
export function listSlaAlert(query?: TicketSlaAlertQueryDTO): Promise<TableDataInfo<TicketSlaAlert>> {
  return request({
    url: '/ticket/sla-alert/list',
    method: 'get',
    params: query,
  })
}

/** SLA 告警详情 */
export function getSlaAlert(alertId: number): Promise<AjaxResult<TicketSlaAlert>> {
  return request({
    url: '/ticket/sla-alert/' + alertId,
    method: 'get',
  })
}

/** 手工扫描 SLA 告警 */
export function scanSlaAlert(): Promise<AjaxResult> {
  return request({
    url: '/ticket/sla-alert/scan',
    method: 'post',
  })
}
