<template>
  <div class="app-container">
    <el-alert
      title="知识库文档会作为 AI 辅助的数据来源。导入 TXT、Markdown 或文本型 PDF 后，处理工单时 AI 会检索这些资料并生成处理建议。"
      type="info"
      show-icon
      :closable="false"
      class="knowledge-tip"
    />

    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="文档标题" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryName">
        <el-tree-select
          v-model="queryParams.categoryName"
          :data="categoryTreeOptions"
          :props="{ value: 'categoryName', label: 'categoryName', children: 'children' }"
          value-key="categoryName"
          placeholder="请选择分类"
          clearable
          check-strictly
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="Upload" @click="handleImport" v-hasPermi="['ticket:ai:document:import']">上传知识文档</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="docList">
      <el-table-column label="标题" prop="title" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="分类" prop="categoryName" width="140" :show-overflow-tooltip="true">
        <template #default="scope">{{ scope.row.categoryName || '未分类' }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'warning'">{{ scope.row.status || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="切片数" prop="chunkCount" width="80" align="center" />
      <el-table-column label="导入时间" prop="importTime" width="160" align="center">
        <template #default="scope"><span>{{ parseTime(scope.row.lastImportedAt || scope.row.importTime) }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)" v-hasPermi="['ticket:ai:document:query']">详情</el-button>
          <el-button link type="primary" icon="Refresh" @click="handleReimport(scope.row)" v-hasPermi="['ticket:ai:document:edit']">重导</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ticket:ai:document:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="drawerOpen" title="文档详情" size="680px" direction="rtl">
      <el-descriptions v-if="detail" :column="1" border size="small">
        <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detail.categoryName || '未分类' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
        <el-descriptions-item label="切片数">{{ detail.chunkCount }}</el-descriptions-item>
        <el-descriptions-item label="导入结果">{{ detail.lastImportResult || '-' }}</el-descriptions-item>
        <el-descriptions-item label="导入时间">{{ parseTime(detail.lastImportedAt || detail.importTime) }}</el-descriptions-item>
        <el-descriptions-item label="摘要">{{ detail.summary || '-' }}</el-descriptions-item>
        <el-descriptions-item label="失败原因">{{ detail.failureReasonSummary || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="AiKnowledge">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { listAiDocuments, getAiDocument, reimportAiDocument, deleteAiDocument } from '@/api/ticket/ai'
import { getKnowledgeCategoryTree } from '@/api/ticket/knowledge-category'
import type { AiDocument, AiDocumentQueryDTO } from '@/types/ticket/ai'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const router = useRouter()

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const docList = ref<AiDocument[]>([])
const drawerOpen = ref(false)
const detail = ref<AiDocument | null>(null)
const categoryTreeOptions = ref<TicketCategoryTreeVO[]>([])

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 10, title: undefined, categoryName: undefined } as AiDocumentQueryDTO,
})
const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listAiDocuments(queryParams.value).then(res => { docList.value = res.rows; total.value = res.total; loading.value = false }).catch(() => { loading.value = false })
}

function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() { proxy.resetForm('queryRef'); handleQuery() }
function handleImport() { router.push('/knowledge/document/import') }

function handleDetail(row: AiDocument) {
  drawerOpen.value = true
  getAiDocument(row.sourceId).then(res => { detail.value = res.data! })
}

function handleReimport(row: AiDocument) {
  reimportAiDocument(row.sourceId).then(() => {
    proxy.$modal.msgSuccess('重导成功')
    getList()
  })
}

function handleDelete(row: AiDocument) {
  proxy.$modal.confirm('确认删除知识文档「' + row.title + '」吗？').then(() => {
    return deleteAiDocument(row.sourceId)
  }).then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  }).catch(() => {})
}

onMounted(() => {
  getKnowledgeCategoryTree().then(res => { categoryTreeOptions.value = res.data || [] })
  getList()
})
</script>

<style scoped lang="scss">
.knowledge-tip {
  margin-bottom: 16px;
}
</style>
