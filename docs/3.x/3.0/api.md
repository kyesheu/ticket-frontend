# v3.0 后端说明 — AI 知识库

配置：`ticket.ai.enabled=true`

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/ai/document/import` | `ticket:ai:document:import` | 导入知识文档，`multipart/form-data`，参数 `sourceId` 和 `file` |
| GET | `/ticket/ai/documents` | `ticket:ai:document:list` | 知识文档列表 |
| GET | `/ticket/ai/documents/{sourceId}` | `ticket:ai:document:query` | 知识文档详情 |
| POST | `/ticket/ai/history/sync` | `ticket:ai:history:sync` | 同步已关闭工单，query 参数 `lastTicketId`、`limit` |
| POST | `/ticket/ai/ticket/similar` | `ticket:ticket:query` | 检索相似知识，query 参数 `ticketId` |
| POST | `/ticket/ai/ticket/assist` | `ticket:ticket:query` | 生成处理建议和回复草稿，query 参数 `ticketId`、`topK` |

## Query 请求

```text
POST /ticket/ai/ticket/similar?ticketId=1
POST /ticket/ai/ticket/assist?ticketId=1&topK=5
POST /ticket/ai/history/sync?lastTicketId=0&limit=100
```

## 返回

```ts
{
  suggestion: string     // 处理建议（可含引用标注）
  replyDraft: string     // 回复草稿（可编辑）
  sources: Array<{
    sourceId: string
    sourceType: 'KNOWLEDGE' | 'HISTORY_TICKET'
    title: string
    snippet: string
  }>
  degraded: boolean      // 是否降级
  reason?: string        // 降级原因
}
```

## 权限

| 功能 | 权限 |
|------|------|
| 导入文档 | `ticket:ai:document:import` |
| 文档管理 | `ticket:ai:document:list/query` |
| 历史同步 | `ticket:ai:history:sync` |
| AI 辅助 | `ticket:ticket:query`（复用） |

## 规则

- AI 输出只作为建议，不自动评论、分派或改变状态
- 服务不可用时返回 `degraded: true`
