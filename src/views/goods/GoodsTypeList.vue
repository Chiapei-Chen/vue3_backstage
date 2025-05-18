<template>
    <div class="p-3 bg-white rounded">
        <el-button type="primary" plain icon="Plus" @click="openCreateDialog">新增商品分類</el-button>

        <el-table :data="tableData" stripe v-loading="tableLoading" class="my-3">
            <el-table-column prop="ID" label="ID" width="80" />
            <el-table-column prop="Name" label="分類名稱" />
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 彈跳視窗 !!-->
    <CreateEditGoodsType v-model:visible="dialog.goodsTypeDialogVisible" v-model:formModel="goodsTypeForm"
        :isEdit="dialog.IsEditMode" @confirm="handleSaveGoodsType" @close="resetDialog" />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import CreateEditGoodsType from '@/views/goods/components/dialog/CreateEditGoodsType.vue';
import { useGoodsTypeList } from '@/views/goods/composables/useGoodsTypeList';
import { addGoodsType, updateGoodsType } from '@/service/api';
import { ElMessage } from 'element-plus';

const {
    tableData,
    tableLoading,
    goodsTypeForm,
    getGoodsTypeTableList,
} = useGoodsTypeList();

const dialog = ref({
    goodsTypeDialogVisible: false,
    IsEditMode: false,
});

onMounted(async () => {
    await nextTick();
    getGoodsTypeTableList();
});

const openCreateDialog = () => {
    console.log('openCreateDialog');
    goodsTypeForm.value = { ID: null, Name: '', Show: true };
    dialog.value.goodsTypeDialogVisible = true;
    console.log('👀 dialog visible =', dialog.value.goodsTypeDialogVisible);
    dialog.value.IsEditMode = false;
};

const openEditDialog = (row: any) => {
    goodsTypeForm.value = { ...row };
    dialog.value.goodsTypeDialogVisible = true;
    dialog.value.IsEditMode = true;
};

const handleSaveGoodsType = async (formData: any) => {
    try {
        const apiFn = dialog.value.IsEditMode ? updateGoodsType : addGoodsType;
        const res = await apiFn(formData);
        if (res.data?.Code === 200) {
            ElMessage.success(dialog.value.IsEditMode ? '更新成功' : '新增成功');
            dialog.value.goodsTypeDialogVisible = false;
            dialog.value.IsEditMode = false;
            getGoodsTypeTableList();
        } else {
            ElMessage.error(res.data.Message || '操作失敗');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('系統錯誤');
    }
};

const resetDialog = () => {
    dialog.value.goodsTypeDialogVisible = false;
    dialog.value.IsEditMode = false;
    goodsTypeForm.value = { ID: null, Name: '', Show: true };
};
</script>
