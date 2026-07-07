# v1.2 后端说明文档 — 站内通知与满意度评价

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/notification/list` | `ticket:notification:list` | 我的通知列表 |
| GET | `/ticket/notification/unread-count` | `ticket:notification:list` | 未读数量 |
| PUT | `/ticket/notification/{id}/read` | `ticket:notification:read` | 单条已读 |
| PUT | `/ticket/notification/read-all` | `ticket:notification:read` | 全部已读 |
| POST | `/ticket/satisfaction/{ticketId}` | `ticket:satisfaction:add` | 提交评价（1-5分） |
| GET | `/ticket/satisfaction/ticket/{ticketId}` | `ticket:satisfaction:query` | 查看工单评价 |
| GET | `/ticket/satisfaction/list` | `ticket:satisfaction:list` | 评价列表（管理员） |
| GET | `/ticket/satisfaction/statistics` | `ticket:satisfaction:statistics` | 评价统计 |

## 权限

| 功能 | 权限 |
|------|------|
| 通知查看 | `ticket:notification:list` |
| 标记已读 | `ticket:notification:read` |
| 提交评价 | `ticket:satisfaction:add` |
| 查看评价 | `ticket:satisfaction:query` |
| 评价列表 | `ticket:satisfaction:list` |
| 评价统计 | `ticket:satisfaction:statistics` |

## 枚举

- ASSIGN、PROCESS、CLOSE、CANCEL、COMMENT、SLA_OVERDUE

## 规则

- 不给操作人本人发通知
- 仅工单创建人可评价，仅 CLOSED 状态可评价
- 评价不可修改或删除，内容最长 500 字
- 每人每个工单只能评价一次
