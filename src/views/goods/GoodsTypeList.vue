<template>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <!-- 搜尋-->
    <div class="flex items-center gap-2">
      <div class="w-[140px]">
        <el-input v-model="searchKeyword" placeholder="輸入分類名稱" clearable />
      </div>
      <el-button type="warning" icon="Search" @click="getGoodsTypeList">搜尋</el-button>
    </div>
    <el-button class="btn--create" plain icon="Plus" @click="showAddDialog = true">
      新增分類
    </el-button>
  </div>

  <!--表格內容-->
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="#" width="80">
        <template #default="{ $index }">
          {{ (pagination.currentPage - 1) * pagination.pageSize + ($index + 1) }}
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="分類名稱" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="clickOpenEditModal(row)">編輯</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="flex items-end justify-end p-3 my-3 rounded">
    <!-- 分頁 -->
    <el-pagination layout="total, sizes, prev, pager, next, jumper" :current-page="pagination.currentPage"
      :page-size="pagination.pageSize" :page-sizes="[10, 50, 100]" :total="pagination.total"
      @current-change="handlePageChange" @size-change="handlePageSizeChange" />
  </div>

  <!-- 新增商品類別Modal -->
  <GoodsTypeAddModal v-model:visible="showAddModal" @confirm="handleAddSuccess" @close="showAddModal = false" />
  <!-- 編輯商品類別Modal -->
  <GoodsTypeEditModal v-model:visible="showEditModal" :editData="editForm" @confirm="handleEditSuccess"
    @close="showEditModal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGoodsTypeList } from './composables'
import { ElMessage } from 'element-plus'
import GoodsTypeAddModal from './components/GoodsTypeAddModal.vue'
import GoodsTypeEditModal from './components/GoodsTypeEditModal.vue'

const {
  tableData,
  tableLoading,
  pagination,
  getGoodsTypeList,
} = useGoodsTypeList()

const showAddModal = ref(false);
const showEditModal = ref(false);
const editForm = ref({});
//---------------------------------------------------------
/** 點擊開啟【編輯】彈跳視窗 */
const clickOpenEditModal = (row) => {
  editForm.value = JSON.parse(JSON.stringify(row));
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
//---------------------------------------------------------
onMounted(() => {
  getGoodsTypeList()
})
</script>
