# v1.1 前端开发任务书 — SLA 时效管理

## 文件

新增：
```text
src/types/ticket/sla.ts
src/api/ticket/sla.ts
src/api/ticket/sla-alert.ts
src/views/ticket/sla/index.vue
src/views/ticket/sla-alert/index.vue
```

修改：
```text
src/views/ticket/ticket/index.vue
sql/ticket_menu_v1.1.sql
```

## API

```text
listSlaPolicy()
getSlaPolicy(policyId)
addSlaPolicy(data)
updateSlaPolicy(policyId, data)

listSlaAlert(query)
getSlaAlert(alertId)
scanSlaAlert()
```

## 页面

`src/views/ticket/sla/index.vue`

- 表格字段：优先级、响应时限（分钟）、解决时限（分钟）、状态、创建时间
- 表单 Dialog：优先级下拉、响应时限数字、解决时限数字、启用开关
- 操作：新增、编辑、启用/停用

`src/views/ticket/sla-alert/index.vue`

- 表格字段：工单编号、告警类型（RESPONSE/RESOLVE）、超时时间、创建时间
- 操作：查看详情、手工扫描
- 支持查看详情

`src/views/ticket/ticket/index.vue`

- 列表增加响应截止、解决截止、响应超时、解决超时展示。
- `responseOverdue` / `resolveOverdue` 按 `'1'` 判断超时，不按 boolean 判断。
- 详情 Drawer 展示 SLA 截止时间和超时状态。

## 权限

```text
ticket:sla:list
ticket:sla:query
ticket:sla:add
ticket:sla:edit
ticket:sla-alert:list
ticket:sla-alert:query
ticket:sla-alert:scan
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
