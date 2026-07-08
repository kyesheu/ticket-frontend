<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="DataAnalysis" @click="getStatistics" v-hasPermi="['ticket:ai:feedback:statistics']">反馈统计</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="16" v-if="stats" class="mb8">
      <el-col :span="6"><el-card shadow="never" class="stat-box"><div class="stat-num">{{ stats.totalFeedback }}</div><div class="stat-title">总反馈数</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="stat-box"><div class="stat-num">{{ stats.positiveCount }}</div><div class="stat-title">正面反馈</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="stat-box"><div class="stat-num">{{ stats.negativeCount }}</div><div class="stat-title">负面反馈</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="stat-box"><div class="stat-num">{{ (stats.positiveRate * 100).toFixed(1) }}%</div><div class="stat-title">正面率</div></el-card></el-col>
    </el-row>

    <el-table v-loading="loading" :data="feedbackList">
      <el-table-column label="工单编号" prop="ticketNo" width="160" />
      <el-table-column label="目标类型" prop="targetType" width="100" align="center">
        <template #default="scope">
          <el-tag size="small" :type="scope.row.targetType === 'ASSIST' ? 'warning' : 'info'">{{ scope.row.targetType || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评分" prop="value" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.value === 'POSITIVE' ? 'success' : 'danger'" size="small">{{ scope.row.value === 'POSITIVE' ? '正面' : '负面' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评论" prop="comment" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="用户" prop="userName" width="90" align="center" />
      <el-table-column label="时间" prop="createTime" width="160" align="center">
        <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup lang="ts" name="AiFeedback">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { listAiFeedback, getAiFeedbackStatistics } from '@/api/ticket/ai-feedback'
import type { AiFeedback, AiFeedbackQueryDTO, AiFeedbackStatistics } from '@/types/ticket/ai-feedback'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const loading = ref(true)
const total = ref(0)
const feedbackList = ref<AiFeedback[]>([])
const stats = ref<AiFeedbackStatistics | null>(null)

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 10, ticketNo: undefined } as AiFeedbackQueryDTO,
})
const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listAiFeedback(queryParams.value).then(res => { feedbackList.value = res.rows; total.value = res.total; loading.value = false }).catch(() => { loading.value = false })
}
function getStatistics() {
  getAiFeedbackStatistics().then(res => { stats.value = res.data! })
}

onMounted(() => { getList() })
</script>

<style scoped>
.stat-box { text-align: center; padding: 8px 0; }
.stat-num { font-size: 24px; font-weight: 700; color: #303133; }
.stat-title { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
