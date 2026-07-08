# 工单管理系统 — 前端文档

## 目录结构

```
docs/
  1.x/
    api.md       — v1.0~v1.3 后端接口参考
    frontend.md  — v1.0~v1.3 前端实现说明
  2.x/
    api.md       — v2.0~v2.3 后端接口参考
    frontend.md  — v2.0~v2.3 前端实现说明
  3.x/
    api.md       — v3.0~v3.3 后端接口参考
    frontend.md  — v3.0~v3.3 前端实现说明
  README.md
```

## 版本总览

| 系列 | 版本 | 主题 |
|------|------|------|
| 1.x | v1.0~v1.3 | 工单核心流程：CRUD、分类、评论、日志、SLA 时效、站内通知、满意度评价、部门数据权限 |
| 2.x | v2.0~v2.3 | 流程引擎与扩展：动态流程、自定义字段、附件管理、全文检索 |
| 3.x | v3.0~v3.3 | AI 智能辅助：知识库、分诊、反馈评测闭环、运营指标、收尾优化 |

## 边界

```
前端 → Java 后端 → Python AI 服务
```

- 前端只调 Java 后端，不直调 Python AI 服务
- AI 结果只展示建议，不自动评论、处理或流转工单

## 技术栈

Vue 3 + TypeScript + Element Plus + Vite，基于 RuoYi-Vue3。

## 约定

- 类型：`src/types/ticket/`
- API：`src/api/ticket/`
- 视图：`src/views/ticket/`
- 菜单 SQL：`sql/ticket_menu_v*.sql`
- 权限标识匹配后端 `@PreAuthorize`

## 验证

```sh
npx vue-tsc --noEmit
npm run build:prod
```
