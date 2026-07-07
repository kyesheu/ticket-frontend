<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="taskList">
      <el-table-column label="工单编号" align="center" prop="ticketNo" min-width="160" />
      <el-table-column label="标题" align="center" prop="title" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="当前节点" align="center" prop="nodeName" width="120" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template #default="scope">
          <el-tag :type="statusTagType(scope.row.status)" size="small">{{ taskStatusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="scope.row.status === 'PENDING'" link type="success" icon="Check" @click="handleComplete(scope.row)" v-hasPermi="['ticket:workflow:task']">通过</el-button>
          <el-button v-if="scope.row.status === 'PENDING'" link type="danger" icon="Back" @click="handleReturn(scope.row)" v-hasPermi="['ticket:workflow:task']">退回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 通过 Dialog -->
    <el-dialog title="审批通过" v-model="completeOpen" width="450px" append-to-body>
      <el-form :model="completeForm" ref="completeRef" label-width="80px">
        <el-form-item label="意见" prop="comment">
          <el-input v-model="completeForm.comment" type="textarea" :rows="3" placeholder="审批意见（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitComplete">确 定</el-button>
        <el-button @click="completeOpen = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 退回 Dialog -->
    <el-dialog title="退回" v-model="returnOpen" width="450px" append-to-body>
      <el-form :model="returnForm" :rules="returnRules" ref="returnRef" label-width="80px">
        <el-form-item label="退回原因" prop="comment">
          <el-input v-model="returnForm.comment" type="textarea" :rows="3" placeholder="请输入退回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitReturn">确 定</el-button>
        <el-button @click="returnOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="WorkflowTask">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { listWorkflowTasks, completeWorkflowTask, returnWorkflowTask } from '@/api/ticket/workflow-task'
import { taskStatusLabel } from '@/types/ticket/workflow'
import type { WorkflowTask } from '@/types/ticket/workflow'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(true)
const total = ref(0)
const taskList = ref<WorkflowTask[]>([])
const completeOpen = ref(false)
const returnOpen = ref(false)
const currentTask = ref<WorkflowTask | null>(null)

const data = reactive({
  queryParams: { pageNum: 1, pageSize: 10 },
  completeForm: { comment: '' },
  returnForm: { comment: '' },
  returnRules: {
    comment: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }],
  },
})

const { queryParams, completeForm, returnForm, returnRules } = toRefs(data)

function getList() {
  loading.value = true
  listWorkflowTasks().then(res => { taskList.value = res.rows; total.value = res.total; loading.value = false }).catch(() => { loading.value = false })
}

function handleComplete(row: WorkflowTask) {
  currentTask.value = row
  completeForm.value.comment = ''
  completeOpen.value = true
}

function submitComplete() {
  completeWorkflowTask(currentTask.value!.id, { approved: true, comment: completeForm.value.comment || undefined }).then(() => {
    proxy.$modal.msgSuccess('审批完成')
    completeOpen.value = false
    getList()
  })
}

function handleReturn(row: WorkflowTask) {
  currentTask.value = row
  returnForm.value.comment = ''
  returnOpen.value = true
}

function submitReturn() {
  proxy.$refs['returnRef'].validate((valid: boolean) => {
    if (!valid) return
    returnWorkflowTask(currentTask.value!.id, { targetNodeKey: 'start', comment: returnForm.value.comment }).then(() => {
      proxy.$modal.msgSuccess('已退回')
      returnOpen.value = false
      getList()
    })
  })
}

function statusTagType(status?: string): string {
  const m: Record<string, string> = { PENDING: 'warning', COMPLETED: 'success', RETURNED: 'danger', CANCELLED: 'info', TERMINATED: 'info' }
  return m[status || ''] || 'info'
}

onMounted(() => { getList() })
</script>
