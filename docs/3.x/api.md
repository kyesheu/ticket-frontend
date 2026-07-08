# 3.x API 参考

前置条件：`ticket.ai.enabled=true`。前端只调 Java 后端，不直调 Python AI 服务。

## v3.0 AI 知识库

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/ai/document/import` | `ticket:ai:document:import` | 导入知识文档（multipart，sourceId + file） |
| GET | `/ticket/ai/documents` | `ticket:ai:document:list` | 知识文档列表 |
| GET | `/ticket/ai/documents/{sourceId}` | `ticket:ai:document:query` | 知识文档详情 |
| POST | `/ticket/ai/history/sync` | `ticket:ai:history:sync` | 同步已关闭工单（query: lastTicketId, limit） |
| POST | `/ticket/ai/ticket/similar` | `ticket:ticket:query` | 检索相似知识（query: ticketId） |
| POST | `/ticket/ai/ticket/assist` | `ticket:ticket:query` | 生成处理建议（query: ticketId, topK） |

similar、assist、history/sync 用 query 参数。返回 suggestion/replyDraft/sources/degraded/reason。AI 输出只作为建议，不自动评论、分派或改变状态。

## v3.1 AI 分诊

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/ai/ticket/triage` | `ticket:ticket:query` | 生成分诊建议（query: ticketId） |
| POST | `/ticket/ai/triage/{id}/apply` | `ticket:ticket:assign` | 采纳建议（body: categoryId/priority/assigneeId/comment） |
| POST | `/ticket/ai/triage/{id}/reject` | `ticket:ticket:assign` | 拒绝建议 |

triage 用 query 参数。采纳时重新校验工单状态和候选人有效性。不可重复采纳或拒绝。

## v3.2 AI 运营与评测

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| PUT | `/ticket/ai/documents/{sourceId}/reimport` | `ticket:ai:document:import` | 重导文档 |
| DELETE | `/ticket/ai/documents/{sourceId}` | `ticket:ai:document:import` | 删除文档 |
| POST | `/ticket/ai/feedback` | `ticket:ai:feedback:submit` | 提交反馈 |
| GET | `/ticket/ai/feedback/list` | `ticket:ai:feedback:list` | 反馈列表 |
| GET | `/ticket/ai/feedback/ticket/{ticketId}` | `ticket:ai:feedback:list` | 工单反馈 |
| GET | `/ticket/ai/feedback/statistics` | `ticket:ai:feedback:statistics` | 反馈统计 |
| GET | `/ticket/ai/evaluation/cases` | `ticket:ai:evaluation:list` | 评测用例 |
| POST | `/ticket/ai/evaluation/run` | `ticket:ai:evaluation:run` | 执行评测 |
| GET | `/ticket/ai/evaluation/results` | `ticket:ai:evaluation:list` | 评测结果 |
| GET | `/ticket/ai/metrics/summary` | `ticket:ai:metrics:view` | 指标摘要 |

## v3.3 收尾

无新接口。运维端点：`GET /actuator/health/liveness` `GET /actuator/health/readiness` `GET /actuator/prometheus`
