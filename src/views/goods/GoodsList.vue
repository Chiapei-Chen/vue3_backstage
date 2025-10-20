<template>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <!--搜尋-->
    <div class="flex items-center gap-2">
      <div class="w-[180px]">
        <el-select v-model="searchFilter.GoodsType" placeholder="選擇分類" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
      <div class="w-[180px]">
        <el-input v-model="searchFilter.GoodsName" placeholder="輸入商品名稱" clearable />
      </div>
      <el-button type="warning" icon="Search" @click="getGoodsListReq(searchFilter, false)">
        搜尋
      </el-button>
    </div>
    <el-button class="btn--create" plain icon="Plus" @click="showAddDialog = true">
      新增商品
    </el-button>
  </div>

  <!--表格內容-->
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
      <!-- <el-table-column prop="ID" label="ID" width="100" /> -->
      <el-table-column label="#" width="80">
        <template #default="{ $index }">
          {{ (pagination.currentPage - 1) * pagination.pageSize + ($index + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="商品分類">
        <template #default="{ row }">
          {{ getGoodsTypeName(row.GoodsTypeID) }}
        </template>
      </el-table-column>

      <el-table-column prop="Name" label="商品名稱" />
      <el-table-column prop="UnitPrice" label="價格" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
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

  <!-- 新增商品 -->
  <GoodsAddModal v-model:visible="showAddDialog" :goodsTypeList="goodsTypeList" @confirm="onAddSuccess"
    @close="showAddDialog = false" />

  <!-- 編輯商品 -->
  <GoodsEditModal v-model:visible="showEditDialog" :editData="editForm" :goodsTypeList="goodsTypeList"
    @confirm="onEditSuccess" @close="showEditDialog = false" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useGoodsList } from './composables'
import GoodsAddModal from './components/GoodsAddModal.vue'
import GoodsEditModal from './components/GoodsEditModal.vue'
import { ElMessage } from 'element-plus'

const {
  searchFilter,
  tableData,
  tableLoading,
  goodsForm,
  goodsTypeList,
  pagination,
  handlePageChange,
  handlePageSizeChange,
  getGoodsTypeName,
  getGoodsListReq,
  getGoodsTypeList,
} = useGoodsList()

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editForm = ref({})

const openEditDialog = (row) => {
  editForm.value = JSON.parse(JSON.stringify(row))
  showEditDialog.value = true
}

/** 新增成功後處理 */
const onAddSuccess = () => {
  ElMessage.success('已新增商品')
  showAddDialog.value = false
  getGoodsListReq({}, false)
}

/** 編輯成功後處理 */
const onEditSuccess = () => {
  ElMessage.success('已更新商品')
  showEditDialog.value = false
  getGoodsListReq({}, false)
}


// ---------------------------------------------------------------------------------
onMounted(async () => {
  await nextTick()
  getGoodsTypeList()
  getGoodsListReq({}, false)
})
</script>
