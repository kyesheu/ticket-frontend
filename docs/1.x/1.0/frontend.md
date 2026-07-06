# v1.0.md

## 1. 目标

实现工单系统 v1.0 前端。

覆盖：

```text
工单主流程
评论
操作日志
分类管理
菜单权限
构建验收
```

主流程：

```text
创建工单 → 分派工单 → 处理工单 → 确认关闭
```

取消流程：

```text
创建工单 → 取消工单
创建工单 → 分派工单 → 取消工单
```

## 2. 技术约束

```text
Vue 3
TypeScript
Element Plus
@/utils/request
pagination
right-toolbar
v-hasPermi
parseTime
```

参考页面：

```text
src/views/system/user/index.vue
src/views/system/dept/index.vue
```

不引入新 UI 库。

## 3. 文件范围

新建：

```text
src/types/ticket/ticket.ts
src/types/ticket/category.ts
src/api/ticket/ticket.ts
src/api/ticket/comment.ts
src/api/ticket/category.ts
```

重写：

```text
src/views/ticket/ticket/index.vue
src/views/ticket/category/index.vue
```

新增或整理：

```text
sql/ticket_menu_v1.sql
```

## 4. v1.0-A：工单主流程页面

页面：

```text
src/views/ticket/ticket/index.vue
```

实现：

```text
工单列表
查询
新增工单
详情 Drawer
评论 Tab
操作日志 Tab
分派 Dialog
处理 Dialog
确认 Dialog
取消 Dialog
按钮权限控制
按钮状态控制
```

### 查询区

字段：

```text
keyword
status
priority
```

按钮：

```text
搜索
重置
```

### 表格字段

```text
ticketNo
title
categoryName
priority
status
creatorName
assigneeName
createTime
操作
```

要求：

```text
title 点击打开详情 Drawer
priority 用 el-tag
status 用 el-tag
createTime 用 parseTime
操作按钮按状态和权限显示
```

### 新增工单 Dialog

字段：

```text
title：必填
content：textarea
categoryId：树选择
priority：下拉，默认 MEDIUM
```

不使用富文本 Editor。

### 详情 Drawer

Tab：

```text
详情
评论
操作日志
```

详情展示：

```text
工单编号
标题
内容
分类
优先级
状态
创建人
处理人
创建时间
更新时间
响应截止时间
解决截止时间
```

评论功能：

```text
评论列表
添加评论输入框
添加评论按钮
commentType 默认 EXTERNAL
```

操作日志：

```text
使用 Timeline 展示 operationType、fromStatus、toStatus、operatorName、comment、operateTime
```

### 状态操作

分派：

```text
assigneeId：必填，复用 listUser 下拉
comment：可选
PUT /ticket/{id}/assign
```

处理：

```text
comment：必填
PUT /ticket/{id}/process
```

确认：

```text
comment：可选
PUT /ticket/{id}/confirm
```

取消：

```text
comment：必填
PUT /ticket/{id}/cancel
```

### 按钮规则

| 状态         | 按钮       |
| ------------ | ---------- |
| NEW          | 分派、取消 |
| PROCESSING   | 处理、取消 |
| WAIT_CONFIRM | 确认       |
| CLOSED       | 无         |
| CANCELLED    | 无         |

权限：

| 按钮     | 权限                    |
| -------- | ----------------------- |
| 新增     | `ticket:ticket:add`     |
| 查看     | `ticket:ticket:query`   |
| 分派     | `ticket:ticket:assign`  |
| 处理     | `ticket:ticket:process` |
| 确认     | `ticket:ticket:confirm` |
| 取消     | `ticket:ticket:cancel`  |
| 添加评论 | `ticket:comment:add`    |

## 5. v1.0-B：分类管理页面

页面：

```text
src/views/ticket/category/index.vue
```

实现：

```text
分类树
分类列表
新增分类
修改分类
删除分类
启用 / 禁用
排序号
父级分类选择
```

布局：

```text
左侧分类树
右侧分类表格
分类表单 Dialog
```

字段：

```text
categoryId
parentId
categoryName
orderNum
status
createTime
```

权限：

| 功能     | 权限                     |
| -------- | ------------------------ |
| 分类列表 | `ticket:category:list`   |
| 分类详情 | `ticket:category:query`  |
| 新增分类 | `ticket:category:add`    |
| 修改分类 | `ticket:category:edit`   |
| 删除分类 | `ticket:category:remove` |

## 6. v1.0-C：菜单和权限

新增菜单 SQL：

```text
sql/ticket_menu_v1.sql
```

菜单结构：

```text
工单管理
├── 工单列表
└── 分类管理
```

前端组件路径：

```text
ticket/ticket/index
ticket/category/index
```

权限按钮：

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

## 7. 类型定义

### ticket.ts

```ts
export interface TicketVO
export interface TicketQueryDTO
export interface TicketCreateDTO
export interface TicketAssignDTO
export interface TicketProcessDTO
export interface TicketConfirmDTO
export interface TicketCancelDTO
export interface TicketComment
export interface TicketCommentCreateDTO
export interface TicketOperationLog
```

### category.ts

```ts
export interface TicketCategory
export interface TicketCategoryTreeVO
export interface TicketCategoryCreateDTO
export interface TicketCategoryUpdateDTO
```

要求：

```text
使用 .ts
显式 export
API 使用 import type
不要大面积 any
```

## 8. API 模块

### ticket.ts

```ts
listTicket(query)
getTicket(id)
createTicket(data)
assignTicket(id, data)
processTicket(id, data)
confirmTicket(id, data)
cancelTicket(id, data)
getTicketLogs(ticketId)
```

### comment.ts

```ts
listComments(ticketId)
addComment(ticketId, data)
```

### category.ts

```ts
listCategory(query)
getCategoryTree()
getCategory(id)
addCategory(data)
updateCategory(data)
delCategory(id)
```

## 9. 字典

### 状态

```ts
const statusOptions = [
  { label: '待分派', value: 'NEW' },
  { label: '处理中', value: 'PROCESSING' },
  { label: '待确认', value: 'WAIT_CONFIRM' },
  { label: '已关闭', value: 'CLOSED' },
  { label: '已取消', value: 'CANCELLED' }
]
```

### 优先级

```ts
const priorityOptions = [
  { label: '低', value: 'LOW' },
  { label: '中', value: 'MEDIUM' },
  { label: '高', value: 'HIGH' },
  { label: '紧急', value: 'URGENT' }
]
```

## 10. 不实现内容

```text
附件上传
自定义字段
富文本
SLA
通知评价
流程引擎
全文检索
知识库
AI 建议
AI 草稿
AI 分诊
AI 统计
```

## 11. 实施顺序

```text
1. types
2. API
3. 工单列表页
4. 工单详情 Drawer
5. 工单状态操作
6. 评论
7. 操作日志
8. 分类管理页
9. 菜单 SQL
10. 类型检查
11. 构建
12. 手工验收
```

## 12. 验证命令

```bash
npx vue-tsc --noEmit
npm run build:prod
```

## 13. 验收标准

工单流程：

```text
创建 → 分派 → 处理 → 确认关闭
创建 → 取消
创建 → 分派 → 取消
```

页面：

```text
工单列表可查
工单可新增
详情可查看
评论可添加
日志可查看
分类可管理
状态按钮正确
权限按钮正确
操作后自动刷新
```

构建：

```text
vue-tsc 通过
build:prod 通过
```

## 14. 执行要求

```text
不猜接口路径
不做 v2.x / v3.x 功能
不加富文本
不做附件
不做 AI 页面
不改后端业务逻辑
不引入新 UI 库
类型问题优先修类型
完成后必须跑 vue-tsc 和 build
```