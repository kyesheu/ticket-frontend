# v3.2 后端说明 — AI 运营与评测闭环

```text
PUT    /ticket/ai/documents/{sourceId}/reimport
DELETE /ticket/ai/documents/{sourceId}
POST   /ticket/ai/feedback
GET    /ticket/ai/feedback/ticket/{ticketId}
GET    /ticket/ai/feedback/statistics
GET    /ticket/ai/evaluation/cases
POST   /ticket/ai/evaluation/run
GET    /ticket/ai/evaluation/results
GET    /ticket/ai/metrics/summary
```

## 权限

```text
ticket:ai:document:edit
ticket:ai:document:remove
ticket:ai:feedback:add
ticket:ai:feedback:list
ticket:ai:feedback:statistics
ticket:ai:evaluation:list
ticket:ai:evaluation:run
ticket:ai:metrics:summary
```
