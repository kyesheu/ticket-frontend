<template>
  <div class="app-container">
    <el-row :gutter="16" v-if="metrics">
      <el-col :span="6"><el-card shadow="never" class="metric-box"><div class="metric-num">{{ metrics.totalRequests }}</div><div class="metric-title">总请求数</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="metric-box"><div class="metric-num">{{ metrics.avgLatencyMs?.toFixed(0) || 0 }}ms</div><div class="metric-title">平均延迟</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="metric-box"><div class="metric-num">{{ metrics.successRate ? (metrics.successRate * 100).toFixed(1) + '%' : '-' }}</div><div class="metric-title">成功率</div></el-card></el-col>
      <el-col :span="6"><el-card shadow="never" class="metric-box"><div class="metric-num">{{ metrics.activeModels }}</div><div class="metric-title">活跃模型</div></el-card></el-col>
    </el-row>

    <el-card shadow="never" v-if="metrics" style="margin-top:16px">
      <template #header><span>请求趋势</span></template>
      <el-table :data="metrics.recentRequests || []" size="small">
        <el-table-column label="时间" prop="timestamp" width="160" align="center">
          <template #default="scope"><span>{{ parseTime(scope.row.timestamp) }}</span></template>
        </el-table-column>
        <el-table-column label="端点" prop="endpoint" min-width="200" />
        <el-table-column label="延迟" prop="latencyMs" width="90" align="center">
          <template #default="scope">{{ scope.row.latencyMs }}ms</template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.success ? 'success' : 'danger'" size="small">{{ scope.row.success ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-empty v-if="!metrics" description="暂无数据" />
    <el-button icon="Refresh" @click="getSummary" style="margin-top:16px">刷新</el-button>
  </div>
</template>

<script setup lang="ts" name="AiMetrics">
import { ref, onMounted } from 'vue'
import { getAiMetricsSummary } from '@/api/ticket/ai-metrics'
import type { AiMetricsSummary } from '@/types/ticket/ai-metrics'
import { parseTime } from '@/utils/ruoyi'

const metrics = ref<AiMetricsSummary | null>(null)
function getSummary() { getAiMetricsSummary().then(res => { metrics.value = res.data! }) }
onMounted(() => { getSummary() })
</script>

<style scoped>
.metric-box { text-align: center; padding: 8px 0; }
.metric-num { font-size: 24px; font-weight: 700; color: #303133; }
.metric-title { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
