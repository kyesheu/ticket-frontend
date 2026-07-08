# 2.x 前端实现

## v2.0 动态流程引擎

**新增：** `workflow.ts` type + `workflow.ts` `workflow-task.ts` API + `workflow/definition/index.vue` `workflow/designer/index.vue` `task/index.vue`
**修改：** `ticket/index.vue` `ticket.ts`

- 流程定义页：列表+新建编辑+复制+发布+绑定分类
- 流程设计器：节点列表(START→审批/条件→END)+增删排序+属性面板(名称/类型/处理人分配/条件表达式)+保存草稿/发布
- 我的待办页：工单编号/标题/当前节点/状态+审批通过(确认Dialog)+退回(退回原因必填)
- 工单详情新增"流程进度"Tab(Timeline)，TicketVO 增加 currentNode/workflowId/workflowHistory

**权限：** `ticket:workflow:*` `ticket:workflow:task`

---

## v2.1 自定义字段

**新增：** `custom-field.ts` type + API + `custom-field/index.vue`
**修改：** `ticket/index.vue` `ticket.ts`

- 字段管理页：左分类树右字段列表，Dialog 增删编辑，fieldKey+fieldType 创建后不可改
- 创建工单：选分类后动态加载字段，按类型渲染控件(TEXT→input/NUMBER→input-number/DATE→date-picker/DATETIME→datetime-picker/SINGLE_SELECT→select/MULTI_SELECT→select multiple/BOOLEAN→switch)
- 工单详情：展示字段值快照

**权限：** `ticket:custom-field:*`

---

## v2.2 附件管理

**新增：** `attachment.ts` type + API
**修改：** `ticket/index.vue` `ticket.ts`

- 创建工单：el-upload 多文件上传(multipart)，50MB 限制，提交时附带 attachmentIds
- 工单详情新增"附件"Tab：文件名/大小/上传人/时间+下载(blob)+删除

**权限：** `ticket:attachment:*`

---

## v2.3 全文检索

**新增：** `search.ts` type + API + `search/index.vue` `search-admin/index.vue`

- 检索页：关键词+状态/优先级筛选，高亮结果列表，点击弹出工单详情 Drawer，search_after 无限加载
- 索引管理页：索引状态面板(文档总数/待处理事件/重建进度)，全量重建+进度轮询，重试失败事件

**权限：** `ticket:search:*`

**验证：** `npx vue-tsc --noEmit` `npm run build:prod`
