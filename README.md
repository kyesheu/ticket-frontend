# Ticket Frontend

企业流程工单管理系统前端，基于 RuoYi-Vue3 TypeScript（Vue 3 + Element Plus + Vite）。

## 技术栈

| 组件 | 版本 |
|------|------|
| Vue | 3.5 |
| Element Plus | 2.13 |
| Pinia | 3.0 |
| Vue Router | 4.6 |
| TypeScript | 5.6 |
| Vite | 6.4 |

## 版本状态

| 版本 | 功能 | 状态 |
|------|------|------|
| v1.0 | 工单主流程、分类管理、评论、操作日志 | ✅ |

## 开发

```bash
npm install
npm run dev        # http://localhost
npm run build:prod # 生产构建
```

## 文档

```
docs/1.x/1.0/
  backend.md   — 后端接口契约
  frontend.md  — 前端实施方案
```

## 项目结构

```
src/
  api/ticket/          # 工单 API 模块
  types/ticket/        # 工单类型定义
  views/ticket/        # 工单页面
    ticket/index.vue   # 工单列表
    category/index.vue # 分类管理
  sql/ticket_menu_v1.sql  # 菜单权限 SQL
```
