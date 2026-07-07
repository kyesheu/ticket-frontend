<template>
  <div class="app-container home">
    <div class="hero">
      <h2>工单管理系统</h2>
      <p>企业内部工单全流程管理平台，覆盖创建、分派、处理、关闭、评价全生命周期，支持 SLA 时效管控与多维度数据权限。</p>
    </div>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--primary">
          <el-icon :size="28"><Plus /></el-icon>
          <div class="stat-value">创建工单</div>
          <div class="stat-label">发起工单，指定分类与优先级，自动匹配 SLA 策略</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--warning">
          <el-icon :size="28"><User /></el-icon>
          <div class="stat-value">分派处理</div>
          <div class="stat-label">按部门数据权限分配处理人，支持多级流转</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--success">
          <el-icon :size="28"><Check /></el-icon>
          <div class="stat-value">确认关闭</div>
          <div class="stat-label">客户验收确认，关闭工单并触发满意度评价</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--plain">
          <el-icon :size="28"><Clock /></el-icon>
          <div class="stat-value">SLA 管控</div>
          <div class="stat-label">按优先级设置响应/解决时限，超时自动告警</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--danger">
          <el-icon :size="28"><Star /></el-icon>
          <div class="stat-value">满意度评价</div>
          <div class="stat-label">1-5 星评分 + 文字反馈，闭环服务质量跟踪</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="stat-card stat-card--info">
          <el-icon :size="28"><Document /></el-icon>
          <div class="stat-value">操作审计</div>
          <div class="stat-label">全量操作日志与评论留痕，满足合规审计要求</div>
        </el-card>
      </el-col>
    </el-row>

    <el-divider />

    <div class="quick-links">
      <el-button type="primary" icon="Plus" size="large" @click="router.push('/ticket/ticket')">创建工单</el-button>
      <el-button icon="Clock" size="large" @click="router.push('/ticket/sla')">SLA 策略</el-button>
      <el-button icon="Warning" size="large" @click="router.push('/ticket/sla-alert')">SLA 告警</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="Index">
import { useRouter } from 'vue-router'
import { Plus, User, Check, Clock, Star, Document } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<style scoped lang="scss">
.home {
  max-width: 1100px;
  margin: 0 auto;

  .hero {
    text-align: center;
    margin-bottom: 32px;

    h2 {
      font-size: 28px;
      font-weight: 700;
      color: #303133;
      margin-bottom: 12px;
    }

    p {
      font-size: 15px;
      color: #909399;
      line-height: 1.8;
      max-width: 640px;
      margin: 0 auto;
    }
  }

  .stat-row {
    margin-bottom: 20px;
  }

  .stat-card {
    text-align: center;
    padding: 24px 16px;
    height: 100%;

    .el-icon {
      color: #909399;
      margin-bottom: 12px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 13px;
      color: #909399;
      line-height: 1.6;
    }

    &--primary {
      .el-icon, .stat-value { color: #409eff; }
    }
    &--warning {
      .el-icon, .stat-value { color: #e6a23c; }
    }
    &--success {
      .el-icon, .stat-value { color: #67c23a; }
    }
    &--info {
      .el-icon, .stat-value { color: #909399; }
    }
    &--danger {
      .el-icon, .stat-value { color: #f56c6c; }
    }
    &--plain {
      .el-icon, .stat-value { color: #303133; }
    }
  }

  .quick-links {
    display: flex;
    gap: 16px;
    justify-content: center;
    padding: 8px 0 16px;
  }
}
</style>
