# v3.0 前端任务 — AI 知识库

## 文件

```text
src/types/ticket/ai.ts
src/api/ticket/ai.ts
src/views/ticket/knowledge/index.vue
src/views/ticket/knowledge/import.vue
src/views/ticket/ticket/index.vue
```

## API

```text
importDocument(sourceId, file)
listAiDocuments(query)
getAiDocument(sourceId)
syncClosedTicketHistory(params)
getSimilarKnowledge(ticketId)
getTicketAssist(ticketId, topK)
```

`similar`、`assist`、`history/sync` 用 query 参数。

## 页面

`src/views/ticket/knowledge/index.vue`

- 字段：标题、类型、状态、切片数、导入时间
- 操作：查看详情、导入文档

`src/views/ticket/knowledge/import.vue`

- 上传 TXT/MD/PDF
- 输入 sourceId
- 展示导入结果

`src/views/ticket/ticket/index.vue`

- 新增「AI 辅助」Tab
- 相似知识：调用 `/ticket/ai/ticket/similar?ticketId={ticketId}`
- 处理建议：调用 `/ticket/ai/ticket/assist?ticketId={ticketId}&topK=5`
- 展示 suggestion、replyDraft、sources、degraded/reason
- 支持复制 replyDraft 到评论框

## 权限

```text
ticket:ai:document:import
ticket:ai:document:list
ticket:ai:document:query
ticket:ai:history:sync
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
