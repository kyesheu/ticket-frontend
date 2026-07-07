# v3.1 后端说明 — AI 分诊

配置：`ticket.ai.enabled=true`

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/ai/ticket/triage` | `ticket:ticket:query` | 生成分诊建议，query 参数 `ticketId` |
| POST | `/ticket/ai/triage/{suggestionId}/apply` | `ticket:ticket:assign` | 采纳分诊建议，JSON body |
| POST | `/ticket/ai/triage/{suggestionId}/reject` | `ticket:ticket:assign` | 拒绝分诊建议 |

## Query 请求

```text
POST /ticket/ai/ticket/triage?ticketId=1
```

## 采纳 body

```ts
{
  categoryId?: number
  priority?: string
  assigneeId: number
  comment?: string
}
```

## 返回

```ts
{
  suggestionId: number
  suggestedCategoryId?: number
  suggestedCategoryName?: string
  suggestedPriority?: string
  suggestedAssigneeId?: number
  suggestedAssigneeName?: string
  confidence: number        // 置信度 0-1
  reasoning: string         // 理由
  sources: Array<{
    sourceId: string
    title: string
    snippet: string
  }>
  degraded: boolean
  reason?: string
}
```

## 规则

- 采纳时重新校验工单状态和候选人有效性
- 建议生成后工单已变化 → 拒绝过期确认
- 不可重复采纳或拒绝同一建议
