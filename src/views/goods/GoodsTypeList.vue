<template>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <!-- 查詢 -->
        <div class="flex items-center gap-2">
            <div class="w-[140px]">
                <!-- <el-input v-model="searchFilter.ID" placeholder="Search By ID" clearable /> -->
            </div>
        </div>
        <el-button type="primary" plain icon="Plus"  @click="dialog.goodsTypeDialogVisible = true">新增商品分類</el-button>
    </div>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
            <el-table-column prop="ID" label="ID"> </el-table-column>
            <el-table-column prop="Name" label="分類名稱"> </el-table-column>
            <el-table-column label="操作" width="80">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 新增分類&編輯 Dialog -->
    <CreateEditGoodsType v-model:formModek="gooodsTypeForm" :isEdit="dialog.IsEditMode" @confirm="handleSaveGoodsType"
        @close="resetDialog" />
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useGoodsTypeList } from '@/views/goods/composables/useGoodsTypeList'
import CreateEditGoodsType from './components/dialog/CreateEditGoods.vue';

const { tableData, tableLoading, getGoodsTypeTableList, getGoodsTypeList } =
    useGoodsTypeList();

// 彈跳視窗
const dialog = ref({
    goodsTypeDialogVisible: false,
    IsEditMode: false
});

onMounted(async () => {
    await nextTick();
    getGoodsTypeTableList();
});

// 彈跳視窗
const openEditDialog = (row) => {
    gooodsTypeForm.value = {
        ...row,
    };
console.log("open dialog");
dialog.value.goodsTypeDialogVisible = true;
dialog.value.IsEditMode = true;
}

// 儲存商品
const handleSaveGoodsType = async (formData) => {
    try {
        const apiFn = dialog.value.IsEditMode ? updateGoodsType : addGoodsType;
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

// 重置彈跳視窗 
const resetDialog = () => {
    dialog.value.goodsTypeDialogVisible = false;
    dialog.value.IsEditMode = false;
    gooodsTypeForm.value = {
        Name: '',
    };
}
</script>