<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编号" prop="ticketNo">
        <el-input v-model="queryParams.ticketNo" placeholder="请输入工单编号" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="告警类型" prop="alertType">
        <el-select v-model="queryParams.alertType" placeholder="告警类型" clearable style="width: 200px">
          <el-option v-for="item in alertTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Refresh" @click="handleScan" v-hasPermi="['ticket:sla-alert:scan']">手工扫描</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="alertList">
      <el-table-column label="工单编号" align="center" prop="ticketNo" min-width="160" />
      <el-table-column label="告警类型" align="center" prop="alertType" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.alertType === 'RESPONSE' ? 'warning' : 'danger'">{{ alertTypeLabel(scope.row.alertType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="超时时间" align="center" prop="expireTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)" v-hasPermi="['ticket:sla-alert:query']">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="drawerOpen" title="SLA 告警详情" size="520px" direction="rtl">
      <el-descriptions v-if="detail" :column="1" border size="small">
        <el-descriptions-item label="工单编号">{{ detail.ticketNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ detail.title || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{ priorityLabel(detail.priority) }}</el-descriptions-item>
        <el-descriptions-item label="告警类型">{{ alertTypeLabel(detail.alertType) }}</el-descriptions-item>
        <el-descriptions-item label="响应截止">{{ parseTime(detail.responseDueAt) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="解决截止">{{ parseTime(detail.resolveDueAt) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="响应超时">
          <el-tag :type="detail.responseOverdue === '1' ? 'danger' : 'success'">{{ overdueLabel(detail.responseOverdue) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="解决超时">
          <el-tag :type="detail.resolveOverdue === '1' ? 'danger' : 'success'">{{ overdueLabel(detail.resolveOverdue) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="超时时间">{{ parseTime(detail.expireTime) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ parseTime(detail.createTime) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="TicketSlaAlert">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { listSlaAlert, getSlaAlert, scanSlaAlert } from '@/api/ticket/sla-alert'
import { alertTypeOptions } from '@/types/ticket/sla'
import type { TicketSlaAlert, TicketSlaAlertQueryDTO } from '@/types/ticket/sla'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const alertList = ref<TicketSlaAlert[]>([])
const drawerOpen = ref(false)
const detail = ref<TicketSlaAlert | null>(null)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ticketNo: undefined,
    alertType: undefined,
  } as TicketSlaAlertQueryDTO,
})

const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listSlaAlert(queryParams.value).then(res => {
    alertList.value = res.rows
    total.value = res.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleScan() {
  scanSlaAlert().then(() => {
    proxy.$modal.msgSuccess('扫描完成')
    getList()
  })
}

function handleDetail(row: TicketSlaAlert) {
  drawerOpen.value = true
  getSlaAlert(row.alertId).then(res => {
    detail.value = res.data!
  })
}

function alertTypeLabel(type?: string): string {
  const m: Record<string, string> = { RESPONSE: '响应超时', RESOLVE: '解决超时' }
  return type ? (m[type] || type) : '-'
}

function overdueLabel(flag?: string): string {
  return flag === '1' ? '超时' : '未超时'
}

function priorityLabel(priority?: string): string {
  if (!priority) return '-'
  const m: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' }
  return m[priority] || priority
}

onMounted(() => {
  getList()
})
</script>
