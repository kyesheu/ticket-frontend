## 1. v1.0 接口

### TicketController

基础路径：

```text
/ticket
```

| 方法 | 路径                      | 权限                    | 说明       |
| ---- | ------------------------- | ----------------------- | ---------- |
| GET  | `/ticket/list`            | `ticket:ticket:list`    | 工单分页   |
| GET  | `/ticket/{id}`            | `ticket:ticket:query`   | 工单详情   |
| POST | `/ticket`                 | `ticket:ticket:add`     | 创建工单   |
| PUT  | `/ticket/{id}/assign`     | `ticket:ticket:assign`  | 分派       |
| PUT  | `/ticket/{id}/process`    | `ticket:ticket:process` | 处理       |
| PUT  | `/ticket/{id}/confirm`    | `ticket:ticket:confirm` | 确认并关闭 |
| PUT  | `/ticket/{id}/cancel`     | `ticket:ticket:cancel`  | 取消       |
| GET  | `/ticket/{ticketId}/logs` | `ticket:log:list`       | 操作日志   |

### TicketCommentController

基础路径：

```text
/ticket/{ticketId}/comment
```

| 方法 | 路径                         | 权限                  | 说明     |
| ---- | ---------------------------- | --------------------- | -------- |
| GET  | `/ticket/{ticketId}/comment` | `ticket:comment:list` | 评论列表 |
| POST | `/ticket/{ticketId}/comment` | `ticket:comment:add`  | 添加评论 |

### TicketCategoryController

用于前端 v1.0 分类管理和新增工单分类选择。

具体路径以 Controller 为准。

前端需要的能力：

```text
分类树
分类列表
分类详情
新增分类
修改分类
删除分类
```

## 2. 状态流转

```text
NEW → PROCESSING → WAIT_CONFIRM → CLOSED
NEW → CANCELLED
PROCESSING → CANCELLED
```

状态说明：

```text
NEW：待分派
PROCESSING：处理中
WAIT_CONFIRM：待确认
CLOSED：已关闭
CANCELLED：已取消
```

前端不单独做“关闭”按钮。

```text
WAIT_CONFIRM → confirm → CLOSED
```

## 3. 状态按钮规则

| 状态         | 可显示按钮 |
| ------------ | ---------- |
| NEW          | 分派、取消 |
| PROCESSING   | 处理、取消 |
| WAIT_CONFIRM | 确认       |
| CLOSED       | 无         |
| CANCELLED    | 无         |

按钮还必须叠加权限控制。

## 4. 权限标识

| 功能     | 权限                     |
| -------- | ------------------------ |
| 工单列表 | `ticket:ticket:list`     |
| 工单详情 | `ticket:ticket:query`    |
| 新增工单 | `ticket:ticket:add`      |
| 分派     | `ticket:ticket:assign`   |
| 处理     | `ticket:ticket:process`  |
| 确认     | `ticket:ticket:confirm`  |
| 取消     | `ticket:ticket:cancel`   |
| 评论列表 | `ticket:comment:list`    |
| 添加评论 | `ticket:comment:add`     |
| 操作日志 | `ticket:log:list`        |
| 分类列表 | `ticket:category:list`   |
| 分类详情 | `ticket:category:query`  |
| 新增分类 | `ticket:category:add`    |
| 修改分类 | `ticket:category:edit`   |
| 删除分类 | `ticket:category:remove` |

## 5. TicketVO

```ts
ticketId: number
ticketNo: string
title: string
content: string
categoryId?: number
categoryName?: string
priority: string
status: string
creatorId?: number
creatorName?: string
assigneeId?: number
assigneeName?: string
deptId?: number
deptName?: string
processedAt?: string
closedAt?: string
responseDueAt?: string
resolveDueAt?: string
responseOverdue?: boolean
resolveOverdue?: boolean
createTime?: string
updateTime?: string
remark?: string
comments?: TicketComment[]
logs?: TicketOperationLog[]
customFields?: any[]
```

## 6. TicketComment

```ts
commentId: number
ticketId: number
userId?: number
content: string
commentType: 'INTERNAL' | 'EXTERNAL'
userName?: string
createTime?: string
```

## 7. TicketOperationLog

```ts
logId: number
ticketId: number
operationType: 'CREATE' | 'ASSIGN' | 'PROCESS' | 'CONFIRM' | 'CANCEL'
fromStatus?: string
toStatus?: string
operatorId?: number
operatorName?: string
comment?: string
operateTime?: string
```