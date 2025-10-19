<template>
  <div class="p-5">
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
      <div class="flex items-center gap-2">
        <div class="w-[140px]">
          <el-input v-model="searchKeyword" placeholder="搜尋分類名稱" clearable />

        </div>
      </div>

      <el-button type="primary" icon="Search" @click="getGoodsTypeList">搜尋</el-button>
      <el-button class="btn--create" plain icon="Plus" @click="showAddDialog = true">
        新增分類
      </el-button>
    </div>

    <!--表格內容-->
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="ID" label="ID" width="80" />
        <el-table-column prop="Name" label="分類名稱" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" @click="clickOpenEditModal(row)">編輯</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 Dialog -->
      <GoodsTypeAddModal v-model:visible="showAddDialog" @confirm="handleAddSuccess" @close="showAddDialog = false" />

      <!-- 編輯 Dialog -->
      <GoodsTypeEditModal v-model:visible="showEditDialog" :editData="editForm" @confirm="handleEditSuccess"
        @close="showEditDialog = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGoodsTypeList } from './composables'
import { ElMessage } from 'element-plus'
import GoodsTypeAddModal from './components/GoodsTypeAddModal.vue'
import GoodsTypeEditModal from './components/GoodsTypeEditModal.vue'

const {
  searchFilter,
  tableData,
  tableLoading,
  goodsForm,
  goodsTypeList,
  getGoodsTypeName,
  getGoodsListRequest,
  getGoodsTypeList,
} = useGoodsTypeList()

const showAddModal = ref(false);
const showEditModal = ref(false);
const editForm = ref({});
//---------------------------------------------------------
/** 點擊開啟【編輯】彈跳視窗 */
const clickOpenEditModal = (row) => {
  editForm.value = { ...row };
  showEditModal.value = true;
}

/** 處理【新增】成功 */
const handleAddSuccess = () => {
  ElMessage.success('新增成功');
  showAddModal.value = false;
  getGoodsTypeList();
};

/** 處理【編輯】成功 */
const handleEditSuccess = () => {
  ElMessage.success('更新成功');
  getGoodsTypeList();
};

onMounted(() => {
  getGoodsTypeList()
})
</script>
