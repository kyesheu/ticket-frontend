# 2.x API 参考

## v2.0 动态流程引擎

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
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
| PUT | `/ticket/workflow/task/ticket/{id}/cancel` | `ticket:workflow:task` | 取消实例 |
| PUT | `/ticket/workflow/task/ticket/{id}/terminate` | `ticket:workflow:publish` | 终止实例 |

节点类型：START END APPROVAL CONDITION。处理人分配：USER ROLE DEPT_LEADER CREATOR_LEADER INITIATOR。草稿可编辑，发布后不可变。

## v2.1 自定义字段

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/custom-field/form/{categoryId}` | `ticket:custom-field:form` | 创建表单字段 |
| GET | `/ticket/custom-field/list/{categoryId}` | `ticket:custom-field:list` | 字段列表 |
| GET | `/ticket/custom-field/{id}` | `ticket:custom-field:query` | 字段详情 |
| POST | `/ticket/custom-field` | `ticket:custom-field:add` | 新增 |
| PUT | `/ticket/custom-field/{id}` | `ticket:custom-field:edit` | 编辑 |

字段类型：TEXT NUMBER DATE DATETIME SINGLE_SELECT MULTI_SELECT BOOLEAN。fieldKey+fieldType 创建后不可改。

## v2.2 附件

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/attachment/upload` | `ticket:attachment:upload` | 上传临时附件（multipart） |
| GET | `/ticket/attachment/ticket/{id}` | `ticket:attachment:list` | 工单附件列表 |
| GET | `/ticket/attachment/{id}/download` | `ticket:attachment:download` | 下载附件 |
| DELETE | `/ticket/attachment/{id}` | `ticket:attachment:remove` | 删除附件 |

上传返回临时附件 ID，创建工单/评论时绑定。终态工单附件仅管理员可删。

## v2.3 全文检索

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/search` | `ticket:search:query` | 全文检索（keyword + filters + searchAfter） |
| POST | `/ticket/search/rebuild` | `ticket:search:rebuild` | 触发索引重建 |
| GET | `/ticket/search/rebuild` | `ticket:search:rebuild` | 查询重建进度 |
| POST | `/ticket/search/events/retry` | `ticket:search:retry` | 重试失败事件 |

`ticket.search.enabled=true` 启用。ES 故障不影响工单写入。
