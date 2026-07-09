<template>
  <div class="app-container ai-ask-page">
    <section class="ask-layout">
      <div class="ask-panel">
        <div class="panel-head">
          <div>
            <h2>AI 智能问答</h2>
            <p>先让 AI 基于知识库回答，解决不了再转人工建单。</p>
          </div>
          <el-tag :type="answer?.needHuman ? 'warning' : 'success'" effect="plain">
            {{ answer ? (answer.needHuman ? '建议转人工' : '可先按答案处理') : '知识库优先' }}
          </el-tag>
        </div>

        <el-form label-position="top">
          <el-form-item label="问题分类">
            <el-tree-select
              v-model="form.categoryId"
              :data="categoryTree"
              :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }"
              value-key="categoryId"
              placeholder="可选，用于转人工建单"
              clearable
              check-strictly
              @change="onCategoryChange"
            />
          </el-form-item>
          <el-form-item label="描述问题">
            <el-input
              v-model="form.question"
              type="textarea"
              :rows="9"
              maxlength="10000"
              show-word-limit
              placeholder="例如：公司 WiFi 能连上但打不开内部系统，手机热点正常。"
            />
          </el-form-item>
          <div class="ask-actions">
            <el-button type="primary" icon="ChatLineRound" :loading="asking" @click="handleAsk">询问 AI</el-button>
            <el-button icon="Refresh" @click="resetQuestion">重置</el-button>
          </div>
        </el-form>

        <el-divider />

        <el-form label-position="top">
          <el-form-item label="补充说明">
            <el-input
              v-model="form.userComment"
              type="textarea"
              :rows="4"
              maxlength="2000"
              show-word-limit
              placeholder="AI 没解决时，补充影响范围、已尝试步骤或期望处理时间。"
            />
          </el-form-item>
          <div class="ask-actions">
            <el-button type="warning" icon="Promotion" :loading="escalating" :disabled="!form.question.trim()" @click="handleEscalate">
              转人工处理
            </el-button>
            <el-button type="success" icon="CircleCheck" :disabled="!answer" @click="markResolved">已解决</el-button>
          </div>
        </el-form>
      </div>

      <div class="result-panel">
        <el-alert
          v-if="answer?.degraded"
          :title="'AI 服务降级：' + (answer.reason || 'unknown')"
          type="warning"
          show-icon
          :closable="false"
          class="mb16"
        />

        <el-empty v-if="!answer" description="输入问题后，AI 会返回答案、处理建议和引用来源。" />

        <template v-else>
          <div class="answer-card">
            <div class="card-title">
              <span>AI 回答</span>
              <el-tag size="small" effect="plain">置信度 {{ confidenceText }}</el-tag>
            </div>
            <div class="answer-text">{{ answer.answer || '暂无可靠答案，建议转人工处理。' }}</div>
          </div>

          <div class="answer-card">
            <div class="card-title">引用来源</div>
            <el-table v-if="answer.sources?.length" :data="answer.sources" size="small" border>
              <el-table-column label="类型" width="120">
                <template #default="scope">{{ sourceTypeLabel(scope.row.sourceType) }}</template>
              </el-table-column>
              <el-table-column label="标题" prop="title" min-width="160" show-overflow-tooltip />
              <el-table-column label="片段" prop="snippet" min-width="260" show-overflow-tooltip />
            </el-table>
            <el-empty v-else description="没有可引用来源" />
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts" name="AiAsk">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { askAiQuestion, escalateAiQuestion, resolveAiQuestion } from '@/api/ticket/ai'
import { getCategoryTree } from '@/api/ticket/category'
import type { TicketAiQuestionAnswer } from '@/types/ticket/ai'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'

const router = useRouter()
const asking = ref(false)
const escalating = ref(false)
const answer = ref<TicketAiQuestionAnswer | null>(null)
const categoryTree = ref<TicketCategoryTreeVO[]>([])

const form = reactive({
  question: '',
  categoryId: undefined as number | undefined,
  categoryName: '',
  userComment: '',
})

const confidenceText = computed(() => `${Math.round((answer.value?.confidence || 0) * 100)}%`)

function handleAsk() {
  if (!form.question.trim()) {
    ElMessage.warning('请先输入问题')
    return
  }
  asking.value = true
  askAiQuestion({ question: form.question.trim(), category: form.categoryName, topK: 5 })
    .then(res => {
      answer.value = res.data || null
    })
    .finally(() => {
      asking.value = false
    })
}

function handleEscalate() {
  if (!form.question.trim()) {
    ElMessage.warning('请先输入问题')
    return
  }
  if (!form.categoryId) {
    ElMessage.warning('转人工前请选择工单分类')
    return
  }
  escalating.value = true
  escalateAiQuestion({
    sessionId: answer.value?.sessionId,
    question: form.question.trim(),
    aiAnswer: answer.value?.answer,
    aiSuggestion: answer.value?.suggestion,
    userComment: form.userComment,
    categoryId: form.categoryId,
    categoryName: form.categoryName,
    priority: 'MEDIUM',
  })
    .then(res => {
      const data = res.data
      ElMessage.success(data?.autoAssigned ? '工单已创建并自动分派' : '工单已创建，等待人工分派')
      if (data?.dispatchReason) ElMessage.info(data.dispatchReason)
      router.push('/ticket/ticket')
    })
    .finally(() => {
      escalating.value = false
    })
}

function markResolved() {
  if (!answer.value?.sessionId) {
    ElMessage.success('已记录为自行解决，本次不创建工单')
    resetQuestion()
    return
  }
  resolveAiQuestion(answer.value.sessionId).then(() => {
    ElMessage.success('已记录为自行解决，本次不创建工单')
    resetQuestion()
  })
}

function resetQuestion() {
  form.question = ''
  form.userComment = ''
  answer.value = null
}

function onCategoryChange(value?: number) {
  form.categoryName = findCategoryName(categoryTree.value, value) || ''
}

function findCategoryName(nodes: TicketCategoryTreeVO[], id?: number): string | undefined {
  if (!id) return undefined
  for (const node of nodes) {
    if (node.categoryId === id) return node.categoryName
    const child = findCategoryName(node.children || [], id)
    if (child) return child
  }
  return undefined
}

function sourceTypeLabel(type: string) {
  if (type === 'knowledge_document') return '知识库'
  if (type === 'history_ticket') return '历史工单'
  return type || '-'
}

onMounted(() => {
  getCategoryTree().then(res => {
    categoryTree.value = res.data || []
  })
})
</script>

<style scoped>
.ai-ask-page {
  background: #f6f8fb;
  min-height: calc(100vh - 84px);
}

.ask-layout {
  display: grid;
  grid-template-columns: minmax(360px, 460px) minmax(0, 1fr);
  gap: 16px;
}

.ask-panel,
.result-panel {
  background: #fff;
  border: 1px solid #e5eaf3;
  border-radius: 6px;
  padding: 18px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.panel-head h2 {
  font-size: 22px;
  line-height: 1.2;
  margin: 0 0 8px;
  color: #1f2d3d;
}

.panel-head p {
  margin: 0;
  color: #7a8797;
}

.ask-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.answer-card {
  border: 1px solid #e5eaf3;
  border-radius: 6px;
  margin-bottom: 14px;
  overflow: hidden;
}

.card-title {
  min-height: 44px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;
  color: #1f2d3d;
  background: #f8fafd;
  border-bottom: 1px solid #e5eaf3;
}

.answer-text {
  padding: 16px;
  color: #303133;
  line-height: 1.8;
  white-space: pre-wrap;
}

.mb16 {
  margin-bottom: 16px;
}

@media (max-width: 1100px) {
  .ask-layout {
    grid-template-columns: 1fr;
  }
}
</style>
