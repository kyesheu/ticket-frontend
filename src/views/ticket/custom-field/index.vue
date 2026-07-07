<template>
  <div class="app-container tree-sidebar-manage-wrap">
    <tree-panel title="工单分类" :tree-data="categoryTree" :tree-props="{ children: 'children', label: 'categoryName' }" node-key="categoryId" search-placeholder="请输入分类名称" storage-key="custom-field-sidebar-width" :defaultExpandAll="true" :filter-method="treeFilter" @node-click="handleNodeClick" @refresh="getTree" ref="categoryTreeRef" />

    <div class="tree-sidebar-content">
      <div class="content-inner">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ticket:custom-field:add']" :disabled="!currentCategoryId">新增字段</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="fieldList">
          <el-table-column label="字段标识" prop="fieldKey" width="160" :show-overflow-tooltip="true" />
          <el-table-column label="字段名称" prop="fieldName" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="类型" prop="fieldType" width="110" align="center">
            <template #default="scope">
              <el-tag size="small">{{ fieldTypeLabel(scope.row.fieldType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="必填" prop="isRequired" width="70" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.isRequired ? 'danger' : 'info'" size="small">{{ scope.row.isRequired ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sortOrder" width="60" align="center" />
          <el-table-column label="状态" prop="status" width="80" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ticket:custom-field:edit']" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/编辑 Dialog -->
    <el-dialog :title="title" v-model="open" width="520px" append-to-body>
      <el-form :model="form" :rules="rules" ref="cfRef" label-width="80px">
        <el-form-item label="字段标识" prop="fieldKey">
          <el-input v-model="form.fieldKey" placeholder="大写字母、数字、下划线" maxlength="50" :disabled="!!editId" />
        </el-form-item>
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="form.fieldName" placeholder="请输入字段名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="类型" prop="fieldType">
          <el-select v-model="form.fieldType" placeholder="请选择类型" style="width:100%" :disabled="!!editId">
            <el-option v-for="item in fieldTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="必填">
          <el-switch v-model="form.isRequired" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" controls-position="right" style="width:100%" />
        </el-form-item>
        <el-form-item v-if="form.fieldType === 'SINGLE_SELECT' || form.fieldType === 'MULTI_SELECT'" label="选项">
          <el-input v-model="form.options" placeholder="逗号分隔，如：选项A,选项B" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="CustomField">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import TreePanel from '@/components/TreePanel/index.vue'
import { getCategoryTree } from '@/api/ticket/category'
import { listCustomField, getCustomField, addCustomField, updateCustomField } from '@/api/ticket/custom-field'
import { fieldTypeOptions } from '@/types/ticket/custom-field'
import type { TicketCustomField, TicketCustomFieldFormDTO } from '@/types/ticket/custom-field'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'

const { proxy } = getCurrentInstance()! as any

const loading = ref(false)
const open = ref(false)
const title = ref('')
const editId = ref<number>(0)
const currentCategoryId = ref<number>(0)
const fieldList = ref<TicketCustomField[]>([])
const categoryTree = ref<TicketCategoryTreeVO[]>([])

const data = reactive({
  form: {
    fieldKey: '', fieldName: '', fieldType: 'TEXT', categoryId: 0,
    isRequired: false, sortOrder: 0, options: '', status: '0',
  } as any,
  rules: {
    fieldKey: [
      { required: true, message: '字段标识不能为空', trigger: 'blur' },
      { pattern: /^[A-Z0-9_]+$/, message: '只允许大写字母、数字、下划线', trigger: 'blur' },
    ],
    fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
    fieldType: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  },
})

const { form, rules } = toRefs(data)

function treeFilter(value: string, data: any): boolean {
  if (!value) return true
  return data.categoryName && data.categoryName.indexOf(value) !== -1
}

function getTree() {
  getCategoryTree().then(res => { categoryTree.value = res.data || [] })
}

function handleNodeClick(data: any) {
  currentCategoryId.value = data.categoryId
  getList()
}

function getList() {
  if (!currentCategoryId.value) return
  loading.value = true
  listCustomField(currentCategoryId.value).then(res => {
    fieldList.value = res.data || []
    loading.value = false
  }).catch(() => { loading.value = false })
}

function reset() {
  form.value = { fieldKey: '', fieldName: '', fieldType: 'TEXT', categoryId: currentCategoryId.value, isRequired: false, sortOrder: 0, options: '', status: '0' }
  editId.value = 0
  proxy.resetForm('cfRef')
}

function handleAdd() {
  reset()
  title.value = '新增字段'
  open.value = true
}

function handleUpdate(row: TicketCustomField) {
  reset()
  editId.value = row.id
  getCustomField(row.id).then(res => {
    const d = res.data!
    form.value = { ...d, categoryId: currentCategoryId.value }
    title.value = '编辑字段'
    open.value = true
  })
}

function handleStatusChange(row: TicketCustomField) {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal.confirm('确认要' + text + '该字段吗？').then(() => {
    return updateCustomField(row.id, row as any)
  }).then(() => {
    proxy.$modal.msgSuccess(text + '成功'); getList()
  }).catch(() => { row.status = row.status === '0' ? '1' : '0' })
}

function cancel() { open.value = false; reset() }

function submitForm() {
  proxy.$refs['cfRef'].validate((valid: boolean) => {
    if (!valid) return
    const payload: TicketCustomFieldFormDTO = {
      ...form.value,
      isRequired: form.value.isRequired || false,
      categoryId: currentCategoryId.value,
    }
    if (editId.value) {
      updateCustomField(editId.value, payload).then(() => { proxy.$modal.msgSuccess('修改成功'); open.value = false; getList() })
    } else {
      addCustomField(payload).then(() => { proxy.$modal.msgSuccess('新增成功'); open.value = false; getList() })
    }
  })
}

function fieldTypeLabel(type: string): string {
  const m: Record<string, string> = { TEXT: '文本', NUMBER: '数字', DATE: '日期', DATETIME: '日期时间', SINGLE_SELECT: '单选', MULTI_SELECT: '多选', BOOLEAN: '布尔' }
  return m[type] || type
}

onMounted(() => { getTree() })
</script>
