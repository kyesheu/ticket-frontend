# 工单管理系统 — 前端

企业内部工单全流程管理平台，覆盖创建、分派、处理、关闭、评价全生命周期，集成 SLA 时效管控、动态流程引擎、全文检索和 AI 智能辅助。

Vue 3 + TypeScript + Element Plus + Vite。

## 快速开始

```sh
npm install
npm run dev        # 开发 → http://localhost:80
```

## 验证

```sh
npx vue-tsc --noEmit    # 类型检查
npm run build:prod       # 生产构建
```

## 项目结构

```
src/
  api/ticket/          # API 层（ticket、sla、notification、workflow、attachment、ai 等）
  types/ticket/        # 类型定义
  views/ticket/        # 业务页面
  components/          # 通用组件
  store/               # 状态管理
  layout/              # 布局框架
sql/                   # 菜单&权限 SQL
docs/                  # 开发文档
```

## 功能

| 系列 | 内容 |
|------|------|
| 1.x | 工单 CRUD、分类管理、评论、操作日志、SLA 时效、站内通知、满意度评价、部门数据权限 |
| 2.x | 动态流程引擎、自定义字段、附件管理、全文检索 |
| 3.x | AI 知识库、AI 分诊、AI 反馈评测、运营指标 |

## 文档

`docs/README.md` → `docs/1.x/` `docs/2.x/` `docs/3.x/`
