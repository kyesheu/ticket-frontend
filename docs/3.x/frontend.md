# 3.x 前端实现

## v3.0 AI 知识库

**新增：** `ai.ts` type + API + `knowledge/index.vue` `knowledge/import.vue`
**修改：** `ticket/index.vue`

- 知识文档页：标题/类型/切片数/导入时间+搜索分页+详情 Drawer+导入入口
- 文档导入页：上传 TXT/MD/PDF(drag)+sourceId+导入结果
- 工单详情新增"AI 辅助"Tab：相似知识卡片、处理建议、回复草稿(一键复制到评论框)、降级提示

**权限：** `ticket:ai:document:*` `ticket:ai:history:sync`

---

## v3.1 AI 分诊

**修改：** `ai.ts` type + API + `ticket/index.vue`

- NEW 状态工单详情显示"AI 分诊"按钮
- Dialog 展示：建议分类/优先级/处理人/置信度进度条/推理理由/参考来源
- 采纳弹窗：可调参数确认分派，采纳/拒绝后刷新详情和列表
- 降级提示不影响人工分派

**权限：** `ticket:ticket:query`(查看) + `ticket:ticket:assign`(采纳/拒绝)

---

## v3.2 AI 运营与评测闭环

**新增：** `ai-feedback.ts` `ai-evaluation.ts` `ai-metrics.ts` types/API + `ai/feedback` `ai/evaluation` `ai/metrics` views + `sql/ticket_menu_v3.2.sql`
**修改：** `ai.ts` type + API + `knowledge/index.vue` `ticket/index.vue`

- 知识库：重导、删除操作
- AI 反馈页：统计面板(总数/正面/负面/正面率)+反馈列表
- AI 评测页：用例列表+执行评测+结果列表
- AI 指标页：概览卡片(总请求/平均延迟/成功率/活跃模型)+请求趋势表
- 工单详情：AI 辅助和 AI 分诊卡片增加反馈按钮

**权限：** `ticket:ai:feedback:*` `ticket:ai:evaluation:*` `ticket:ai:metrics:view`

---

## v3.3 收尾

**新增：** `ErrorBoundary/index.vue` `Skeleton/index.vue`
**修改：** `request.ts`

- ErrorBoundary：异常图标+标题/描述+重试/返回首页
- Skeleton：骨架屏 shimmer 动画
- 网络错误提示优化：403→无权限/404→不存在/500→服务器错误/timeout→请重试

**验证：** `npx vue-tsc --noEmit` `npm run build:prod`
