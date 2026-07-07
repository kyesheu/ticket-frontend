# v2.2 前端任务 — 附件

## 文件

```text
src/types/ticket/attachment.ts
src/api/ticket/attachment.ts
src/views/ticket/ticket/index.vue
```

## 页面

- 使用 `el-upload` 组件，POST 到 `/ticket/attachment/upload`
- 支持多文件上传
- 上传后展示文件名、大小
- 提交工单/评论时附带附件 ID 列表
- 工单详情 Drawer 新增「附件」Tab
- 列表展示：文件名、大小、上传人、上传时间
- 点击下载，删除按钮（权限控制）

## 权限

```text
ticket:attachment:upload
ticket:attachment:list
ticket:attachment:download
ticket:attachment:remove
```

## 验收

```sh
npx vue-tsc --noEmit
npm run build:prod
```
