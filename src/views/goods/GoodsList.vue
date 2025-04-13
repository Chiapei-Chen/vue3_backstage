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
    <el-button type="primary" plain icon="Plus" @click="dialog.createGoods = true">New Goods</el-button>
  </div>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
      <el-table-column prop="Name" label="商品名稱"> </el-table-column>
      <el-table-column label="商品圖片">
        <template #default="{ row }">
          <img :src="row.ImageUrls[0].Url" alt="商品圖片" class="w-[120px] aspect-auto-[1]" />
        </template>
      </el-table-column>
      <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
    </el-table>
  </div>
  <!-- 新增商品 Dialog -->
  <CreateGoods v-model="dialog.createGoods"
   v-model:formModel="goodsForm" 
   @confirm="handleCreateGoods"
    @close="resetDialog" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoodsList } from './composables';
import CreateGoods from './components/dialog/CreateGoods.vue';
import { addGoods,updateGoods } from '@/service/api';
import { ElMessage } from 'element-plus';

const { searchFilter, tableData, tableLoading, goodsForm, goodsTypeList, getGoodsListRequest, getGoodsTypeList } =
  useGoodsList();

const dialog = ref({
  createGoods: false,
  updateGoods: false
});

const handleCreateGoods = async (formData) => {
  try {
    const res = await addGoods(formData);
    if (res.data.Code === 200) {
      console.log("新增商品成功:", res.data);
      ElMessage.success('新增成功');
      dialog.value.createGoods = false;
      getGoodsListRequest({}, false); // 重新載入商品列表
    } else {
      ElMessage.error(res.data.Message || '新增失敗');
    }
  } catch (error) {
    console.error('新增商品發生錯誤:', error);
    ElMessage.error('系統錯誤，請稍後再試');
  }
};
const resetDialog = () => {
  dialog.value.createGoods = false;
  goodsForm.value = {
    Name: '',
    Show: true,
    GoodsTypeID: 1,
    SpecsAllowance: 2,
    GoodsSpecs: [{ Specs: '' }],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  };
};

onMounted(async () => {
  await nextTick();
  getGoodsTypeList();
  // 初始化不需要帶額外搜尋條件，給空物件即可
  getGoodsListRequest({}, false);
});
</script>
