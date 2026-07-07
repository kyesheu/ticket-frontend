<template>
  <div class="app-container">
    <!-- 顶部未读徽标 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="unread-badge">
          <el-button type="primary" plain icon="Bell" @click="getList">我的通知</el-button>
        </el-badge>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Check" @click="handleReadAll" v-hasPermi="['ticket:notification:read']" :disabled="unreadCount === 0">全部已读</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="notificationList" :row-class-name="tableRowClassName">
      <el-table-column label="类型" align="center" prop="type" width="100">
        <template #default="scope">
          <el-tag :type="typeTagType(scope.row.type)" size="small">{{ typeLabel(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="内容摘要" align="center" prop="content" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="isRead" width="90">
        <template #default="scope">
          <el-tag :type="scope.row.isRead ? 'info' : 'warning'" size="small">{{ scope.row.isRead ? '已读' : '未读' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="!scope.row.isRead" link type="primary" icon="Check" @click="handleRead(scope.row)" v-hasPermi="['ticket:notification:read']">标为已读</el-button>
          <span v-else style="color:#999">—</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup lang="ts" name="TicketNotification">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { listNotification, getUnreadCount, markRead, markAllRead } from '@/api/ticket/notification'
import type { TicketNotification } from '@/types/ticket/notification'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const unreadCount = ref(0)
const notificationList = ref<TicketNotification[]>([])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
})

const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listNotification(queryParams.value).then(res => {
    notificationList.value = res.rows
    total.value = res.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function getUnread() {
  getUnreadCount().then(res => {
    unreadCount.value = res.data ?? 0
  })
}

function handleRead(row: TicketNotification) {
  markRead(row.id).then(() => {
    proxy.$modal.msgSuccess('已标记为已读')
    getList()
    getUnread()
  })
}

function handleReadAll() {
  proxy.$modal.confirm('确认将所有通知标记为已读？').then(() => {
    return markAllRead()
  }).then(() => {
    proxy.$modal.msgSuccess('已全部标记为已读')
    getList()
    getUnread()
  }).catch(() => {})
}

function tableRowClassName({ row }: { row: TicketNotification }) {
  return row.isRead ? '' : 'unread-row'
}

function typeLabel(type?: string): string {
  if (!type) return '-'
  const m: Record<string, string> = {
    ASSIGN: '分派', PROCESS: '处理', CLOSE: '关闭', CANCEL: '取消', COMMENT: '评论', SLA_OVERDUE: 'SLA超时',
  }
  return m[type] || type
}

function typeTagType(type?: string): string {
  if (!type) return 'info'
  const m: Record<string, string> = {
    ASSIGN: '', PROCESS: 'warning', CLOSE: 'success', CANCEL: 'danger', COMMENT: 'info', SLA_OVERDUE: 'danger',
  }
  return m[type] || 'info'
}

onMounted(() => {
  getList()
  getUnread()
})
</script>

<style scoped lang="scss">
:deep(.unread-row) {
  background-color: #f0f9ff !important;
}
.unread-badge {
  :deep(.el-badge__content) {
    margin-top: 8px;
  }
}
</style>
