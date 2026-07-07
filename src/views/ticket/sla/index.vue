<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="queryParams.priority" placeholder="优先级" clearable style="width: 200px">
          <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 200px">
          <el-option label="启用" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ticket:sla:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="policyList">
      <el-table-column label="优先级" align="center" prop="priority" width="120">
        <template #default="scope">
          <el-tag :type="priorityTagType(scope.row.priority)">{{ priorityLabel(scope.row.priority) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="响应时限（分钟）" align="center" prop="responseMinutes" />
      <el-table-column label="解决时限（分钟）" align="center" prop="resolveMinutes" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ticket:sla:edit']">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" v-model="open" width="520px" append-to-body>
      <el-form :model="form" :rules="rules" ref="slaRef" label-width="120px">
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="响应时限" prop="responseMinutes">
          <el-input-number v-model="form.responseMinutes" :min="1" :precision="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="解决时限" prop="resolveMinutes">
          <el-input-number v-model="form.resolveMinutes" :min="1" :precision="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="启用" prop="status">
          <el-switch v-model="form.status" active-value="0" inactive-value="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="TicketSla">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { listSlaPolicy, getSlaPolicy, addSlaPolicy, updateSlaPolicy } from '@/api/ticket/sla'
import { priorityOptions } from '@/types/ticket/ticket'
import type { TicketSlaPolicy, TicketSlaPolicyForm, TicketSlaPolicyQueryDTO } from '@/types/ticket/sla'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const policyList = ref<TicketSlaPolicy[]>([])
const open = ref(false)
const title = ref('')

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    priority: undefined,
    status: undefined,
  } as TicketSlaPolicyQueryDTO,
  form: {
    policyId: undefined,
    priority: 'MEDIUM',
    responseMinutes: 30,
    resolveMinutes: 240,
    status: '0',
  } as TicketSlaPolicyForm,
  rules: {
    priority: [{ required: true, message: '优先级不能为空', trigger: 'change' }],
    responseMinutes: [{ required: true, message: '响应时限不能为空', trigger: 'blur' }],
    resolveMinutes: [{ required: true, message: '解决时限不能为空', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listSlaPolicy(queryParams.value).then(res => {
    policyList.value = res.rows
    total.value = res.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function reset() {
  form.value = {
    policyId: undefined,
    priority: 'MEDIUM',
    responseMinutes: 30,
    resolveMinutes: 240,
    status: '0',
  }
  proxy.resetForm('slaRef')
}

function handleAdd() {
  reset()
  title.value = '新增 SLA 策略'
  open.value = true
}

function handleUpdate(row: TicketSlaPolicy) {
  reset()
  getSlaPolicy(row.policyId).then(res => {
    form.value = { ...res.data } as TicketSlaPolicyForm
    title.value = '编辑 SLA 策略'
    open.value = true
  })
}

function handleStatusChange(row: TicketSlaPolicy) {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal.confirm('确认要' + text + '该 SLA 策略吗？').then(() => {
    return updateSlaPolicy(row.policyId, {
      policyId: row.policyId,
      priority: row.priority,
      responseMinutes: row.responseMinutes,
      resolveMinutes: row.resolveMinutes,
      status: row.status,
      remark: row.remark,
    })
  }).then(() => {
    proxy.$modal.msgSuccess(text + '成功')
    getList()
  }).catch(() => {
    row.status = row.status === '0' ? '1' : '0'
  })
}

function submitForm() {
  proxy.$refs['slaRef'].validate((valid: boolean) => {
    if (!valid) return
    if (form.value.policyId != undefined) {
      updateSlaPolicy(form.value.policyId, form.value).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addSlaPolicy(form.value).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

function cancel() {
  open.value = false
  reset()
}

function priorityLabel(priority?: string): string {
  if (!priority) return '-'
  const m: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', URGENT: '紧急' }
  return m[priority] || priority
}

function priorityTagType(priority?: string): string {
  if (!priority) return ''
  const m: Record<string, string> = { LOW: 'info', MEDIUM: '', HIGH: 'warning', URGENT: 'danger' }
  return m[priority] || ''
}

onMounted(() => {
  getList()
})
</script>
