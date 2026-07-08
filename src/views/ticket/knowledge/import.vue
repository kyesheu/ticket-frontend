<template>
  <div class="app-container">
    <el-card shadow="never" style="max-width:600px">
      <template #header><span>导入知识文档</span></template>
      <el-form :model="form" :rules="rules" ref="importRef" label-width="80px">
        <el-form-item label="文档标识" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="输入唯一标识" maxlength="100" />
        </el-form-item>
        <el-form-item label="选择文件" prop="file">
          <el-upload ref="uploadRef" :action="''" :auto-upload="false" :limit="1" :on-change="onFileChange" :file-list="fileList" accept=".txt,.md,.pdf" drag>
            <el-icon><UploadFilled /></el-icon>
            <div>拖拽文件到此处或点击选择</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="margin-top: 16px">
        <el-button type="primary" icon="Upload" @click="submitImport" :loading="importing" v-hasPermi="['ticket:ai:document:import']">开始导入</el-button>
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

const router = useRouter()
const importing = ref(false)
const fileList = ref<any[]>([])
const result = ref<any>(null)
const selectedFile = ref<File | null>(null)

const data = reactive({
  form: { sourceId: '' },
  rules: {
    sourceId: [{ required: true, message: '文档标识不能为空', trigger: 'blur' }],
  },
})
const { form, rules } = toRefs(data)

function onFileChange(file: any) {
  selectedFile.value = file.raw
}

function submitImport() {
  if (!form.value.sourceId) return
  if (!selectedFile.value) { result.value = { code: 400, msg: '请选择文件' }; return }
  importing.value = true
  result.value = null
  importDocument(form.value.sourceId, selectedFile.value).then(res => {
    result.value = { code: 200, msg: '导入成功' }
    importing.value = false
  }).catch(err => {
    result.value = { code: 500, msg: err.message || '导入失败' }
    importing.value = false
  })
}
</script>
