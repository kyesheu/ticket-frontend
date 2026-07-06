# ticket-frontend

企业工单管理系统前端，基于 RuoYi-Vue3 TypeScript 版本（Vue 3 + Element Plus + Vite）。

## 调用边界

```text
前端 → Java 后端 → Python AI 服务
```

前端只调用 Java 后端接口，不直接调用 Python AI 服务。

## Java / Python 职责

Java 后端：登录鉴权、RBAC 权限判断、工单状态流转、工单数据落库、数据脱敏、上下文组装、调用 Python AI 服务、返回 AI 结果、人工确认后的业务执行。

Python AI 服务：文档解析、文本切片、Embedding 向量化、知识库检索、历史工单相似检索、RAG 生成、回复草稿生成、AI 分诊建议生成。

硬约束：Python 不直连 Java 工单业务库、不接收用户 JWT、不判断工单权限；MySQL 是工单事实唯一来源；AI 输出只作为建议、不自动评论、不自动处理工单、不自动流转状态、不直接修改 ticket 表。

## 文档

按版本组织在 `docs/` 下：

```text
docs/
  1.x/1.0/
    backend.md    — 后端接口契约、状态流转、权限标识、VO 字段
    frontend.md   — 前端实施方案、文件范围、页面设计、实施顺序
  2.x/                — 后续版本（规划中）
  3.x/                — 后续版本（规划中）
```

开发前先读对应版本的 backend 和 frontend 文档，以 backend 的接口契约为准。

## 技术约束

- Vue 3 + TypeScript + Element Plus
- 使用 `@/utils/request`（已封装 token、baseURL、错误处理）
- 使用全局组件 `pagination`、`right-toolbar`
- 使用 `v-hasPermi` 做按钮权限控制
- 参照 `src/views/system/user/index.vue` 的 CRUD 页面模式
- 不引入新 UI 库

## 开发规则

- 不猜接口路径，以 `backend-1.0.md` 为准
- 不做后端没有的接口
- 不做 v2.x / v3.x 功能
- 类型定义放 `src/types/ticket/`，API 模块放 `src/api/ticket/`
- 完成后必须跑 `npx vue-tsc --noEmit` 和 `npm run build:prod`
