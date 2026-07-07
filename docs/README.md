# 工单前端开发文档索引

## 入口

```text
docs/<version>/api.md 或 backend.md
docs/<version>/frontend.md
```

后端说明文档优先。冲突时先修文档。

## 顺序

```text
1.0 -> 1.1 -> 1.2 -> 1.3 -> 2.1 -> 2.2 -> 2.3 -> 2.0 -> 3.0 -> 3.1 -> 3.3
```

`3.2` 暂停：后端 HTTP API 未暴露。

## 固定契约

- v1.1 SLA：`/ticket/sla`，权限 `ticket:sla:*`。
- `responseOverdue`、`resolveOverdue`：`'0' | '1'`。
- v3.0/v3.1 AI：`similar`、`assist`、`triage` 用 query 参数。
- v3.2：不开发。

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
