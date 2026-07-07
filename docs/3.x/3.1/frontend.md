# v3.1 前端任务 — AI 分诊

## 文件

```text
src/types/ticket/ai.ts
src/api/ticket/ai.ts
src/views/ticket/ticket/index.vue
```

## API

```text
getTicketTriage(ticketId)
applyTicketTriage(suggestionId, data)
rejectTicketTriage(suggestionId)

POST /ticket/ai/ticket/triage?ticketId={ticketId}
```

## 页面

- NEW 状态工单详情页展示「AI 分诊」按钮
- 展示建议内容：建议分类、优先级、处理人、置信度、理由、来源
- 采纳：允许改分类、优先级、处理人、备注；调用 apply；刷新详情
- 拒绝：调用 reject
- 降级：展示 degraded/reason，不影响人工分派

## 权限

```text
ticket:ticket:query   — 查看建议
ticket:ticket:assign  — 采纳/拒绝
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
