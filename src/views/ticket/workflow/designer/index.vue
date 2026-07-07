<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Edit" @click="handleSave">保存草稿</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Check" @click="handlePublish" v-hasPermi="['ticket:workflow:publish']">发布</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
      </el-col>
    </el-row>

    <!-- 基本信息 -->
    <el-row :gutter="20" v-if="definition">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <span>流程设计 — {{ definition.name }}</span>
            <el-tag :type="definition.status === 'PUBLISHED' ? 'success' : 'info'" size="small" style="margin-left: 12px">
              {{ definition.status === 'PUBLISHED' ? '已发布' : '草稿' }}
            </el-tag>
          </template>

          <!-- 节点列表 -->
          <div class="node-list">
            <div v-for="(node, index) in nodes" :key="node.nodeKey" class="node-item" :class="{ 'node-active': activeIndex === index }" @click="activeIndex = index">
              <div class="node-index">{{ index + 1 }}</div>
              <div class="node-body">
                <div class="node-header">
                  <el-tag :type="nodeTagType(node.type)" size="small">{{ nodeTypeLabel(node.type) }}</el-tag>
                  <span class="node-name">{{ node.name }}</span>
                  <span v-if="node.assignType" class="node-assign">→ {{ assignTypeLabel(node.assignType) }}{{ node.assignValue ? '：' + node.assignValue : '' }}</span>
                </div>
              </div>
              <div class="node-actions">
                <el-button link type="danger" icon="Delete" @click.stop="removeNode(index)" :disabled="nodes.length <= 2" />
                <el-button link type="primary" icon="Top" @click.stop="moveNode(index, -1)" :disabled="index === 0" />
                <el-button link type="primary" icon="Bottom" @click.stop="moveNode(index, 1)" :disabled="index === nodes.length - 1" />
              </div>
            </div>

            <!-- 添加节点 -->
            <div class="node-add">
              <el-dropdown @command="addNode">
                <el-button icon="Plus">添加节点</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="APPROVAL" icon="User">人工审批</el-dropdown-item>
                    <el-dropdown-item command="CONDITION" icon="Switch">条件分支</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 节点属性面板 -->
      <el-col :span="8" v-if="activeIndex !== null && nodes[activeIndex]">
        <el-card shadow="never">
          <template #header><span>节点属性</span></template>
          <el-form :model="editNode" label-width="80px" size="small">
            <el-form-item label="名称">
              <el-input v-model="editNode.name" placeholder="节点名称" />
            </el-form-item>
            <el-form-item label="类型">
              <el-tag size="small">{{ nodeTypeLabel(editNode.type!) }}</el-tag>
            </el-form-item>
            <el-form-item v-if="editNode.type === 'APPROVAL'" label="处理人">
              <el-select v-model="editNode.assignType" placeholder="选择处理人类型" style="width:100%">
                <el-option v-for="item in assignTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="editNode.type === 'APPROVAL' && editNode.assignType === 'USER'" label="指定用户">
              <el-input v-model="editNode.assignValue" placeholder="用户ID" />
            </el-form-item>
            <el-form-item v-if="editNode.type === 'APPROVAL' && editNode.assignType === 'ROLE'" label="角色编码">
              <el-input v-model="editNode.assignValue" placeholder="角色编码" />
            </el-form-item>
            <el-form-item v-if="editNode.type === 'CONDITION'" label="条件表达式">
              <el-input v-model="editNode.assignValue" placeholder="如：priority == 'URGENT'" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="WorkflowDesigner">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorkflow, updateWorkflow, publishWorkflow } from '@/api/ticket/workflow'
import { nodeTypeOptions, assignTypeOptions } from '@/types/ticket/workflow'
import type { WorkflowDefinition, WorkflowNode, WorkflowFormDTO } from '@/types/ticket/workflow'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()! as any

const id = Number(route.params.id)
const definition = ref<WorkflowDefinition | null>(null)
const nodes = ref<WorkflowNode[]>([])
const activeIndex = ref<number | null>(null)
const editNode = ref<Partial<WorkflowNode>>({})

// Initialize default nodes
function initNodes(def: WorkflowDefinition) {
  if (def.nodes && def.nodes.length > 0) {
    nodes.value = def.nodes
  } else {
    nodes.value = [
      { nodeKey: 'start', name: '开始', type: 'START' },
      { nodeKey: 'end', name: '结束', type: 'END' },
    ]
  }
}

onMounted(() => {
  getWorkflow(id).then(res => {
    definition.value = res.data!
    initNodes(res.data!)
  })
})

function addNode(type: string) {
  const key = 'node_' + Date.now()
  nodes.value.splice(nodes.value.length - 1, 0, {
    nodeKey: key,
    name: type === 'APPROVAL' ? '审批节点' : '条件分支',
    type: type as any,
    assignType: type === 'APPROVAL' ? 'ROLE' as any : undefined,
    assignValue: undefined,
  })
  activeIndex.value = nodes.value.length - 2
  editNode.value = { ...nodes.value[activeIndex.value] }
}

function removeNode(index: number) { nodes.value.splice(index, 1); if (activeIndex.value === index) activeIndex.value = null }

function moveNode(index: number, direction: number) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= nodes.value.length) return
  const temp = nodes.value[index]
  nodes.value.splice(index, 1)
  nodes.value.splice(newIndex, 0, temp)
  activeIndex.value = newIndex
}

function buildForm(): WorkflowFormDTO {
  return {
    name: definition.value!.name,
    description: definition.value!.description,
    nodes: nodes.value,
    edges: nodes.value.slice(0, -1).map((n, i) => ({
      edgeKey: 'e_' + n.nodeKey + '_' + nodes.value[i + 1].nodeKey,
      sourceNodeKey: n.nodeKey,
      targetNodeKey: nodes.value[i + 1].nodeKey,
      condition: n.type === 'CONDITION' ? n.assignValue : undefined,
    })),
  }
}

function handleSave() {
  updateWorkflow(id, buildForm()).then(() => { proxy.$modal.msgSuccess('保存成功') })
}

function handlePublish() {
  proxy.$modal.confirm('发布后不可修改，确认发布？').then(() => {
    updateWorkflow(id, buildForm()).then(() => {
      return publishWorkflow(id)
    }).then(() => {
      proxy.$modal.msgSuccess('发布成功'); getWorkflow(id).then(res => { definition.value = res.data!; initNodes(res.data!) })
    })
  }).catch(() => {})
}

function nodeTypeLabel(type: string): string {
  const m: Record<string, string> = { START: '开始', END: '结束', APPROVAL: '人工审批', CONDITION: '条件分支' }
  return m[type] || type
}

function nodeTagType(type: string): string {
  const m: Record<string, string> = { START: '', END: 'danger', APPROVAL: 'warning', CONDITION: 'info' }
  return m[type] || ''
}

function assignTypeLabel(type: string): string {
  const m: Record<string, string> = { USER: '指定用户', ROLE: '角色', DEPT_LEADER: '部门负责人', CREATOR_LEADER: '创建人上级', INITIATOR: '流程发起人' }
  return m[type] || type
}

// When active node changes, update edit form
import { watch } from 'vue'
watch(activeIndex, (idx) => {
  if (idx !== null && nodes.value[idx]) {
    editNode.value = { ...nodes.value[idx] }
  }
})
watch(editNode, (val) => {
  if (activeIndex.value !== null && nodes.value[activeIndex.value]) {
    Object.assign(nodes.value[activeIndex.value], val)
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.node-list {
  .node-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover { border-color: #409eff; }
    &.node-active { border-color: #409eff; background-color: #ecf5ff; }
  }

  .node-index {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #409eff;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    margin-right: 12px; flex-shrink: 0;
  }

  .node-body { flex: 1; min-width: 0; }
  .node-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .node-name { font-weight: 600; }
  .node-assign { color: #909399; font-size: 13px; }

  .node-actions {
    display: flex; gap: 4px; flex-shrink: 0;
    opacity: 0; transition: opacity 0.2s;
  }
  .node-item:hover .node-actions { opacity: 1; }

  .node-add { text-align: center; margin-top: 16px; }
}
</style>
