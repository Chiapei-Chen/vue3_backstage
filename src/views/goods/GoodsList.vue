<template>
  <div class="p-5">
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
      <!--搜尋-->
      <div class="flex items-center gap-2">
        <div class="w-[140px]">
          <el-input v-model="searchFilter.ID" placeholder="搜尋商品ID" clearable />
        </div>
        <div class="w-[180px]">
          <el-select v-model="searchFilter.GoodsType" placeholder="選擇分類" clearable>
            <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>

        <el-button type="primary" icon="Search" @click="getGoodsListRequest(searchFilter, false)">
          搜尋
        </el-button>
      </div>
      <el-button class="btn--create" plain icon="Plus" @click="showAddModal = true">
        新增商品
      </el-button>
    </div>

    <!--表格內容-->
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
      <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="ID" label="ID" width="100" />
        <el-table-column label="商品分類">
          <template #default="{ row }">
            {{ getGoodsTypeName(row.GoodsTypeID) }}
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="商品名稱" />
        <el-table-column prop="UnitPrice" label="價格" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="clickOpenEditModal(row)">編輯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

  <!-- 新增商品 -->
  <GoodsAddModal v-model:visible="showAddModal" :goodsTypeList="goodsTypeList" @confirm="handleAddSuccess"
    @close="showAddModal = false" />

  <!-- 編輯商品 -->
  <GoodsEditModal v-model:visible="showEditModal" :editData="editForm" :goodsTypeList="goodsTypeList"
    @confirm="handleEditSuccess" @close="showEditModal = false" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useGoodsList } from './composables'
import { ElMessage } from 'element-plus'
import GoodsAddModal from './components/GoodsAddModal.vue'
import GoodsEditModal from './components/GoodsEditModal.vue'

const {
  searchFilter,
  tableData,
  tableLoading,
  goodsForm,
  goodsTypeList,
  getGoodsTypeName,
  getGoodsListRequest,
  getGoodsTypeList,
} = useGoodsList()

const showAddModal = ref(false);
const showEditModal = ref(false);
const editForm = ref({});
//---------------------------------------------------------
/** 點擊開啟【編輯】彈跳視窗 */
const clickOpenEditModal = (row) => {
  editForm.value = JSON.parse(JSON.stringify(row))
  showEditModal.value = true
};

/** 處理【新增】成功 */
const handleAddSuccess = () => {
  ElMessage.success('已新增商品')
  showAddModal.value = false
  getGoodsListRequest({}, false)
}

/** 處理【編輯】成功 */
const handleEditSuccess = () => {
  ElMessage.success('已更新商品')
  showEditModal.value = false
  getGoodsListRequest({}, false)
}
//---------------------------------------------------------
onMounted(async () => {
  await nextTick()
  getGoodsTypeList()
  getGoodsListRequest({}, false)
})
</script>
