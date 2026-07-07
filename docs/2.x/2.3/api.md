# v2.3 后端说明 — 全文检索

配置：`ticket.search.enabled=true`

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/search` | `ticket:search:query` | 全文检索工单 |
| POST | `/ticket/search/rebuild` | `ticket:search:rebuild` | 触发索引全量重建 |
| GET | `/ticket/search/rebuild` | `ticket:search:rebuild` | 查询重建进度 |
| POST | `/ticket/search/events/retry` | `ticket:search:retry` | 重试失败事件 |

## 参数

```ts
keyword: string          // 检索关键词
pageSize?: number        // 页大小，最大 100
searchAfter?: string     // search_after 游标
filters?: {              // 组合过滤
  status?: string
  priority?: string
  categoryId?: number
}
```

## 返回

```ts
ticketId: number
ticketNo: string
title: string
content: string          // 高亮片段
highlights: string[]     // 匹配高亮
_score: number
searchAfter?: string     // 下一页游标
```

## 权限

| 功能 | 权限 |
|------|------|
| 检索 | `ticket:search:query` |
| 索引重建 | `ticket:search:rebuild` |
| 事件重试 | `ticket:search:retry` |

## 规则

- ES 故障不影响工单写入和普通列表
- 检索结果叠加数据权限过滤
