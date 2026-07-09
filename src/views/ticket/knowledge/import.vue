<template>
  <div class="app-container">
    <el-card shadow="never" class="import-card">
      <template #header>
        <div class="card-header">
          <span>上传知识文档</span>
          <el-button link icon="ArrowLeft" @click="router.back()">返回知识库</el-button>
        </div>
      </template>
      <el-alert
        title="支持 TXT、Markdown、文本型 PDF。上传后会切片并写入向量库，供工单 AI 辅助检索。"
        type="info"
        show-icon
        :closable="false"
        class="import-tip"
      />
      <el-form :model="form" :rules="rules" ref="importRef" label-width="80px">
        <el-form-item label="文档标识" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="自动生成，也可手动输入唯一标识" maxlength="100" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryName">
          <el-tree-select
            v-model="form.categoryName"
            :data="categoryTreeOptions"
            :props="{ value: 'categoryName', label: 'categoryName', children: 'children' }"
            value-key="categoryName"
            placeholder="请选择知识分类"
            clearable
            check-strictly
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload ref="uploadRef" :action="''" :auto-upload="false" :limit="1" :on-change="onFileChange" :file-list="fileList" accept=".txt,.md,.pdf" drag>
            <el-icon><UploadFilled /></el-icon>
            <div>拖拽知识文档到此处，或点击选择文件</div>
            <template #tip>
              <div class="el-upload__tip">单次上传一个文件；重复上传同一文档标识会替换原知识内容。</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="margin-top: 16px">
        <el-button type="primary" icon="Upload" @click="submitImport" :loading="importing" v-hasPermi="['ticket:ai:document:import']">开始导入</el-button>
        <el-button @click="resetImport">继续上传</el-button>
        <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
      </div>
      <div v-if="result" style="margin-top: 16px">
        <el-alert :title="result.msg" :type="result.code === 200 ? 'success' : 'error'" :closable="false" show-icon />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="AiKnowledgeImport">
import { ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import { importDocument } from '@/api/ticket/ai'
import { getKnowledgeCategoryTree } from '@/api/ticket/knowledge-category'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'

const router = useRouter()
const importing = ref(false)
const fileList = ref<any[]>([])
const result = ref<any>(null)
const selectedFile = ref<File | null>(null)
const categoryTreeOptions = ref<TicketCategoryTreeVO[]>([])

const data = reactive({
  form: { sourceId: '', categoryName: '' },
  rules: {
    sourceId: [{ required: true, message: '文档标识不能为空', trigger: 'blur' }],
  },
})
const { form, rules } = toRefs(data)

function onFileChange(file: any) {
  selectedFile.value = file.raw
  if (!form.value.sourceId && file.name) {
    form.value.sourceId = buildSourceId(file.name)
  }
}

function submitImport() {
  if (!form.value.sourceId) return
  if (!selectedFile.value) { result.value = { code: 400, msg: '请选择文件' }; return }
  importing.value = true
  result.value = null
  importDocument(form.value.sourceId, selectedFile.value, form.value.categoryName).then(res => {
    const chunkCount = res.data?.chunkCount || res.data?.chunk_count
    result.value = { code: 200, msg: chunkCount ? `导入成功，生成 ${chunkCount} 个知识切片` : '导入成功' }
    importing.value = false
  }).catch(err => {
    result.value = { code: 500, msg: err.message || '导入失败' }
    importing.value = false
  })
}

function buildSourceId(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  return baseName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .slice(0, 64) || `doc-${Date.now()}`
}

function resetImport() {
  form.value.sourceId = ''
  form.value.categoryName = ''
  selectedFile.value = null
  fileList.value = []
  result.value = null
}

getKnowledgeCategoryTree().then(res => { categoryTreeOptions.value = res.data || [] })
</script>

<style scoped lang="scss">
.import-card {
  max-width: 860px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.import-tip {
  margin-bottom: 16px;
}
</style>
