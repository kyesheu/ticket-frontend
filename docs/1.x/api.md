# 1.x API 参考

## v1.0 工单主流程

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/list` | `ticket:ticket:list` | 工单分页列表 |
| GET | `/ticket/{id}` | `ticket:ticket:query` | 工单详情（含评论和日志） |
| POST | `/ticket` | `ticket:ticket:add` | 创建工单 |
| PUT | `/ticket/{id}/assign` | `ticket:ticket:assign` | 分派工单 |
| PUT | `/ticket/{id}/process` | `ticket:ticket:process` | 处理工单 |
| PUT | `/ticket/{id}/confirm` | `ticket:ticket:confirm` | 确认关闭 |
| PUT | `/ticket/{id}/cancel` | `ticket:ticket:cancel` | 取消工单 |
| GET | `/ticket/{id}/logs` | `ticket:log:list` | 操作日志 |
| GET | `/ticket/comment/list` | `ticket:comment:list` | 评论列表 |
| POST | `/ticket/comment` | `ticket:comment:add` | 添加评论 |
| GET | `/ticket/category/tree` | `ticket:category:list` | 分类树 |
| GET | `/ticket/category/list` | `ticket:category:list` | 分类列表 |
| GET | `/ticket/category/{id}` | `ticket:category:query` | 分类详情 |
| POST | `/ticket/category` | `ticket:category:add` | 新增分类 |
| PUT | `/ticket/category` | `ticket:category:edit` | 修改分类 |
| DELETE | `/ticket/category/{id}` | `ticket:category:remove` | 删除分类 |

## v1.1 SLA 时效管理

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/sla/list` | `ticket:sla:list` | 策略列表 |
| GET | `/ticket/sla/{policyId}` | `ticket:sla:query` | 策略详情 |
| POST | `/ticket/sla` | `ticket:sla:add` | 新增策略 |
| PUT | `/ticket/sla/{policyId}` | `ticket:sla:edit` | 修改策略 |
| GET | `/ticket/sla-alert/list` | `ticket:sla-alert:list` | 告警列表 |
| GET | `/ticket/sla-alert/{alertId}` | `ticket:sla-alert:query` | 告警详情 |
| POST | `/ticket/sla-alert/scan` | `ticket:sla-alert:scan` | 手工扫描 |

超时判断：`responseOverdue === '1' || resolveOverdue === '1'`。按 LOW/MEDIUM/HIGH/URGENT 四种优先级分别配置响应和解决时限（分钟）。

## v1.2 站内通知与满意度评价

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/notification/list` | `ticket:notification:list` | 我的通知列表 |
| GET | `/ticket/notification/unread-count` | `ticket:notification:list` | 未读数量 |
| PUT | `/ticket/notification/{id}/read` | `ticket:notification:read` | 单条已读 |
| PUT | `/ticket/notification/read-all` | `ticket:notification:read` | 全部已读 |
| POST | `/ticket/satisfaction/{ticketId}` | `ticket:satisfaction:add` | 提交评价（1-5分） |
| GET | `/ticket/satisfaction/ticket/{ticketId}` | `ticket:satisfaction:query` | 查看评价 |
| GET | `/ticket/satisfaction/list` | `ticket:satisfaction:list` | 评价列表 |
| GET | `/ticket/satisfaction/statistics` | `ticket:satisfaction:statistics` | 评价统计 |

通知类型枚举：ASSIGN PROCESS CLOSE CANCEL COMMENT SLA_OVERDUE。仅工单创建人可评价，仅 CLOSED 状态可评价，每人每工单一次。

## v1.3 部门数据权限

不新增接口。v1.0 列表和详情查询叠加 RuoYi `@DataScope` 拦截：全部、自定义部门、本部门、本部门及以下、仅本人。多角色取并集。无权限返回"工单不存在"。
