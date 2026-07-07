<template>
  <div class="app-container">
    <!-- 查询区 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="标题/内容" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="工单状态" clearable style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="queryParams.priority" placeholder="优先级" clearable style="width: 200px">
          <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ticket:ticket:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns" />
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="ticketList">
      <el-table-column label="工单编号" align="center" prop="ticketNo" v-if="columns.ticketNo.visible" width="180" />
      <el-table-column label="标题" align="center" prop="title" v-if="columns.title.visible" :show-overflow-tooltip="true">
        <template #default="scope">
          <a class="link-type" style="cursor:pointer" @click="handleDetail(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="categoryName" v-if="columns.categoryName.visible" width="120" />
      <el-table-column label="优先级" align="center" prop="priority" v-if="columns.priority.visible" width="80">
        <template #default="scope">
          <el-tag :type="priorityTagType(scope.row.priority)">{{ priorityLabel(scope.row.priority) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" v-if="columns.status.visible" width="90">
        <template #default="scope">
          <el-tag :type="statusTagType(scope.row.status)">{{ statusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creatorName" v-if="columns.creatorName.visible" width="100" />
      <el-table-column label="处理人" align="center" prop="assigneeName" v-if="columns.assigneeName.visible" width="100" />
      <el-table-column label="响应截止" align="center" prop="responseDueAt" v-if="columns.responseDueAt.visible" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.responseDueAt) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解决截止" align="center" prop="resolveDueAt" v-if="columns.resolveDueAt.visible" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.resolveDueAt) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应超时" align="center" prop="responseOverdue" v-if="columns.responseOverdue.visible" width="100">
        <template #default="scope">
          <el-tag :type="overdueTagType(scope.row.responseOverdue)">{{ overdueLabel(scope.row.responseOverdue) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="解决超时" align="center" prop="resolveOverdue" v-if="columns.resolveOverdue.visible" width="100">
        <template #default="scope">
          <el-tag :type="overdueTagType(scope.row.resolveOverdue)">{{ overdueLabel(scope.row.resolveOverdue) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)" v-hasPermi="['ticket:ticket:query']">详情</el-button>
          <el-button link type="primary" icon="User" @click="openActionDialog(scope.row, 'assign')" v-if="canAction(scope.row.status, 'assign')" v-hasPermi="['ticket:ticket:assign']">分派</el-button>
          <el-button link type="primary" icon="Edit" @click="openActionDialog(scope.row, 'process')" v-if="canAction(scope.row.status, 'process')" v-hasPermi="['ticket:ticket:process']">处理</el-button>
          <el-button link type="success" icon="Check" @click="openActionDialog(scope.row, 'confirm')" v-if="canAction(scope.row.status, 'confirm')" v-hasPermi="['ticket:ticket:confirm']">确认</el-button>
          <el-button link type="danger" icon="Close" @click="openActionDialog(scope.row, 'cancel')" v-if="canAction(scope.row.status, 'cancel')" v-hasPermi="['ticket:ticket:cancel']">取消</el-button>
          <el-button link type="warning" icon="Star" @click="openSatDialog(scope.row)" v-if="scope.row.status === 'CLOSED' && scope.row.creatorId === userStore.id" v-hasPermi="['ticket:satisfaction:add']">评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增工单 Dialog -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="ticketRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入工单标题" maxlength="200" />
        </el-form-item>
        <el-form-item label="分类">
          <el-tree-select v-model="form.categoryId" :data="categoryTreeOptions" :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择分类" clearable check-strictly style="width:100%" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="form.priority" placeholder="请选择优先级" style="width:100%">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入工单内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 操作 Dialog（分派/处理/确认/取消） -->
    <el-dialog :title="actionTitle" v-model="actionOpen" width="500px" append-to-body>
      <el-form :model="actionForm" :rules="actionRules" ref="actionRef" label-width="80px">
        <!-- 分派：用户选择 -->
        <el-form-item v-if="currentAction === 'assign'" label="处理人" prop="assigneeId">
          <el-select v-model="actionForm.assigneeId" placeholder="请选择处理人" filterable style="width:100%">
            <el-option v-for="u in userOptions" :key="u.userId" :label="u.userName" :value="u.userId" />
          </el-select>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="actionCommentLabel" prop="comment">
          <el-input v-model="actionForm.comment" type="textarea" :rows="3" :placeholder="actionCommentPlaceholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAction">确 定</el-button>
          <el-button @click="actionOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 满意度评价 Dialog -->
    <el-dialog :title="satTitle" v-model="satOpen" width="500px" append-to-body>
      <template v-if="satExists">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="评分">
            <el-rate v-model="satDetail!.score" disabled show-score />
          </el-descriptions-item>
          <el-descriptions-item label="评价内容">{{ satDetail!.content || '（无）' }}</el-descriptions-item>
          <el-descriptions-item label="评价时间">{{ parseTime(satDetail!.createTime) }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <template v-else>
        <el-form :model="satForm" :rules="satRules" ref="satRef" label-width="80px">
          <el-form-item label="评分" prop="score">
            <el-rate v-model="satForm.score" :max="5" show-score />
          </el-form-item>
          <el-form-item label="评价内容" prop="content">
            <el-input v-model="satForm.content" type="textarea" :rows="4" placeholder="请输入评价内容（选填，最长500字）" maxlength="500" show-word-limit />
          </el-form-item>
        </el-form>
      </template>
      <template #footer v-if="!satExists">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitSat" :loading="satLoading">提 交</el-button>
          <el-button @click="satOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情 Drawer -->
    <el-drawer v-model="drawerOpen" title="工单详情" size="650px" direction="rtl">
      <template v-if="detail">
        <div class="detail-header">
          <h2>{{ detail.title }}</h2>
          <el-tag :type="statusTagType(detail.status)" size="large">{{ statusLabel(detail.status) }}</el-tag>
          <el-tag :type="priorityTagType(detail.priority)" size="large" style="margin-left:8px">{{ priorityLabel(detail.priority) }}</el-tag>
        </div>

        <el-tabs v-model="activeTab" style="margin-top:16px">
          <el-tab-pane label="详情" name="detail">
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="工单编号">{{ detail.ticketNo }}</el-descriptions-item>
              <el-descriptions-item label="分类">{{ detail.categoryName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="创建人">{{ detail.creatorName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="处理人">{{ detail.assigneeName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ parseTime(detail.createTime) }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ parseTime(detail.updateTime) }}</el-descriptions-item>
              <el-descriptions-item label="处理时间">{{ parseTime(detail.processedAt) || '-' }}</el-descriptions-item>
              <el-descriptions-item label="关闭时间">{{ parseTime(detail.closedAt) || '-' }}</el-descriptions-item>
              <el-descriptions-item label="响应截止">{{ parseTime(detail.responseDueAt) || '-' }}</el-descriptions-item>
              <el-descriptions-item label="解决截止">{{ parseTime(detail.resolveDueAt) || '-' }}</el-descriptions-item>
              <el-descriptions-item label="响应超时">
                <el-tag :type="overdueTagType(detail.responseOverdue)">{{ overdueLabel(detail.responseOverdue) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="解决超时">
                <el-tag :type="overdueTagType(detail.resolveOverdue)">{{ overdueLabel(detail.resolveOverdue) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="内容">
                <div style="white-space:pre-wrap">{{ detail.content || '-' }}</div>
              </el-descriptions-item>
            </el-descriptions>

            <!-- 操作按钮 -->
            <div class="detail-actions">
              <el-button type="primary" icon="User" @click="openActionDialog(detail, 'assign')" v-if="canAction(detail.status, 'assign')" v-hasPermi="['ticket:ticket:assign']">分派</el-button>
              <el-button type="primary" icon="Edit" @click="openActionDialog(detail, 'process')" v-if="canAction(detail.status, 'process')" v-hasPermi="['ticket:ticket:process']">处理</el-button>
              <el-button type="success" icon="Check" @click="openActionDialog(detail, 'confirm')" v-if="canAction(detail.status, 'confirm')" v-hasPermi="['ticket:ticket:confirm']">确认关闭</el-button>
              <el-button type="danger" icon="Close" @click="openActionDialog(detail, 'cancel')" v-if="canAction(detail.status, 'cancel')" v-hasPermi="['ticket:ticket:cancel']">取消工单</el-button>
              <el-button type="warning" icon="Star" @click="openSatDialog(detail)" v-if="detail.status === 'CLOSED' && detail.creatorId === userStore.id" v-hasPermi="['ticket:satisfaction:add']">评价</el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="评论" name="comments">
            <div v-if="detail.comments && detail.comments.length" class="comment-list">
              <div v-for="c in detail.comments" :key="c.commentId" class="comment-item">
                <div class="comment-meta">
                  <b>{{ c.userName || '未知' }}</b>
                  <span class="comment-type-tag">
                    <el-tag size="small" :type="c.commentType === 'INTERNAL' ? 'warning' : ''">{{ c.commentType === 'INTERNAL' ? '内部' : '公开' }}</el-tag>
                  </span>
                  <span class="comment-time">{{ parseTime(c.createTime) }}</span>
                </div>
                <div class="comment-content">{{ c.content }}</div>
              </div>
            </div>
            <el-empty v-else description="暂无评论" />
            <div style="margin-top:16px">
              <el-input v-model="commentForm.content" type="textarea" :rows="3" placeholder="输入评论..." />
              <el-button type="primary" style="margin-top:8px" @click="submitComment" :loading="commentLoading" v-hasPermi="['ticket:comment:add']">发表评论</el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="操作日志" name="logs">
            <el-timeline v-if="detail.logs && detail.logs.length">
              <el-timeline-item v-for="l in detail.logs" :key="l.logId" :timestamp="parseTime(l.operateTime)" placement="top">
                <el-card shadow="hover">
                  <p><b>{{ operationLabel(l.operationType) }}</b> — {{ l.operatorName || '系统' }}</p>
                  <p v-if="l.fromStatus || l.toStatus">
                    <el-tag size="small" type="info">{{ statusLabel(l.fromStatus) || '-' }}</el-tag>
                    <span style="margin:0 4px">→</span>
                    <el-tag size="small" type="info">{{ statusLabel(l.toStatus) || '-' }}</el-tag>
                  </p>
                  <p v-if="l.comment" style="color:#666">{{ l.comment }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无操作日志" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="Ticket">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, watch } from 'vue'
import { listTicket, getTicket, createTicket, assignTicket, processTicket, confirmTicket, cancelTicket, getTicketLogs } from '@/api/ticket/ticket'
import { listComments, addComment } from '@/api/ticket/comment'
import { getCategoryTree } from '@/api/ticket/category'
import { listUser } from '@/api/system/user'
import { submitSatisfaction, getTicketSatisfaction } from '@/api/ticket/satisfaction'
import { statusOptions, priorityOptions, STATUS_ACTIONS } from '@/types/ticket/ticket'
import type { TicketVO, TicketQueryDTO, TicketCreateDTO, TicketAssignDTO, TicketProcessDTO, TicketConfirmDTO, TicketCancelDTO } from '@/types/ticket/ticket'
import type { TicketCategoryTreeVO } from '@/types/ticket/category'
import type { SysUser } from '@/types/api/system/user'
import type { TableShowColumns } from '@/types/api/common'
import type { TicketSatisfaction } from '@/types/ticket/satisfaction'
import { scoreTagType } from '@/types/ticket/satisfaction'
import useUserStore from '@/store/modules/user'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()! as any
const userStore = useUserStore()

const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const ticketList = ref<TicketVO[]>([])
const open = ref(false)
const title = ref('')
const drawerOpen = ref(false)
const detail = ref<TicketVO | null>(null)
const activeTab = ref('detail')
const actionOpen = ref(false)
const currentAction = ref('')
const actionTicketId = ref<number>(0)
const commentLoading = ref(false)
const categoryTreeOptions = ref<TicketCategoryTreeVO[]>([])
const userOptions = ref<SysUser[]>([])

const columns = ref<Record<string, TableShowColumns>>({
  ticketNo: { label: '工单编号', visible: true },
  title: { label: '标题', visible: true },
  categoryName: { label: '分类', visible: true },
  priority: { label: '优先级', visible: true },
  status: { label: '状态', visible: true },
  creatorName: { label: '创建人', visible: true },
  assigneeName: { label: '处理人', visible: true },
  responseDueAt: { label: '响应截止', visible: true },
  resolveDueAt: { label: '解决截止', visible: true },
  responseOverdue: { label: '响应超时', visible: true },
  resolveOverdue: { label: '解决超时', visible: true },
  createTime: { label: '创建时间', visible: true },
})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    keyword: undefined,
    status: undefined,
    priority: undefined,
  } as TicketQueryDTO,
  form: {
    title: '',
    content: '',
    categoryId: undefined,
    priority: 'MEDIUM',
  } as TicketCreateDTO,
  rules: {
    title: [{ required: true, message: '工单标题不能为空', trigger: 'blur' }],
  },
  commentForm: {
    content: '',
  },
  actionForm: {
    assigneeId: undefined,
    comment: undefined,
  } as any,
  actionRules: {} as any,
  satForm: {
    score: 0,
    content: '',
  },
  satRules: {
    score: [{ required: true, message: '请选择评分', trigger: 'change' }],
  },
})

const { queryParams, form, rules, commentForm, actionForm, actionRules, satForm, satRules } = toRefs(data)

// ── 查询 ──

function getList() {
  loading.value = true
  listTicket(queryParams.value).then(res => {
    loading.value = false
    ticketList.value = res.rows
    total.value = res.total
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

// ── 新增 ──

function handleAdd() {
  reset()
  loadCategoryTree()
  open.value = true
  title.value = '新增工单'
}

function reset() {
  form.value = { title: '', content: '', categoryId: undefined, priority: 'MEDIUM' }
  proxy.resetForm('ticketRef')
}

function cancel() {
  open.value = false
  reset()
}

function submitForm() {
  proxy.$refs['ticketRef'].validate((valid: boolean) => {
    if (valid) {
      createTicket(form.value).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

// ── 分类树 ──

function loadCategoryTree() {
  getCategoryTree().then(res => {
    categoryTreeOptions.value = res.data || []
  })
}

// ── 详情 Drawer ──

function handleDetail(row: TicketVO) {
  drawerOpen.value = true
  activeTab.value = 'detail'
  getTicket(row.ticketId).then(res => {
    detail.value = res.data!
  })
}

// ── 操作按钮显隐 ──

function canAction(status: string, action: string): boolean {
  return STATUS_ACTIONS[status]?.includes(action) ?? false
}

// ── 操作 Dialog ──

const actionTitleMap: Record<string, string> = {
  assign: '分派工单',
  process: '处理工单',
  confirm: '确认关闭',
  cancel: '取消工单',
}

const actionCommentLabelMap: Record<string, string> = {
  assign: '分派备注',
  process: '处理备注',
  confirm: '确认备注',
  cancel: '取消原因',
}

const actionCommentPlaceholderMap: Record<string, string> = {
  assign: '请输入分派备注（可选）',
  process: '请输入处理备注（必填）',
  confirm: '请输入确认备注（可选）',
  cancel: '请输入取消原因（必填）',
}

const actionTitle = ref('')
const actionCommentLabel = ref('')
const actionCommentPlaceholder = ref('')

function openActionDialog(row: TicketVO, action: string) {
  currentAction.value = action
  actionTicketId.value = row.ticketId
  actionTitle.value = actionTitleMap[action] || action
  actionCommentLabel.value = actionCommentLabelMap[action] || '备注'
  actionCommentPlaceholder.value = actionCommentPlaceholderMap[action] || ''

  // 构建动态校验规则
  const isRequired = (action === 'process' || action === 'cancel')
  data.actionRules = {
    assigneeId: action === 'assign' ? [{ required: true, message: '请选择处理人', trigger: 'change' }] : [],
    comment: isRequired ? [{ required: true, message: '此项不能为空', trigger: 'blur' }] : [],
  }

  data.actionForm = { assigneeId: undefined, comment: undefined }

  // 分派需要加载用户列表
  if (action === 'assign') {
    loadUsers()
  }

  // 关闭 Drawer 打开操作 Dialog 时先关 Drawer
  actionOpen.value = true
}

function loadUsers() {
  listUser({ pageNum: 1, pageSize: 1000, status: '0' }).then(res => {
    userOptions.value = res.rows
  })
}

function submitAction() {
  proxy.$refs['actionRef'].validate((valid: boolean) => {
    if (!valid) return

    const id = actionTicketId.value
    const action = currentAction.value
    const formVal = actionForm.value

    let promise: Promise<any>
    switch (action) {
      case 'assign':
        promise = assignTicket(id, { assigneeId: formVal.assigneeId, comment: formVal.comment })
        break
      case 'process':
        promise = processTicket(id, { comment: formVal.comment })
        break
      case 'confirm':
        promise = confirmTicket(id, formVal.comment ? { comment: formVal.comment } : undefined)
        break
      case 'cancel':
        promise = cancelTicket(id, { comment: formVal.comment })
        break
      default:
        return
    }

    promise.then(() => {
      proxy.$modal.msgSuccess('操作成功')
      actionOpen.value = false
      getList()
      // 如果 Drawer 也开着，刷新详情
      if (detail.value && detail.value.ticketId === id) {
        getTicket(id).then(res => { detail.value = res.data! })
      }
    })
  })
}

// ── 评论 ──

function submitComment() {
  if (!commentForm.value.content.trim()) {
    proxy.$modal.msgWarning('评论内容不能为空')
    return
  }
  if (!detail.value) return
  commentLoading.value = true
  addComment(detail.value.ticketId, { content: commentForm.value.content }).then(() => {
    proxy.$modal.msgSuccess('评论成功')
    commentForm.value.content = ''
    commentLoading.value = false
    // 刷新评论列表
    getTicket(detail.value!.ticketId).then(res => {
      detail.value = res.data!
    })
  }).catch(() => {
    commentLoading.value = false
  })
}

// ── 满意度评价 ──

const satOpen = ref(false)
const satTitle = ref('')
const satLoading = ref(false)
const satExists = ref(false)
const satDetail = ref<TicketSatisfaction | null>(null)
const satTicketId = ref<number>(0)

function openSatDialog(row: TicketVO) {
  satTicketId.value = row.ticketId
  satTitle.value = '工单评价'
  satExists.value = false
  satDetail.value = null
  satForm.value = { score: 0, content: '' }
  satOpen.value = true
  // 查询已有评价
  getTicketSatisfaction(row.ticketId).then(res => {
    if (res.data) {
      satDetail.value = res.data
      satExists.value = true
      satTitle.value = '评价详情'
    }
  }).catch(() => {})
}

function submitSat() {
  proxy.$refs['satRef'].validate((valid: boolean) => {
    if (!valid) return
    satLoading.value = true
    submitSatisfaction(satTicketId.value, { score: satForm.value.score, content: satForm.value.content || undefined }).then(() => {
      proxy.$modal.msgSuccess('评价提交成功')
      satLoading.value = false
      satOpen.value = false
      getList()
    }).catch(() => {
      satLoading.value = false
    })
  })
}

// ── 标签映射 ──

function statusLabel(status?: string): string {
  if (!status) return '-'
  const m: Record<string, string> = {
    NEW: '待分派', PROCESSING: '处理中', WAIT_CONFIRM: '待确认', CLOSED: '已关闭', CANCELLED: '已取消',
  }
  return m[status] || status
}

function statusTagType(status?: string): string {
  if (!status) return 'info'
  const m: Record<string, string> = {
    NEW: 'info', PROCESSING: 'warning', WAIT_CONFIRM: '', CLOSED: 'success', CANCELLED: 'danger',
  }
  return m[status] || 'info'
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

function overdueLabel(flag?: string): string {
  return flag === '1' ? '超时' : '未超时'
}

function overdueTagType(flag?: string): string {
  return flag === '1' ? 'danger' : 'success'
}

function operationLabel(type: string): string {
  const m: Record<string, string> = {
    CREATE: '创建工单', ASSIGN: '分派工单', PROCESS: '处理工单', CONFIRM: '确认关闭', CANCEL: '取消工单',
  }
  return m[type] || type
}

// ── 启动 ──

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  h2 { margin: 0; flex: 1; }
}

.detail-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.comment-list {
  .comment-item {
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;
    &:last-child { border-bottom: none; }
    .comment-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      .comment-time { color: #999; font-size: 12px; }
    }
    .comment-content { white-space: pre-wrap; }
  }
}
</style>
