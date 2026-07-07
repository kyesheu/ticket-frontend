# v1.2 前端开发任务书 — 站内通知与满意度评价

## 文件

新增：
```text
src/types/ticket/notification.ts
src/types/ticket/satisfaction.ts
src/api/ticket/notification.ts
src/api/ticket/satisfaction.ts
src/views/ticket/notification/index.vue
```

修改：
```text
src/views/ticket/ticket/index.vue
```

## 页面

`src/views/ticket/notification/index.vue`

- 顶部显示未读数徽标
- 表格字段：类型、标题、内容摘要、时间、已读状态
- 支持单条已读 / 全部已读按钮
- 未读行高亮

`src/views/ticket/ticket/index.vue`

- CLOSED 状态工单，创建人可见「评价」入口
- 弹出 Dialog：星级评分（1-5）、文字评价（选填，最长 500）
- 已评价的工单展示评分和评价内容

## 权限

```text
ticket:notification:list
ticket:notification:read
ticket:satisfaction:add
ticket:satisfaction:query
ticket:satisfaction:list
ticket:satisfaction:statistics
```

## 字典

```text
ASSIGN=分派
PROCESS=处理
CLOSE=关闭
CANCEL=取消
COMMENT=评论
SLA_OVERDUE=SLA超时
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
