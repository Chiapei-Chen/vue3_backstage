<template>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1"> <!--搜尋-->
        <!--搜尋-->
        <div class="flex items-center gap-2">
            <div class="w-[140px]">

            </div>
            <el-button type="warning" icon="Search" @click="">搜尋</el-button>
        </div>
    </div>
    <!--表格內容-->
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <el-table :data="tableData" stripe v-loading="tableLoading">
            <el-table-column prop="Account" label="帳號"></el-table-column>
            <el-table-column prop="Password" label="密碼"></el-table-column>
            <el-table-column prop="Name" label="姓名"></el-table-column>
            <el-table-column prop="Email" label="信箱"></el-table-column>
            <el-table-column prop="Phone" label="電話"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAdminList } from './composables/useAdminList';
import { fa } from 'element-plus/es/locale';

const { tableData, tableLoading, adminForm, getAdminRequest } = useAdminList();

const dialog = ref({
    dialogVisible: false,
    isEditModel: false
});

const openEditDialog = (row) => {
    adminForm.value = {
        ...row,
    };
    dialog.value.dialogVisible = true;
    dialog.value.isEditModel = true;
}

onMounted(async () => {
    await nextTick();
    getAdminRequest();
})

</script>