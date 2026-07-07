# v1.3 前端开发任务书 — 部门数据权限

## 文件

修改：
```text
src/views/ticket/ticket/index.vue
```

## 任务

- 分派 Dialog 中的 assigneeId 下拉，按当前用户数据权限范围过滤可选用户
- 复用 RuoYi 现有 `listUser` 接口即可

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```

- 不同角色用户登录，确认工单列表只显示权限范围内的数据
- 无权工单直接 ID 访问返回"工单不存在"
