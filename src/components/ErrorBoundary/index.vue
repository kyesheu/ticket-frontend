<template>
  <div class="error-boundary">
    <div class="error-content">
      <el-icon :size="64" color="#f56c6c"><WarningFilled /></el-icon>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <el-button type="primary" @click="retry" v-if="retryable">重试</el-button>
      <el-button @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

withDefaults(defineProps<{
  title?: string
  message?: string
  retryable?: boolean
}>(), {
  title: '页面异常',
  message: '页面加载失败，请稍后重试。',
  retryable: false,
})

const emit = defineEmits<{ (e: 'retry'): void }>()

function retry() { emit('retry') }
function goHome() { router.push('/index') }
</script>

<style scoped>
.error-boundary {
  display: flex; align-items: center; justify-content: center;
  min-height: 400px; padding: 40px;
}
.error-content {
  text-align: center;
  h2 { font-size: 20px; color: #303133; margin: 16px 0 8px; }
  p { color: #909399; margin-bottom: 24px; }
}
</style>
