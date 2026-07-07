# v2.3 前端任务 — 全文检索

## 文件

```text
src/types/ticket/search.ts
src/api/ticket/search.ts
src/views/ticket/search/index.vue
src/views/ticket/search-admin/index.vue
```

## 页面

`src/views/ticket/search/index.vue`

- 顶部检索框（el-input + 搜索按钮）
- 可选筛选：状态、优先级、分类
- 结果列表：标题（高亮关键词）、内容高亮片段、工单编号、状态、优先级
- 点击打开工单详情 Drawer
- 支持 search_after 加载更多（无限滚动）

`src/views/ticket/search-admin/index.vue`

- 展示 ES 索引状态、文档数量
- 「全量重建」按钮（权限控制），显示重建进度
- 「重试失败事件」按钮

## 权限

```text
ticket:search:query
ticket:search:rebuild
ticket:search:retry
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
