import type { PageDomain } from '@/types/api/common'
import type { TicketPriority } from './ticket'

export type TicketSlaStatus = '0' | '1'
export type TicketSlaAlertType = 'RESPONSE' | 'RESOLVE'
export type TicketOverdueFlag = '0' | '1'

export interface TicketSlaPolicy {
  policyId: number
  priority: TicketPriority | string
  responseMinutes: number
  resolveMinutes: number
  status: TicketSlaStatus | string
  remark?: string
  createTime?: string
  updateTime?: string
}

export interface TicketSlaPolicyQueryDTO extends PageDomain {
  priority?: string
  status?: string
}

export interface TicketSlaPolicyForm {
  policyId?: number
  priority: TicketPriority | string
  responseMinutes: number
  resolveMinutes: number
  status: TicketSlaStatus | string
  remark?: string
}

export interface TicketSlaAlert {
  alertId: number
  ticketId?: number
  ticketNo?: string
  alertType: TicketSlaAlertType | string
  expireTime?: string
  createTime?: string
  priority?: TicketPriority | string
  title?: string
  responseDueAt?: string
  resolveDueAt?: string
  responseOverdue?: TicketOverdueFlag
  resolveOverdue?: TicketOverdueFlag
  remark?: string
}

export interface TicketSlaAlertQueryDTO extends PageDomain {
  ticketNo?: string
  alertType?: string
}

export const alertTypeOptions = [
  { label: '响应超时', value: 'RESPONSE' },
  { label: '解决超时', value: 'RESOLVE' },
]
