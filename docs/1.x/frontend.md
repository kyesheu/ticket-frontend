# 1.x 前端实现

## v1.0 工单主流程

**文件：** `src/types/ticket/ticket.ts` `src/types/ticket/category.ts` `src/api/ticket/ticket.ts` `src/api/ticket/comment.ts` `src/api/ticket/category.ts` `src/views/ticket/ticket/index.vue` `src/views/ticket/category/index.vue` `sql/ticket_menu_v1.sql`

**工单页：** 列表（keyword/status/priority 查询，12 列 + 显隐控制）、新增（title 必填 content textarea categoryId 树选 priority 默认 MEDIUM）、详情 Drawer（详情/评论/操作日志三个 Tab）、分派/处理/确认关闭/取消。

**分类页：** 左树右表，增删改启用禁用。

**状态映射：** NEW→分派+取消 / PROCESSING→处理+取消 / WAIT_CONFIRM→确认 / CLOSED/CANCELLED→无

**权限：** `ticket:ticket:*` `ticket:comment:list/add` `ticket:log:list` `ticket:category:*`

---

## v1.1 SLA 时效管理

**新增：** `sla.ts` `sla-alert.ts` types/API/views + `sql/ticket_menu_v1.1.sql`
**修改：** `ticket/index.vue`

- SLA 策略页：优先级/响应时限/解决时限/状态，增删改启停
- SLA 告警页：工单编号/告警类型(RESPONSE/RESOLVE)/超时时间，详情 Drawer，手工扫描
- 工单列表增加响应截止/解决截止/响应超时/解决超时列

**权限：** `ticket:sla:*` `ticket:sla-alert:*`

---

## v1.2 站内通知与满意度评价

**新增：** `notification.ts` `satisfaction.ts` types/API + `notification/index.vue`
**修改：** `ticket/index.vue`

- 通知页：未读数徽标、类型/标题/内容摘要/时间/已读状态、未读行高亮、单条/全部已读
- 满意度评价：CLOSED 状态创建人可见评价，星级评分(1-5)+文字(≤500字)

**权限：** `ticket:notification:*` `ticket:satisfaction:*`

---

## v1.3 部门数据权限

**修改：** `store/modules/user.ts` `ticket/index.vue`

- userStore 增加 deptId 持久化
- 分派候选人下拉按 deptId 过滤，叠加后端 @DataScope

**验证：** `npx vue-tsc --noEmit` `npm run build:prod`
