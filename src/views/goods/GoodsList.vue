<template>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <div class="flex items-center gap-2">
      <div class="w-[140px]">
        <el-input v-model="searchFilter.ID" placeholder="Search By ID" clearable />
      </div>
      <div class="w-[180px]">
        <el-select v-model="searchFilter.GoodsType" placeholder="Select Goods Type" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
      <el-button type="primary" icon="Search" @click="getGoodsListRequest(searchFilter, false)">Search</el-button>
    </div>
    <el-button type="primary" plain icon="Plus" @click="dialog.goodsDialogVisible = true">新增商品</el-button>
  </div>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
      <el-table-column prop="GoodsTypeID" label="商品分類"></el-table-column>
      <el-table-column prop="Name" label="商品名稱"> </el-table-column>
      <!-- <el-table-column label="商品圖片">
        <template #default="{ row }">
          <img :src="row.ImagesIdnet[0].Url" alt="商品圖片" class="w-[120px] aspect-auto-[1]" />
        </template>
</el-table-column> -->
      <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <!-- 新增商品&編輯商品 Dialog -->
  <CreateEditGoods v-model="dialog.goodsDialogVisible" v-model:formModel="goodsForm" :isEdit="dialog.IsEditMode"
    @confirm="handleSaveGoods" @close="resetDialog" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useGoodsList } from './composables';
import CreateEditGoods from './components/dialog/CreateEditGoods.vue';
import { addGoods, updateGoods } from '@/service/api';
import { ElMessage } from 'element-plus';

const { searchFilter, tableData, tableLoading, goodsForm, goodsTypeList, getGoodsListRequest, getGoodsTypeList } =
  useGoodsList();

// 彈跳視窗
const dialog = ref({
  goodsDialogVisible: false,
  IsEditMode: false
});

// 開啟編輯商品彈跳視窗
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

// 儲存商品
const handleSaveGoods = async (formData) => {
  try {
    const apiFn = dialog.value.IsEditMode ? updateGoods : addGoods;
    const res = await apiFn(formData);
    if (res.data.Code === 200) {
      ElMessage.success(dialog.value.IsEditMode ? '更新成功' : '新增成功');
      dialog.value.goodsDialogVisible = false;
      dialog.value.IsEditMode = false; //重新設定為新增
      getGoodsListRequest({}, false);    // 重新載入列表
    } else {
      ElMessage.error(res.data.Message || '操作失敗');
    }
  } catch (error) {
    console.error('操作商品發生錯誤:', error);
    ElMessage.error('系統錯誤，請稍後再試');
  }
};

// 重置彈跳視窗
const resetDialog = () => {
  dialog.value.goodsDialogVisible = false;
  dialog.value.IsEditMode = false;
  goodsForm.value = {
    Name: '',
    Show: true,
    GoodsTypeID: 1,
    SpecsAllowance: 2,
    GoodsSpecs: [{ Specs: '' }],
    UnitPrice: 0,
    ImagesIdnet: [],   // 用陣列
    Description: ''
  };
};


onMounted(async () => {
  await nextTick();
  getGoodsTypeList();
  // 初始化不需要帶額外搜尋條件
  getGoodsListRequest({}, false);
});
</script>
