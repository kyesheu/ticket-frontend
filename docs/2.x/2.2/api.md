# v2.2 后端说明 — 附件

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/ticket/attachment/upload` | `ticket:attachment:upload` | 上传临时附件（multipart） |
| GET | `/ticket/attachment/ticket/{ticketId}` | `ticket:attachment:list` | 工单附件列表 |
| GET | `/ticket/attachment/{id}/download` | `ticket:attachment:download` | 下载附件 |
| DELETE | `/ticket/attachment/{id}` | `ticket:attachment:remove` | 删除附件 |

## VO

```ts
attachmentId: number
ticketId?: number
fileName: string
fileExtension: string
fileSize: number
mimeType: string
uploaderId?: number
uploaderName?: string
createTime?: string
```

## 流程

1. POST `/ticket/attachment/upload` → 返回临时附件 ID
2. 创建工单或添加评论时传入临时附件 ID，完成绑定

## 权限

| 功能 | 权限 |
|------|------|
| 上传 | `ticket:attachment:upload` |
| 查看列表 | `ticket:attachment:list` |
| 下载 | `ticket:attachment:download` |
| 删除 | `ticket:attachment:remove` |

## 规则

- 临时附件只能由上传人绑定一次
- 终态工单附件仅管理员可删除
- 不暴露绝对路径
