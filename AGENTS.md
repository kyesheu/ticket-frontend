# Codex 开发说明

RuoYi-Vue3 + TypeScript + Element Plus。

## 沟通

- 默认中文；代码、命令、变量、路径保持英文。
- 结论先行。

## 实施入口

```text
docs/README.md
docs/<version>/api.md 或 docs/<version>/backend.md
docs/<version>/frontend.md
```

- 默认先做 `v1.0`，除非用户明确指定版本。
- 一次只做一个版本。
- 以后端说明文档为准；冲突时先修文档。
- 不猜接口、权限、字段。
- 不实现后端未暴露接口。
- `v3.2` 暂停，等待后端 Controller。

## 开工前说明

```text
目标版本
文件范围
涉及的接口和权限
验证命令
```

## 技术约束

- Vue 3 + TypeScript + Element Plus。
- 使用 `@/utils/request`。
- 使用 `pagination`、`right-toolbar`、`v-hasPermi`。
- 参照 `src/views/system/user/index.vue`、`src/views/system/dept/index.vue`。
- 不引入新 UI 库。
- 类型：`src/types/ticket/`。
- API：`src/api/ticket/`。

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

没有实际验证结果，不要声称版本完成。

## Git 与红线

- 不自动 commit 或 push；提交前先展示变更摘要，commit message 使用简洁英文。
- 删除文件/目录或 Git 历史、修改 `.env`/密钥/token/证书/CI/CD、push、rebase、reset --hard、强制推送、公开发布前必须先确认。
