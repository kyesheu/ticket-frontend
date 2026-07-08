# ticket-frontend

Vue 3 + TypeScript + Element Plus。

## 边界

```text
前端 → Java 后端 → Python AI 服务
```

- 前端只调 Java 后端。
- 不直调 Python AI 服务。
- AI 结果只展示建议，不自动评论、处理或流转工单。

## 实施入口

```text
docs/README.md → docs/1.x/ docs/2.x/ docs/3.x/
```

- 以后端说明文档为准；冲突时先修文档。
- 不实现后端未暴露接口。

## 规则

- Vue 3 + TypeScript + Element Plus
- 使用 `@/utils/request`、`pagination`、`right-toolbar`、`v-hasPermi`
- 不引入新 UI 库
- 类型：`src/types/ticket/`
- API：`src/api/ticket/`
- 菜单 SQL 和按钮权限匹配后端 `@PreAuthorize`

## 验证

```sh
npx vue-tsc --noEmit
npm run build:prod
```
