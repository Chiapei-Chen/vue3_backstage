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
      <el-button type="primary" icon="Search" @click="getGoodsListRequest(searchFilter, false)">搜尋</el-button>
    </div>
    <el-button class="btn--create" plain icon="Plus" @click="dialog.goodsDialogVisible = true">新增商品</el-button>
  </div>
  <!--表格內容-->
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
      <!-- <el-table-column prop="GoodsTypeID" label="商品分類"></el-table-column> -->
      <el-table-column label="商品分類">
        <template #default="{ row }">
          {{ getGoodsTypeName(row.GoodsTypeID) }}
        </template>
      </el-table-column>

      <el-table-column prop="Name" label="商品名稱"> </el-table-column>
      <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <!-- 新增商品&編輯商品 Dialog -->
  <GoodsAddModal v-model:visible="showAddDialog" :goodsTypeList="goodsTypeList" @confirm="handleAddConfirm" />

  <GoodsEditModal v-model:visible="showEditDialog" :editData="editForm" :goodsTypeList="goodsTypeList"
    @confirm="handleEditConfirm" />
  <CreateEditGoods v-model="dialog.goodsDialogVisible" v-model:formModel="goodsForm" :isEdit="dialog.IsEditMode"
    @confirm="clickSave" @close="clickResetDialog" :goodsTypeList="goodsTypeList" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useGoodsList } from './composables';
import GoodsAddModal from './components/GoodsAddModal.vue';
import GoodsEditModal from './components/GoodsAddModal.vue';
import { addGoods, updateGoods } from '@/service/api';
import { ElMessage } from 'element-plus';

const { searchFilter, tableData, tableLoading, goodsForm, goodsTypeList, getGoodsTypeName, getGoodsListRequest, getGoodsTypeList } =
  useGoodsList();

// 彈跳視窗
const dialog = ref({
  goodsDialogVisible: false,
  IsEditMode: false
});

/* 點擊【開啟編輯彈跳視窗】 */
const openEditDialog = (row) => {
  goodsForm.value = {
    ...row,
    GoodsSpecs: Array.isArray(row.GoodsSpecs) && row.GoodsSpecs.length
      ? row.GoodsSpecs
      : [{ Specs: '' }]
  };
  dialog.value.goodsDialogVisible = true;
  dialog.value.IsEditMode = true;
};

/** 點擊【重設彈跳視窗】 */ 
const clickResetDialog = () => {
  dialog.value.goodsDialogVisible = false;
  dialog.value.IsEditMode = false;
  goodsForm.value = {
    Name: 
    '',
    Show: true,
    GoodsTypeID: 1,
    SpecsAllowance: 2,
    GoodsSpecs: [{ Specs: '' }],
    UnitPrice: 0,
    ImagesIdnet: [],   // 用陣列
    Description: ''
  };
};

/** 點擊【儲存】 */ 
const clickSave = async (formData) => {
  try {
    const apiFn = dialog.value.IsEditMode ? updateGoods : addGoods;
    const res = await apiFn(formData);
    if (res.data.Code === 200) {
      ElMessage.success(dialog.value.IsEditMode ? '更新成功' : '新增成功');
      dialog.value.goodsDialogVisible = false;
      dialog.value.IsEditMode = false;
      getGoodsListRequest({}, false);    // 重新載入列表
    } else {
      ElMessage.error(res.data.Message || '操作失敗');
    }
  } catch (error) {
    console.error('操作商品發生錯誤:', error);
    ElMessage.error('系統錯誤，請稍後再試');
  }
};


onMounted(async () => {
  await nextTick();
  getGoodsTypeList();
  getGoodsListRequest({}, false);
});
</script>
