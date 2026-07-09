<template>
  <div class="workbench-page">
    <section class="todo-pane">
      <div class="pane-header">
        <div>
          <h2>我的待办</h2>
          <span>{{ total }} 个处理中工单</span>
        </div>
        <el-button icon="Refresh" circle @click="getList" />
      </div>

      <el-input
        v-model="queryParams.keyword"
        class="todo-search"
        placeholder="搜索标题/内容"
        clearable
        @keyup.enter="handleQuery"
        @clear="handleQuery"
      >
        <template #append>
          <el-button icon="Search" @click="handleQuery" />
        </template>
      </el-input>

      <el-table
        v-loading="loading"
        :data="todoList"
        highlight-current-row
        class="todo-table"
        @row-click="selectTicket"
      >
        <el-table-column label="标题" min-width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <div class="todo-title">{{ scope.row.title }}</div>
            <div class="todo-meta">
              <span>{{ scope.row.categoryName || '-' }}</span>
              <el-tag size="small" :type="priorityTagType(scope.row.priority)">{{ priorityLabel(scope.row.priority) }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分派" width="88" align="center">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.dispatchMode === 'AI_AUTO' ? 'success' : 'info'">
              {{ scope.row.dispatchMode === 'AI_AUTO' ? 'AI' : '人工' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        layout="prev, pager, next"
        @pagination="getList"
      />
    </section>

    <section class="process-pane">
      <template v-if="current">
        <div class="ticket-head">
          <div>
            <h1>{{ current.title }}</h1>
            <div class="ticket-sub">
              <span>{{ current.ticketNo }}</span>
              <span>{{ current.categoryName || '-' }}</span>
              <span>{{ parseTime(current.createTime) }}</span>
            </div>
          </div>
          <el-tag :type="current.dispatchMode === 'AI_AUTO' ? 'success' : 'info'">
            {{ current.dispatchMode === 'AI_AUTO' ? 'AI 自动分派' : '人工分派' }}
          </el-tag>
        </div>

        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="创建人">{{ current.creatorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="响应截止">{{ parseTime(current.responseDueAt) || '-' }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="priorityTagType(current.priority)">{{ priorityLabel(current.priority) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="分派原因">{{ current.dispatchReason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">
            <div class="ticket-content">{{ current.content || '-' }}</div>
          </el-descriptions-item>
        </el-descriptions>

        <div class="process-form">
          <div class="section-title">处理结果</div>
          <el-input
            v-model="processComment"
            type="textarea"
            :rows="9"
            maxlength="2000"
            show-word-limit
            placeholder="填写处理步骤、结论或给用户的回复"
          />
          <div class="process-actions">
            <el-button icon="DocumentCopy" @click="useReplyDraft" :disabled="!aiResult?.replyDraft">填入 AI 草稿</el-button>
            <el-button type="primary" icon="Check" :loading="submitting" @click="submitProcess">提交处理</el-button>
          </div>
        </div>
      </template>
      <el-empty v-else description="暂无待处理工单" />
    </section>

    <aside class="ai-pane">
      <div class="pane-header">
        <div>
          <h2>AI 辅助</h2>
          <span>处理建议和回复草稿</span>
        </div>
        <el-button icon="Refresh" circle :loading="aiLoading" :disabled="!current" @click="loadAiAssist(true)" />
      </div>

      <el-alert
        v-if="aiDegraded"
        title="AI 服务暂时不可用"
        :description="aiReason"
        type="warning"
        show-icon
        :closable="false"
      />

      <div v-if="aiLoading" v-loading="true" class="ai-loading" />
      <template v-else-if="aiResult">
        <div class="ai-section">
          <div class="section-title">处理建议</div>
          <p>{{ aiResult.suggestion || 'AI 未生成处理建议' }}</p>
        </div>
        <div class="ai-section">
          <div class="section-title">回复草稿</div>
          <p>{{ aiResult.replyDraft || 'AI 未生成回复草稿' }}</p>
        </div>
        <div class="ai-section">
          <div class="section-title">参考来源</div>
          <div v-if="aiResult.sources?.length" class="source-list">
            <div v-for="source in aiResult.sources" :key="source.sourceId" class="source-item">
              <el-tag size="small" :type="source.sourceType === 'KNOWLEDGE' ? '' : 'info'">
                {{ source.sourceType === 'KNOWLEDGE' ? '知识库' : '历史工单' }}
              </el-tag>
              <span>{{ source.title }}</span>
              <small>{{ source.snippet }}</small>
            </div>
          </div>
          <el-empty v-else description="暂无引用来源" :image-size="64" />
        </div>
      </template>
      <el-empty v-else description="选择待办后自动加载 AI 辅助" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { listMyTodoTickets, processTicket } from '@/api/ticket/ticket'
import { getTicketAssist } from '@/api/ticket/ai'
import type { TicketVO, TicketQueryDTO } from '@/types/ticket/ticket'
import type { TicketAiAssist } from '@/types/ticket/ai'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(false)
const submitting = ref(false)
const total = ref(0)
const todoList = ref<TicketVO[]>([])
const current = ref<TicketVO | null>(null)
const processComment = ref('')
const aiLoading = ref(false)
const aiResult = ref<TicketAiAssist | null>(null)
const aiDegraded = ref(false)
const aiReason = ref('')

const queryParams = ref<TicketQueryDTO>({
  pageNum: 1,
  pageSize: 10,
  keyword: undefined,
})

function getList() {
  loading.value = true
  listMyTodoTickets(queryParams.value).then(res => {
    todoList.value = res.rows || []
    total.value = res.total || 0
    loading.value = false
    if (!current.value || !todoList.value.some(item => item.ticketId === current.value?.ticketId)) {
      selectTicket(todoList.value[0])
    }
  }).catch(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function selectTicket(row?: TicketVO) {
  current.value = row || null
  processComment.value = ''
  aiResult.value = null
  aiDegraded.value = false
  aiReason.value = ''
  if (row) {
    loadAiAssist(true)
  }
}

function loadAiAssist(force = false) {
  if (!current.value || (!force && (aiResult.value || aiLoading.value))) return
  aiLoading.value = true
  aiDegraded.value = false
  aiReason.value = ''
  getTicketAssist(current.value.ticketId, 5).then(res => {
    aiResult.value = res.data!
    if (res.data?.degraded) {
      aiDegraded.value = true
      aiReason.value = res.data.reason || ''
    }
    aiLoading.value = false
  }).catch(() => {
    aiLoading.value = false
    aiDegraded.value = true
    aiReason.value = 'AI 服务未启用、不可用，或当前账号缺少查询权限。'
  })
}

function useReplyDraft() {
  if (!aiResult.value?.replyDraft) return
  processComment.value = aiResult.value.replyDraft
}

function submitProcess() {
  if (!current.value) return
  if (!processComment.value.trim()) {
    proxy.$modal.msgWarning('处理结果不能为空')
    return
  }
  submitting.value = true
  processTicket(current.value.ticketId, { comment: processComment.value.trim() }).then(() => {
    proxy.$modal.msgSuccess('处理完成')
    submitting.value = false
    current.value = null
    getList()
  }).catch(() => {
    submitting.value = false
  })
}

function priorityLabel(priority?: string): string {
  const map: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' }
  return priority ? map[priority] || priority : '-'
}

function priorityTagType(priority?: string): string {
  const map: Record<string, string> = { LOW: 'info', MEDIUM: '', HIGH: 'warning', URGENT: 'danger' }
  return priority ? map[priority] || '' : ''
}

onMounted(getList)
</script>

<style scoped lang="scss">
.workbench-page {
  display: grid;
  grid-template-columns: minmax(320px, 24%) minmax(460px, 1fr) minmax(360px, 28%);
  gap: 16px;
  min-height: calc(100vh - 100px);
  padding: 16px;
  background: #f5f7fb;
}

.todo-pane,
.process-pane,
.ai-pane {
  min-width: 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
}

.pane-header,
.ticket-head,
.process-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pane-header h2,
.ticket-head h1 {
  margin: 0;
  color: #1f2d3d;
}

.pane-header span,
.ticket-sub,
.todo-meta,
.source-item small {
  color: #909399;
}

.todo-search {
  margin: 14px 0;
}

.todo-table {
  height: calc(100vh - 265px);
}

.todo-title {
  font-weight: 600;
  color: #303133;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
}

.ticket-head {
  margin-bottom: 16px;
}

.ticket-sub {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.ticket-content,
.ai-section p {
  white-space: pre-wrap;
  line-height: 1.7;
}

.process-form,
.ai-section {
  margin-top: 18px;
}

.section-title {
  margin-bottom: 10px;
  font-weight: 600;
  color: #303133;
}

.process-actions {
  justify-content: flex-end;
  margin-top: 12px;
}

.ai-loading {
  min-height: 180px;
}

.source-list {
  display: grid;
  gap: 10px;
}

.source-item {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 8px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.source-item small {
  grid-column: 1 / -1;
  line-height: 1.6;
}

@media (max-width: 1280px) {
  .workbench-page {
    grid-template-columns: 1fr;
  }

  .todo-table {
    height: auto;
  }
}
</style>
