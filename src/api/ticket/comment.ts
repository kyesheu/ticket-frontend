import request from '@/utils/request'
import type { TicketComment, TicketCommentCreateDTO } from '@/types/ticket/ticket'
import type { AjaxResult } from '@/types/api/common'

/** 评论列表 */
export function listComments(ticketId: number): Promise<AjaxResult<TicketComment[]>> {
  return request({
    url: `/ticket/${ticketId}/comment`,
    method: 'get',
  })
}

/** 添加评论 */
export function addComment(ticketId: number, data: TicketCommentCreateDTO): Promise<AjaxResult> {
  return request({
    url: `/ticket/${ticketId}/comment`,
    method: 'post',
    data,
  })
}
