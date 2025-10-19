<template>
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
    <el-button class="btn--create" plain icon="Plus" @click="showAddDialog = true">
      新增商品
    </el-button>
  </div>

  <!--表格內容-->
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
    
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
  getGoodsTypeName,
  getGoodsListRequest,
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
  getGoodsListRequest({}, false)
}

/** 編輯成功後處理 */
const onEditSuccess = () => {
  ElMessage.success('已更新商品')
  showEditDialog.value = false
  getGoodsListRequest({}, false)
}

onMounted(async () => {
  await nextTick()
  getGoodsTypeList()
  getGoodsListRequest({}, false)
})
</script>
