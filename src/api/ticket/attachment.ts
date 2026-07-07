import request from '@/utils/request'
import type { AjaxResult } from '@/types/api/common'
import type { TicketAttachment } from '@/types/ticket/attachment'

/** 上传附件 */
export function uploadAttachment(formData: FormData): Promise<AjaxResult<TicketAttachment>> {
  return request({
    url: '/ticket/attachment/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 工单附件列表 */
export function listAttachments(ticketId: number): Promise<AjaxResult<TicketAttachment[]>> {
  return request({ url: '/ticket/attachment/ticket/' + ticketId, method: 'get' })
}

/** 下载附件 */
export function downloadAttachment(id: number): Promise<any> {
  return request({
    url: '/ticket/attachment/' + id + '/download',
    method: 'get',
    responseType: 'blob',
  })
}

/** 删除附件 */
export function deleteAttachment(id: number): Promise<AjaxResult> {
  return request({ url: '/ticket/attachment/' + id, method: 'delete' })
}
