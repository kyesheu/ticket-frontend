<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="流程名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="item in workflowStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ticket:workflow:add']">新建流程</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="名称" align="center" prop="name" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="描述" align="center" prop="description" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'PUBLISHED' ? 'success' : 'info'">{{ scope.row.status === 'PUBLISHED' ? '已发布' : '草稿' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" prop="version" width="80" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleDesign(scope.row)" v-hasPermi="['ticket:workflow:edit']">设计</el-button>
          <el-button link type="primary" icon="DocumentCopy" @click="handleCopy(scope.row)" v-hasPermi="['ticket:workflow:add']">复制</el-button>
          <el-button v-if="scope.row.status === 'DRAFT'" link type="success" icon="Check" @click="handlePublish(scope.row)" v-hasPermi="['ticket:workflow:publish']">发布</el-button>
          <el-button link type="primary" icon="Connection" @click="handleBindCategory(scope.row)" v-hasPermi="['ticket:workflow:edit']">绑定分类</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新建/编辑 Dialog -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form :model="form" :rules="rules" ref="wfRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入流程名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入流程描述" maxlength="500" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 绑定分类 Dialog -->
    <el-dialog title="绑定分类" v-model="bindOpen" width="450px" append-to-body>
      <el-tree-select v-model="bindCategoryId" :data="categoryTreeOptions" :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }" value-key="categoryId" placeholder="请选择分类" clearable check-strictly style="width:100%" />
      <template #footer>
        <el-button type="primary" @click="submitBind">确 定</el-button>
        <el-button @click="bindOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="WorkflowDefinition">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { listWorkflow, createWorkflow, updateWorkflow, copyWorkflow, publishWorkflow, bindWorkflowCategory } from '@/api/ticket/workflow'
import { getCategoryTree } from '@/api/ticket/category'
import { workflowStatusOptions } from '@/types/ticket/workflow'
import type { WorkflowDefinition, WorkflowFormDTO } from '@/types/ticket/workflow'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const router = useRouter()

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const open = ref(false)
const title = ref('')
const editId = ref<number>(0)
const list = ref<WorkflowDefinition[]>([])
const bindOpen = ref(false)
const bindWorkflowId = ref<number>(0)
const bindCategoryId = ref<number>()
const categoryTreeOptions = ref<TicketCategoryTreeVO[]>([])

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 10, name: undefined, status: undefined },
  form: { name: '', description: '' } as WorkflowFormDTO,
  rules: {
    name: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listWorkflow(queryParams.value).then(res => { list.value = res.rows; total.value = res.total; loading.value = false }).catch(() => { loading.value = false })
}

function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() { proxy.resetForm('queryRef'); handleQuery() }

function reset() { form.value = { name: '', description: '' }; editId.value = 0; proxy.resetForm('wfRef') }

function handleAdd() { reset(); title.value = '新建流程'; open.value = true }

function handleDesign(row: WorkflowDefinition) { router.push('/ticket/workflow/designer/' + row.id) }

function handleCopy(row: WorkflowDefinition) {
  proxy.$modal.confirm('确认复制流程 "' + row.name + '" ？').then(() => {
    copyWorkflow(row.id).then(() => { proxy.$modal.msgSuccess('复制成功'); getList() })
  }).catch(() => {})
}

function handlePublish(row: WorkflowDefinition) {
  proxy.$modal.confirm('发布后不可修改，确认发布？').then(() => {
    publishWorkflow(row.id).then(() => { proxy.$modal.msgSuccess('发布成功'); getList() })
  }).catch(() => {})
}

function submitForm() {
  proxy.$refs['wfRef'].validate((valid: boolean) => {
    if (!valid) return
    if (editId.value) {
      updateWorkflow(editId.value, form.value).then(() => { proxy.$modal.msgSuccess('修改成功'); open.value = false; getList() })
    } else {
      createWorkflow(form.value).then(() => { proxy.$modal.msgSuccess('创建成功'); open.value = false; getList() })
    }
  })
}

function cancel() { open.value = false; reset() }

function handleBindCategory(row: WorkflowDefinition) {
  bindWorkflowId.value = row.id
  bindCategoryId.value = row.categoryId
  getCategoryTree().then(res => { categoryTreeOptions.value = res.data || [] })
  bindOpen.value = true
}

function submitBind() {
  if (!bindCategoryId.value) { proxy.$modal.msgWarning('请选择分类'); return }
  bindWorkflowCategory({ workflowId: bindWorkflowId.value, categoryId: bindCategoryId.value }).then(() => {
    proxy.$modal.msgSuccess('绑定成功'); bindOpen.value = false; getList()
  })
}

onMounted(() => { getList() })
</script>
