# v3.2 前端任务 — AI 运营与评测闭环

## 新增

```text
src/types/ticket/ai-feedback.ts
src/types/ticket/ai-evaluation.ts
src/types/ticket/ai-metrics.ts
src/api/ticket/ai-feedback.ts
src/api/ticket/ai-evaluation.ts
src/api/ticket/ai-metrics.ts
src/views/ticket/ai/feedback/index.vue
src/views/ticket/ai/evaluation/index.vue
src/views/ticket/ai/metrics/index.vue
```

## 修改

```text
src/views/ticket/knowledge/index.vue
src/views/ticket/ticket/index.vue
```

## 功能

- 知识文档支持重导、删除。
- 工单 AI 辅助和 AI 分诊支持有用/无用反馈。
- AI 反馈页展示统计，并按工单查询反馈列表。
- AI 评测页展示固定评测集、运行评测、查看结果。
- AI 指标页展示反馈与分诊运营摘要。
