<template>
  <div class="app-container tree-sidebar-manage-wrap">
    <tree-panel title="工单分类" :tree-data="categoryTree" search-placeholder="请输入分类名称" storage-key="category-sidebar-width" :defaultExpandAll="true" @node-click="handleNodeClick" @refresh="getTree" ref="categoryTreeRef" />

    <div class="tree-sidebar-content">
      <div class="content-inner">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="queryParams.categoryName" placeholder="请输入分类名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ticket:category:add']">新增</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="categoryList">
          <el-table-column label="分类名称" prop="categoryName" :show-overflow-tooltip="true" />
          <el-table-column label="排序号" prop="orderNum" width="80" align="center" />
          <el-table-column label="状态" prop="status" width="80" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="160" align="center">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ticket:category:edit']" />
              <el-button link type="primary" icon="Plus" @click="handleAddSub(scope.row)" v-hasPermi="['ticket:category:add']" />
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ticket:category:remove']" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增/修改分类 Dialog -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form :model="form" :rules="rules" ref="categoryRef" label-width="80px">
        <el-form-item label="上级分类">
          <el-tree-select v-model="form.parentId" :data="categoryTree" :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择上级分类（空为一级分类）" clearable check-strictly style="width:100%" />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" controls-position="right" style="width:100%" />
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

<script setup lang="ts" name="Category">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import TreePanel from '@/components/TreePanel/index.vue'
import { listCategory, getCategoryTree, getCategory, addCategory, updateCategory, delCategory } from '@/api/ticket/category'
import type { TicketCategory, TicketCategoryQueryDTO, TicketCategoryCreateDTO, TicketCategoryUpdateDTO, TicketCategoryTreeVO } from '@/types/ticket/category'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any

const loading = ref(true)
const showSearch = ref(true)
const open = ref(false)
const title = ref('')
const categoryList = ref<TicketCategory[]>([])
const categoryTree = ref<TicketCategoryTreeVO[]>([])
const currentParentId = ref<number | undefined>(undefined)

const data = reactive({
  queryParams: {
    categoryName: undefined,
  } as TicketCategoryQueryDTO,
  form: {
    categoryId: undefined,
    parentId: undefined,
    categoryName: '',
    orderNum: 0,
  } as any,
  rules: {
    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

function getTree() {
  getCategoryTree().then(res => {
    categoryTree.value = res.data || []
  })
}

function handleNodeClick(data: any) {
  currentParentId.value = data.id
  handleQuery()
}

function getList() {
  loading.value = true
  listCategory(queryParams.value).then(res => {
    loading.value = false
    const all = res.data || []
    categoryList.value = currentParentId.value
      ? all.filter(c => c.parentId === currentParentId.value)
      : all.filter(c => !c.parentId)
  })
}

function handleQuery() {
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  currentParentId.value = undefined
  proxy.$refs.categoryTreeRef.setCurrentKey(null)
  getList()
}

/** 新增一级分类 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '新增分类'
}

/** 新增子分类 */
function handleAddSub(row: TicketCategory) {
  reset()
  form.value.parentId = row.categoryId
  open.value = true
  title.value = '新增子分类'
}

/** 修改 */
function handleUpdate(row: TicketCategory) {
  reset()
  getCategory(row.categoryId!).then(res => {
    form.value = { ...res.data }
    open.value = true
    title.value = '修改分类'
  })
}

/** 删除 */
function handleDelete(row: TicketCategory) {
  proxy.$modal.confirm('确认删除分类「' + row.categoryName + '」吗？').then(() => {
    return delCategory(row.categoryId!)
  }).then(() => {
    getTree()
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

/** 状态修改 */
function handleStatusChange(row: TicketCategory) {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal.confirm('确认要' + text + '「' + row.categoryName + '」吗？').then(() => {
    return updateCategory({
      categoryId: row.categoryId!,
      categoryName: row.categoryName!,
      orderNum: row.orderNum,
      status: row.status,
    } as TicketCategoryUpdateDTO)
  }).then(() => {
    proxy.$modal.msgSuccess(text + '成功')
    getTree()
    getList()
  }).catch(() => {
    row.status = row.status === '0' ? '1' : '0'
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = { categoryId: undefined, parentId: undefined, categoryName: '', orderNum: 0 }
  proxy.resetForm('categoryRef')
}

function submitForm() {
  proxy.$refs['categoryRef'].validate((valid: boolean) => {
    if (!valid) return
    if (form.value.categoryId != undefined) {
      updateCategory(form.value as TicketCategoryUpdateDTO).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getTree()
        getList()
      })
    } else {
      addCategory(form.value as TicketCategoryCreateDTO).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getTree()
        getList()
      })
    }
  })
}

onMounted(() => {
  getTree()
  getList()
})
</script>
