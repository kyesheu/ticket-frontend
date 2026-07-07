# v2.0 后端说明 — 动态流程

## 接口

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| GET | `/ticket/workflow/list` | `ticket:workflow:list` | 流程定义列表 |
| GET | `/ticket/workflow/{id}` | `ticket:workflow:query` | 流程定义详情 |
| POST | `/ticket/workflow` | `ticket:workflow:add` | 创建草稿 |
| PUT | `/ticket/workflow/{id}` | `ticket:workflow:edit` | 编辑草稿 |
| POST | `/ticket/workflow/{id}/copy` | `ticket:workflow:add` | 复制版本 |
| PUT | `/ticket/workflow/{id}/publish` | `ticket:workflow:publish` | 发布 |
| PUT | `/ticket/workflow/bind-category` | `ticket:workflow:edit` | 绑定分类 |
| GET | `/ticket/workflow/task/list` | `ticket:workflow:task` | 待办列表 |
| GET | `/ticket/workflow/task/{id}` | `ticket:workflow:task` | 待办详情 |
| PUT | `/ticket/workflow/task/{id}/complete` | `ticket:workflow:task` | 完成 |
| PUT | `/ticket/workflow/task/{id}/return` | `ticket:workflow:task` | 退回 |
| PUT | `/ticket/workflow/task/ticket/{ticketId}/cancel` | `ticket:workflow:task` | 取消实例 |
| PUT | `/ticket/workflow/task/ticket/{ticketId}/terminate` | `ticket:workflow:publish` | 终止实例 |

## 枚举

- 节点：开始、结束、人工审批、条件分支
- 处理人：指定用户、角色、部门负责人、创建人上级、流程发起人
- 任务状态：PENDING、COMPLETED、RETURNED、CANCELLED、TERMINATED

## 规则

- 草稿可编辑，发布后不可变。
- 历史工单继续使用原状态机。
- 分类未绑定时使用内置标准流程。
- 每个实例最多一个 PENDING 任务。
