# v2.0 前端任务 — 动态流程

## 文件

```text
src/types/ticket/workflow.ts
src/api/ticket/workflow.ts
src/api/ticket/workflow-task.ts
src/views/ticket/workflow/definition/index.vue
src/views/ticket/workflow/designer/index.vue
src/views/ticket/task/index.vue
src/views/ticket/ticket/index.vue
```

## 页面

- 流程定义：列表、新建、编辑、复制、发布、绑定分类。
- 流程设计器：节点、属性、连线、保存、发布。
- 我的待办：列表、完成、退回。
- 工单详情：当前节点、流程进度、流程历史。

## 权限

```text
ticket:workflow:list
ticket:workflow:query
ticket:workflow:add
ticket:workflow:edit
ticket:workflow:publish
ticket:workflow:task
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
