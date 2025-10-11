<template>
  <div>
    <!-- 搜尋與新增按鈕 -->
    <div class="flex justify-between p-3 bg-white rounded">
      <div>
        <el-input v-model="searchKeyword" placeholder="搜尋分類名稱" clearable />
        <el-button type="primary" icon="Search" @click="getGoodsTypeList">搜尋</el-button>
      </div>
      <el-button
        class="btn--create"
        plain
        icon="Plus"
        @click="showAddDialog = true"
      >
        新增分類
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="ID" label="ID" width="80" />
      <el-table-column prop="Name" label="分類名稱" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">編輯</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 Dialog -->
    <GoodsTypeAddModal
      v-model:visible="showAddDialog"
      @confirm="onAddSuccess"
      @close="showAddDialog = false"
    />

    <!-- 編輯 Dialog -->
    <GoodsTypeEditModal
      v-model:visible="showEditDialog"
      :editData="editForm"
      @confirm="onEditSuccess"
      @close="showEditDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGoodsType } from '@/service/api'
import { ElMessage } from 'element-plus'
import GoodsTypeAddModal from './components/GoodsTypeAddModal.vue'
import GoodsTypeEditModal from './components/GoodsTypeEditModal.vue'

const tableData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editForm = ref({})

const getGoodsTypeList = async () => {
  loading.value = true
  try {
    const res = await getGoodsType({})
    if (res?.data?.Code === 200) {
      tableData.value = res.data.Data
    }
  } finally {
    loading.value = false
  }
}

const openEditDialog = (row) => {
  editForm.value = { ...row }
  showEditDialog.value = true
}

const onAddSuccess = () => {
  ElMessage.success('新增成功')
  getGoodsTypeList()
}

const onEditSuccess = () => {
  ElMessage.success('更新成功')
  getGoodsTypeList()
}

onMounted(() => {
  getGoodsTypeList()
})
</script>
