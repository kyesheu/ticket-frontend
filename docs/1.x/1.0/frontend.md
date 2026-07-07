# v1.0 前端任务 — 工单主流程

## 文件

```text
src/types/ticket/ticket.ts
src/types/ticket/category.ts
src/api/ticket/ticket.ts
src/api/ticket/comment.ts
src/api/ticket/category.ts
src/views/ticket/ticket/index.vue
src/views/ticket/category/index.vue
sql/ticket_menu_v1.sql
```

## 工单页

- 查询：keyword、status、priority。
- 表格：ticketNo、title、categoryName、priority、status、creatorName、assigneeName、createTime、操作。
- 新增：title 必填，content textarea，categoryId 树选，priority 默认 MEDIUM。
- 详情 Drawer：详情、评论、操作日志。
- 评论：列表、添加，commentType 默认 EXTERNAL。
- 日志：Timeline 展示 operationType、fromStatus、toStatus、operatorName、comment、operateTime。
- 操作：分派、处理、确认、取消。

## 分类页

- 左树右表。
- 字段：categoryId、parentId、categoryName、orderNum、status、createTime。
- 操作：新增、修改、删除、启用/禁用。

## 状态按钮

| 状态 | 按钮 |
|---|---|
| NEW | 分派、取消 |
| PROCESSING | 处理、取消 |
| WAIT_CONFIRM | 确认 |
| CLOSED | 无 |
| CANCELLED | 无 |

## 权限

```text
ticket:ticket:list
ticket:ticket:query
ticket:ticket:add
ticket:ticket:assign
ticket:ticket:process
ticket:ticket:confirm
ticket:ticket:cancel
ticket:comment:list
ticket:comment:add
ticket:log:list
ticket:category:list
ticket:category:query
ticket:category:add
ticket:category:edit
ticket:category:remove
```

## API

```text
listTicket getTicket createTicket assignTicket processTicket confirmTicket cancelTicket getTicketLogs
listComments addComment
listCategory getCategoryTree getCategory addCategory updateCategory delCategory
```

## 字典

```text
status: NEW PROCESSING WAIT_CONFIRM CLOSED CANCELLED
priority: LOW MEDIUM HIGH URGENT
```

## 不做

```text
附件 自定义字段 富文本 SLA 通知评价 流程引擎 全文检索 知识库 AI
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```

```text
创建 -> 分派 -> 处理 -> 确认关闭
创建 -> 取消
创建 -> 分派 -> 取消
列表、新增、详情、评论、日志、分类、状态按钮、权限按钮、刷新
```
