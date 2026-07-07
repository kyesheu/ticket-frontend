# v1.1 后端说明文档 — SLA 时效管理

## 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/ticket/sla/list` | `ticket:sla:list` | 策略列表 |
| GET | `/ticket/sla/{policyId}` | `ticket:sla:query` | 策略详情 |
| POST | `/ticket/sla` | `ticket:sla:add` | 新增策略 |
| PUT | `/ticket/sla/{policyId}` | `ticket:sla:edit` | 修改策略 |
| GET | `/ticket/sla-alert/list` | `ticket:sla-alert:list` | 告警列表 |
| GET | `/ticket/sla-alert/{alertId}` | `ticket:sla-alert:query` | 告警详情 |
| POST | `/ticket/sla-alert/scan` | `ticket:sla-alert:scan` | 手工扫描 |

无 SLA 删除接口。

## 字段

```ts
policyId: number
priority: string
responseMinutes: number
resolveMinutes: number
status: string
remark?: string
createTime?: string
updateTime?: string
responseDueAt?: string
resolveDueAt?: string
responseOverdue?: '0' | '1'
resolveOverdue?: '0' | '1'
```

## 规则

- 超时判断：`responseOverdue === '1' || resolveOverdue === '1'`。
- 按 LOW/MEDIUM/HIGH/URGENT 四种优先级分别配置响应和解决时限（分钟）。
- 策略缺失或停用时，拒绝创建对应优先级工单。
