<template>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <!-- 查詢 -->
        <div class="flex items-center gap-2">
            <div class="w-[140px]">
                <!-- <el-input v-model="searchFilter.ID" placeholder="Search By ID" clearable /> -->
            </div>
            <div class="w-[180px]">
                <!-- <el-select v-model="searchFilter.GoodsType" placeholder="Select Goods Type" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select> -->
            </div>
            <el-button type="info" icon="Search" @click="getGoodsTypeListRequest(searchFilter, false)">搜尋</el-button>
        </div>
        <el-button type="primary" plain icon="Plus">新增商品分類</el-button>
    </div>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
            <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
            <el-table-column prop="Name" label="分類名稱"> </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>
<script setup>
import { onMounted, nextTick } from 'vue';
import { useGoodsTypeList } from '@/views/goods/composables/useGoodsTypeList'

const { tableData,
    tableLoading, getGoodsTypeTableList } = useGoodsTypeList();

onMounted(async () => {
    await nextTick();
    getGoodsTypeTableList();
});
</script>