/** 附件信息 */
export interface TicketAttachment {
  attachmentId: number
  ticketId?: number
  fileName?: string
  originalName?: string
  fileExtension: string
  fileSize: number
  mimeType?: string
  contentType?: string
  uploaderId?: number
  uploaderName?: string
  createTime?: string
}

/** 文件大小格式化 */
export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
  return size.toFixed(i === 0 ? 0 : 1) + ' ' + units[i]
}
