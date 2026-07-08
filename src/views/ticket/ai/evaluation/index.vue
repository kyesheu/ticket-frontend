<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="VideoPlay" @click="handleRun" v-hasPermi="['ticket:ai:evaluation:run']" :loading="running">执行评测</el-button>
      </el-col>
    </el-row>

    <el-card shadow="never" class="mb8">
      <template #header><span>评测用例</span></template>
      <el-table :data="cases" size="small">
        <el-table-column label="ID" prop="id" width="60" />
        <el-table-column label="标题" prop="title" min-width="160" :show-overflow-tooltip="true" />
        <el-table-column label="分类" prop="category" width="100" />
        <el-table-column label="预期输出" prop="expectedOutputType" width="120" />
      </el-table>
    </el-card>

    <el-card shadow="never" v-if="results && results.length">
      <template #header><span>评测结果</span></template>
      <el-table :data="results" size="small">
        <el-table-column label="用例ID" prop="caseId" width="80" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.passed ? 'success' : 'danger'" size="small">{{ scope.row.passed ? '通过' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分" prop="score" width="80" align="center" />
        <el-table-column label="备注" prop="notes" min-width="200" :show-overflow-tooltip="true" />
        <el-table-column label="时间" prop="runTime" width="160" align="center">
          <template #default="scope"><span>{{ parseTime(scope.row.runTime) }}</span></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-empty v-else description="暂无评测结果" />
  </div>
</template>

<script setup lang="ts" name="AiEvaluation">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { getEvaluationCases, runEvaluation, getEvaluationResults } from '@/api/ticket/ai-evaluation'
import type { AiEvaluationCase, AiEvaluationResult } from '@/types/ticket/ai-evaluation'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const running = ref(false)
const cases = ref<AiEvaluationCase[]>([])
const results = ref<AiEvaluationResult[]>([])

function loadCases() { getEvaluationCases().then(res => { cases.value = res.data! || [] }) }
function handleRun() {
  proxy.$modal.confirm('确认执行 AI 评测？').then(() => { running.value = true; return runEvaluation() })
    .then(() => { proxy.$modal.msgSuccess('评测完成'); running.value = false; loadResults() })
    .catch(() => { running.value = false })
}
function loadResults() { getEvaluationResults().then(res => { results.value = res.data! || [] }) }

onMounted(() => { loadCases(); loadResults() })
</script>
