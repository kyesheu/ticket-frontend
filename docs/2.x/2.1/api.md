# v2.1 后端说明 — 自定义字段

## 接口

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| GET | `/ticket/custom-field/form/{categoryId}` | `ticket:custom-field:form` | 创建表单字段 |
| GET | `/ticket/custom-field/list/{categoryId}` | `ticket:custom-field:list` | 字段列表 |
| GET | `/ticket/custom-field/{id}` | `ticket:custom-field:query` | 字段详情 |
| POST | `/ticket/custom-field` | `ticket:custom-field:add` | 新增 |
| PUT | `/ticket/custom-field/{id}` | `ticket:custom-field:edit` | 编辑 |

## 枚举

```text
TEXT NUMBER DATE DATETIME SINGLE_SELECT MULTI_SELECT BOOLEAN
```

## 规则

- `field_key` 分类内唯一，只允许大写字母、数字、下划线。
- `field_key`、`field_type`、`category_id` 创建后不可修改。
- 停用不物理删除。
