<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="文档标题" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleImport" v-hasPermi="['ticket:ai:document:import']">导入文档</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="docList">
      <el-table-column label="标题" prop="title" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="类型" prop="type" width="80" align="center" />
      <el-table-column label="切片数" prop="chunkCount" width="80" align="center" />
      <el-table-column label="导入时间" prop="importTime" width="160" align="center">
        <template #default="scope"><span>{{ parseTime(scope.row.importTime) }}</span></template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)" v-hasPermi="['ticket:ai:document:query']">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="drawerOpen" title="文档详情" size="500px" direction="rtl">
      <el-descriptions v-if="detail" :column="1" border size="small">
        <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type }}</el-descriptions-item>
        <el-descriptions-item label="切片数">{{ detail.chunkCount }}</el-descriptions-item>
        <el-descriptions-item label="导入时间">{{ parseTime(detail.importTime) }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="AiKnowledge">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { listAiDocuments, getAiDocument } from '@/api/ticket/ai'
import type { AiDocument, AiDocumentQueryDTO } from '@/types/ticket/ai'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const router = useRouter()

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const docList = ref<AiDocument[]>([])
const drawerOpen = ref(false)
const detail = ref<AiDocument | null>(null)

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 10, title: undefined } as AiDocumentQueryDTO,
})
const { queryParams } = toRefs(data)

function getList() {
  loading.value = true
  listAiDocuments(queryParams.value).then(res => { docList.value = res.rows; total.value = res.total; loading.value = false }).catch(() => { loading.value = false })
}

function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() { proxy.resetForm('queryRef'); handleQuery() }
function handleImport() { router.push('/ticket/knowledge/import') }

function handleDetail(row: AiDocument) {
  drawerOpen.value = true
  getAiDocument(row.sourceId).then(res => { detail.value = res.data! })
}

onMounted(() => { getList() })
</script>
