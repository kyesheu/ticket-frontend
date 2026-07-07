<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input v-model="queryParams.keyword" placeholder="输入关键词搜索工单..." clearable @keyup.enter="handleSearch" size="large">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.filters.status" placeholder="状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.filters.priority" placeholder="优先级" clearable>
          <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="Search" @click="handleSearch" size="large" :loading="loading">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 结果列表 -->
    <div v-if="searched" style="margin-top: 20px">
      <div class="search-info">共 {{ total }} 条结果</div>
      <el-table :data="results" v-loading="loading" @row-click="handleRowClick" style="cursor:pointer">
        <el-table-column label="标题" min-width="200">
          <template #default="scope">
            <span v-html="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column label="内容片段" min-width="300" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-html="scope.row.content" />
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="ticketNo" width="160" />
        <el-table-column label="匹配度" width="80" align="center">
          <template #default="scope">
            <el-tag size="small">{{ (scope.row._score * 100).toFixed(0) }}%</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="searchAfter" style="text-align:center;margin-top:16px">
        <el-button :loading="loading" @click="loadMore">加载更多</el-button>
      </div>
    </div>

    <!-- 工单详情 Drawer -->
    <el-drawer v-model="drawerOpen" title="工单详情" size="650px" direction="rtl">
      <template v-if="detail">
        <div class="detail-header">
          <h2>{{ detail.title }}</h2>
          <el-tag :type="statusTagType(detail.status)" size="large">{{ statusLabel(detail.status) }}</el-tag>
        </div>
        <el-descriptions :column="1" border size="small" style="margin-top:16px">
          <el-descriptions-item label="工单编号">{{ detail.ticketNo }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ detail.categoryName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ priorityLabel(detail.priority) }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ detail.creatorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ detail.assigneeName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ parseTime(detail.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="内容"><div style="white-space:pre-wrap">{{ detail.content || '-' }}</div></el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="TicketSearch">
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchTickets } from '@/api/ticket/search'
import { getTicket } from '@/api/ticket/ticket'
import { statusOptions, priorityOptions } from '@/types/ticket/ticket'
import type { TicketSearchResult } from '@/types/ticket/search'
import type { TicketVO } from '@/types/ticket/ticket'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(false)
const searched = ref(false)
const total = ref(0)
const results = ref<TicketSearchResult[]>([])
const searchAfter = ref<string | undefined>(undefined)
const drawerOpen = ref(false)
const detail = ref<TicketVO | null>(null)

const data = reactive({
  queryParams: {
    keyword: '',
    pageSize: 20,
    filters: {} as any,
  },
})

const { queryParams } = toRefs(data)

function handleSearch() {
  if (!queryParams.value.keyword.trim()) { proxy.$modal.msgWarning('请输入关键词'); return }
  searched.value = true
  loading.value = true
  searchAfter.value = undefined
  const params: any = { ...queryParams.value }
  if (!params.filters.status) delete params.filters.status
  if (!params.filters.priority) delete params.filters.priority
  searchTickets(params).then(res => {
    const d = res.data!
    results.value = d.list
    total.value = d.total
    searchAfter.value = d.searchAfter
    loading.value = false
  }).catch(() => { loading.value = false })
}

function loadMore() {
  if (!searchAfter.value) return
  loading.value = true
  searchTickets({ ...queryParams.value, searchAfter: searchAfter.value }).then(res => {
    const d = res.data!
    results.value.push(...d.list)
    searchAfter.value = d.searchAfter
    loading.value = false
  }).catch(() => { loading.value = false })
}

function handleRowClick(row: TicketSearchResult) {
  drawerOpen.value = true
  getTicket(row.ticketId).then(res => { detail.value = res.data! })
}

function statusLabel(s?: string): string {
  const m: Record<string, string> = { NEW: '待分派', PROCESSING: '处理中', WAIT_CONFIRM: '待确认', CLOSED: '已关闭', CANCELLED: '已取消' }
  return m[s || ''] || s || '-'
}

function statusTagType(s?: string): string {
  const m: Record<string, string> = { NEW: 'info', PROCESSING: 'warning', WAIT_CONFIRM: '', CLOSED: 'success', CANCELLED: 'danger' }
  return m[s || ''] || 'info'
}

function priorityLabel(p?: string): string {
  const m: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' }
  return m[p || ''] || p || '-'
}
</script>

<style scoped>
.search-info { color: #909399; margin-bottom: 12px; }
.detail-header { display: flex; align-items: center; gap: 8px; }
.detail-header h2 { margin: 0; flex: 1; }
</style>
