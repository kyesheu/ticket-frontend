<template>
  <div class="app-container ticket-home">
    <section class="workbench-head">
      <div>
        <p class="eyebrow">Ticket Workspace</p>
        <h1>工单工作台</h1>
        <p class="summary">集中处理待分派、处理中、超时风险和未读通知。评论在这里更准确地说是协作记录，用来保留处理沟通、补充说明和交接上下文。</p>
      </div>
      <div class="head-actions">
        <el-button type="primary" icon="Plus" @click="go('/ticket/ticket')">新建工单</el-button>
        <el-button icon="Search" @click="go('/ticket/search')">全文检索</el-button>
      </div>
    </section>

    <el-row :gutter="16" class="metric-row">
      <el-col :xs="24" :sm="12" :lg="6" v-for="item in metrics" :key="item.label">
        <div class="metric" :class="item.tone">
          <div class="metric-icon">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div>
            <div class="metric-value">{{ item.value }}</div>
            <div class="metric-label">{{ item.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="content-row">
      <el-col :xs="24" :lg="15">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>最近工单</h2>
              <p>优先看未关闭、高优先级和接近 SLA 截止的事项。</p>
            </div>
            <el-button link type="primary" @click="go('/ticket/ticket')">查看全部</el-button>
          </div>
          <el-table v-loading="ticketLoading" :data="tickets" size="small" height="320">
            <el-table-column label="标题" min-width="180" :show-overflow-tooltip="true">
              <template #default="scope">
                <span class="ticket-title">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="92" align="center">
              <template #default="scope">
                <el-tag :type="statusTagType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="优先级" width="82" align="center">
              <template #default="scope">
                <el-tag :type="priorityTagType(scope.row.priority)">{{ priorityLabel(scope.row.priority) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="处理人" width="100" align="center">
              <template #default="scope">{{ scope.row.assigneeName || '-' }}</template>
            </el-table-column>
            <el-table-column label="解决截止" width="150" align="center">
              <template #default="scope">{{ parseTime(scope.row.resolveDueAt) || '-' }}</template>
            </el-table-column>
          </el-table>
        </section>
      </el-col>

      <el-col :xs="24" :lg="9">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>快捷入口</h2>
              <p>按日常处理频率排序。</p>
            </div>
          </div>
          <div class="quick-grid">
            <button v-for="item in quickLinks" :key="item.path" class="quick-item" type="button" @click="go(item.path)">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head compact">
            <div>
              <h2>未读通知</h2>
              <p>分派、处理、确认、SLA 告警都会在这里提醒。</p>
            </div>
            <el-tag type="warning">{{ unreadCount }}</el-tag>
          </div>
          <el-empty v-if="!notificationLoading && !notifications.length" description="暂无未读通知" :image-size="60" />
          <div v-else v-loading="notificationLoading" class="notice-list">
            <div v-for="item in notifications" :key="item.id" class="notice-item">
              <span>{{ item.title || item.content || '工单通知' }}</span>
              <small>{{ parseTime(item.createTime) }}</small>
            </div>
          </div>
        </section>
      </el-col>
    </el-row>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>功能怎么分工</h2>
          <p>减少“这个功能干什么”的困惑。</p>
        </div>
      </div>
      <el-row :gutter="12">
        <el-col :xs="24" :md="8" v-for="item in guides" :key="item.title">
          <div class="guide">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts" name="Index">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Tickets, Warning, Bell, ChatLineRound, Clock, Setting, MagicStick, DataAnalysis } from '@element-plus/icons-vue'
import { listTicket } from '@/api/ticket/ticket'
import { getUnreadCount, listNotification } from '@/api/ticket/notification'
import { parseTime } from '@/utils/ruoyi'
import type { TicketVO } from '@/types/ticket/ticket'
import type { TicketNotification } from '@/types/ticket/notification'

const router = useRouter()

const ticketLoading = ref(false)
const notificationLoading = ref(false)
const tickets = ref<TicketVO[]>([])
const notifications = ref<TicketNotification[]>([])
const unreadCount = ref(0)

const openCount = computed(() => tickets.value.filter(item => !['CLOSED', 'CANCELLED'].includes(item.status)).length)
const pendingCount = computed(() => tickets.value.filter(item => item.status === 'NEW').length)
const urgentCount = computed(() => tickets.value.filter(item => item.priority === 'URGENT' || item.priority === 'HIGH').length)
const overdueCount = computed(() => tickets.value.filter(item => item.responseOverdue === '1' || item.resolveOverdue === '1').length)

const metrics = computed(() => [
  { label: '未关闭工单', value: openCount.value, icon: Tickets, tone: 'tone-blue' },
  { label: '待分派', value: pendingCount.value, icon: Clock, tone: 'tone-amber' },
  { label: '高优先级', value: urgentCount.value, icon: Warning, tone: 'tone-red' },
  { label: '超时风险', value: overdueCount.value, icon: Bell, tone: 'tone-green' },
])

const quickLinks = [
  { label: '工单列表', path: '/ticket/ticket', icon: Tickets },
  { label: '协作记录', path: '/ticket/ticket', icon: ChatLineRound },
  { label: 'SLA 告警', path: '/ticket/sla-alert', icon: Warning },
  { label: '知识库', path: '/knowledge/document', icon: MagicStick },
  { label: 'AI 指标', path: '/ticket/ai/metrics', icon: DataAnalysis },
  { label: '流程配置', path: '/ticket/workflow/definition', icon: Setting },
]

const guides = [
  { title: '为什么有协作记录', text: '工单经常跨人员、跨班次处理，协作记录用于保留补充说明、处理过程和交接信息，避免只靠口头沟通。' },
  { title: 'AI 辅助做什么', text: 'AI 只生成相似资料、处理建议和回复草稿，给处理人参考，不会自动分派、回复或关闭工单。' },
  { title: 'SLA 看什么', text: 'SLA 用来约束响应和解决时限，首页的超时风险能帮助优先处理快要失约的工单。' },
]

function go(path: string) {
  router.push(path)
}

function loadTickets() {
  ticketLoading.value = true
  listTicket({ pageNum: 1, pageSize: 20 }).then(res => {
    tickets.value = res.rows || []
    ticketLoading.value = false
  }).catch(() => {
    ticketLoading.value = false
  })
}

function loadNotifications() {
  notificationLoading.value = true
  getUnreadCount().then(res => {
    unreadCount.value = res.data || 0
  }).catch(() => {
    unreadCount.value = 0
  })
  listNotification({ pageNum: 1, pageSize: 5, isRead: false }).then(res => {
    notifications.value = res.rows || []
    notificationLoading.value = false
  }).catch(() => {
    notificationLoading.value = false
  })
}

function statusLabel(status?: string): string {
  const map: Record<string, string> = {
    NEW: '待分派',
    PROCESSING: '处理中',
    WAIT_CONFIRM: '待确认',
    CLOSED: '已关闭',
    CANCELLED: '已取消',
  }
  return status ? map[status] || status : '-'
}

function statusTagType(status?: string): string {
  const map: Record<string, string> = {
    NEW: 'warning',
    PROCESSING: 'primary',
    WAIT_CONFIRM: 'info',
    CLOSED: 'success',
    CANCELLED: 'danger',
  }
  return status ? map[status] || '' : ''
}

function priorityLabel(priority?: string): string {
  const map: Record<string, string> = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
    URGENT: '紧急',
  }
  return priority ? map[priority] || priority : '-'
}

function priorityTagType(priority?: string): string {
  const map: Record<string, string> = {
    LOW: 'info',
    MEDIUM: '',
    HIGH: 'warning',
    URGENT: 'danger',
  }
  return priority ? map[priority] || '' : ''
}

onMounted(() => {
  loadTickets()
  loadNotifications()
})
</script>

<style scoped lang="scss">
.ticket-home {
  color: #1f2937;
}

.workbench-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0 20px;

  .eyebrow {
    margin: 0 0 6px;
    color: #409eff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }

  .summary {
    max-width: 760px;
    margin: 10px 0 0;
    color: #606266;
    line-height: 1.7;
  }
}

.head-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.metric-row,
.content-row {
  margin-bottom: 16px;
}

.metric,
.panel,
.guide {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}

.metric {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 92px;
  padding: 18px;
}

.metric-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #f5f7fa;
  font-size: 22px;
}

.metric-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
}

.metric-label {
  margin-top: 8px;
  color: #606266;
  font-size: 13px;
}

.tone-blue .metric-icon,
.tone-blue .metric-value {
  color: #409eff;
}

.tone-amber .metric-icon,
.tone-amber .metric-value {
  color: #e6a23c;
}

.tone-red .metric-icon,
.tone-red .metric-value {
  color: #f56c6c;
}

.tone-green .metric-icon,
.tone-green .metric-value {
  color: #67c23a;
}

.panel {
  padding: 16px;
  margin-bottom: 16px;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }

  p {
    margin: 6px 0 0;
    color: #909399;
    font-size: 13px;
  }

  &.compact {
    align-items: center;
  }
}

.ticket-title {
  font-weight: 600;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  color: #303133;
  cursor: pointer;
  text-align: left;
}

.quick-item:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.notice-list {
  min-height: 120px;
}

.notice-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;

  span {
    color: #303133;
  }

  small {
    color: #909399;
  }
}

.guide {
  min-height: 116px;
  padding: 16px;
  background: #fbfdff;

  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }

  p {
    margin: 0;
    color: #606266;
    line-height: 1.7;
  }
}

@media (max-width: 768px) {
  .workbench-head {
    display: block;
  }

  .head-actions {
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
