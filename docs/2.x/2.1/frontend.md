# v2.1 前端任务 — 自定义字段

## 文件

```text
src/types/ticket/custom-field.ts
src/api/ticket/custom-field.ts
src/views/ticket/custom-field/index.vue
src/views/ticket/ticket/index.vue
```

## 页面

- 字段管理：分类树、字段列表、新增、编辑、停用/启用。
- 创建工单：选择分类后加载 `/ticket/custom-field/form/{categoryId}`，动态渲染字段，提交 `customFields`。
- 工单详情：展示字段快照。

## 控件

```text
TEXT=el-input
NUMBER=el-input-number
DATE=el-date-picker(date)
DATETIME=el-date-picker(datetime)
SINGLE_SELECT=el-select
MULTI_SELECT=el-select multiple
BOOLEAN=el-switch
```

## 权限

```text
ticket:custom-field:form
ticket:custom-field:list
ticket:custom-field:query
ticket:custom-field:add
ticket:custom-field:edit
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
