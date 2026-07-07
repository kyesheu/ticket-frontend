# ticket-frontend

RuoYi-Vue3 + TypeScript + Element Plus。

## 边界

```text
前端 → Java 后端 → Python AI 服务
```

- 前端只调 Java 后端。
- 不直调 Python AI 服务。
- AI 结果只展示建议，不自动评论、处理或流转工单。

## 实施入口

```text
docs/README.md
docs/<version>/api.md 或 docs/<version>/backend.md
docs/<version>/frontend.md
```

- 默认先做 `v1.0`，除非用户明确指定版本。
- 一次只做一个版本。
- 以后端说明文档为准；冲突时先修文档。
- 不实现后端未暴露接口。
- 开工前说明：版本、文件范围、接口权限、验证命令。

## 规则

- Vue 3 + TypeScript + Element Plus
- 使用 `@/utils/request`
- 使用 `pagination`、`right-toolbar`、`v-hasPermi`
- 参照 `src/views/system/user/index.vue`、`src/views/system/dept/index.vue`
- 不引入新 UI 库
- 类型：`src/types/ticket/`
- API：`src/api/ticket/`
- 菜单 SQL 和按钮权限必须匹配后端 `@PreAuthorize`

## 固定契约

- v1.1 SLA：`/ticket/sla`，权限 `ticket:sla:*`。
- `responseOverdue`、`resolveOverdue`：`'0' | '1'`。
- v3.0/v3.1 AI：`similar`、`assist`、`triage` 用 query 参数。
- v3.2：后端 HTTP API 未暴露，暂停前端开发。

## 验证

```sh
npx vue-tsc --noEmit
npm run build:prod
```
