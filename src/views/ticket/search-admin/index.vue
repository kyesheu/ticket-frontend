<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 索引状态 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span>索引状态</span></template>
          <el-descriptions :column="1" border size="small" v-if="status">
            <el-descriptions-item label="文档总数">{{ status.totalDocs }}</el-descriptions-item>
            <el-descriptions-item label="待处理事件">{{ status.pendingEvents }}</el-descriptions-item>
            <el-descriptions-item label="重建中">{{ status.rebuilding ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="上次重建">{{ status.lastRebuildTime ? parseTime(status.lastRebuildTime) : '-' }}</el-descriptions-item>
          </el-descriptions>
          <el-button icon="Refresh" @click="getStatus" style="margin-top:12px">刷新</el-button>
        </el-card>
      </el-col>

      <!-- 操作 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span>索引维护</span></template>
          <div class="admin-actions">
            <el-button type="warning" icon="RefreshRight" @click="handleRebuild" v-hasPermi="['ticket:search:rebuild']" :loading="rebuilding">全量重建</el-button>
            <el-button icon="Warning" @click="handleRetry" v-hasPermi="['ticket:search:retry']">重试失败事件</el-button>
          </div>
          <div v-if="rebuilding" style="margin-top:16px">
            <el-progress :percentage="progress" :stroke-width="12" />
            <p style="color:#909399;font-size:12px;margin-top:8px">索引重建中，请稍候...</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="SearchAdmin">
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { getRebuildProgress, rebuildIndex, retrySearchEvents } from '@/api/ticket/search'
import type { SearchIndexStatus } from '@/types/ticket/search'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const status = ref<SearchIndexStatus | null>(null)
const rebuilding = ref(false)
const progress = ref(0)
let timer: any = null

function getStatus() {
  getRebuildProgress().then(res => {
    status.value = res.data!
    if (res.data?.rebuilding) {
      rebuilding.value = true
      progress.value = res.data.rebuildProgress
      if (!timer) pollProgress()
    } else {
      rebuilding.value = false
      progress.value = 0
      clearInterval(timer)
      timer = null
    }
  })
}

function pollProgress() {
  timer = setInterval(() => {
    getRebuildProgress().then(res => {
      if (res.data) {
        status.value = res.data
        progress.value = res.data.rebuildProgress
        if (!res.data.rebuilding) { rebuilding.value = false; clearInterval(timer); timer = null }
      }
    })
  }, 3000)
}

function handleRebuild() {
  proxy.$modal.confirm('确认触发全量索引重建？').then(() => {
    return rebuildIndex()
  }).then(() => {
    proxy.$modal.msgSuccess('索引重建已启动')
    rebuilding.value = true
    progress.value = 0
    if (!timer) pollProgress()
  }).catch(() => {})
}

function handleRetry() {
  retrySearchEvents().then(() => {
    proxy.$modal.msgSuccess('重试已触发'); getStatus()
  })
}

onMounted(() => { getStatus() })
onBeforeUnmount(() => { clearInterval(timer) })
</script>

<style scoped>
.admin-actions { display: flex; gap: 12px; flex-wrap: wrap; }
</style>
