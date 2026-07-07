import type { PageDomain } from '@/types/api/common'

export type CustomFieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'BOOLEAN'

export const fieldTypeOptions = [
  { label: '文本', value: 'TEXT' },
  { label: '数字', value: 'NUMBER' },
  { label: '日期', value: 'DATE' },
  { label: '日期时间', value: 'DATETIME' },
  { label: '单选', value: 'SINGLE_SELECT' },
  { label: '多选', value: 'MULTI_SELECT' },
  { label: '布尔', value: 'BOOLEAN' },
]

export interface TicketCustomField {
  id: number
  fieldKey: string
  fieldName: string
  fieldType: CustomFieldType | string
  categoryId: number
  isRequired: boolean
  sortOrder: number
  options?: string
  status: '0' | '1' | string
  createTime?: string
  updateTime?: string
}

export interface TicketCustomFieldFormDTO {
  fieldKey: string
  fieldName: string
  fieldType: CustomFieldType | string
  categoryId: number
  isRequired?: boolean
  sortOrder?: number
  options?: string
  status?: string
}

export interface TicketCustomFieldQueryDTO extends PageDomain {
  categoryId?: number
  fieldName?: string
  status?: string
}

/** 创建表单时返回的字段定义 */
export interface TicketCustomFieldFormVO {
  fieldId?: number
  fieldKey: string
  fieldName: string
  fieldType: CustomFieldType | string
  isRequired: boolean
  sortOrder: number
  options?: string
}
