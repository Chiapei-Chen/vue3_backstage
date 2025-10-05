<template>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1"> <!--搜尋-->
        <!--搜尋-->
        <div class="flex items-center gap-2">
            <div class="w-[140px]">

            </div>
            <el-button type="warning" icon="Search" @click="">搜尋</el-button>
        </div>
        <el-button type="primary" icon="Plus" @click="openAddDialog">新增管理員</el-button>
    </div>
    <!--表格內容-->
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <el-table :data="tableData" stripe v-loading="tableLoading">
            <el-table-column prop="Account" label="帳號"></el-table-column>
            <el-table-column prop="Password" label="密碼"></el-table-column>
            <el-table-column prop="Name" label="姓名"></el-table-column>
            <el-table-column prop="Email" label="信箱"> </el-table-column>
            <el-table-column prop="Phone" label="電話"></el-table-column>

            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="openEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <Permission v-model="dialog.dialogVisible" v-model:formModel="adminForm" :isEdit="dialog.isEditMode"
        :permissionTableData="permissionTableData" @confirm="clickSubmit" @close="clickClose" />
</template>

<script setup>
import { toRaw, ref, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import Permission from "./components/Permission.vue"
import { useAdminList } from './composables/useAdminList';
import { usePermission } from './composables/usePermission';
import { addAdminMembers, updateAdminMembers, updateAdminPermissions } from '@/service/api';

const { tableData, tableLoading, adminForm, getAdminRequest } = useAdminList();
const { getPermissionRequest, permissionTableData } = usePermission();

/** 彈跳視窗 */
const dialog = ref({
    dialogVisible: false,
    isEditMode: false,
});

/**打開【新增】彈跳視窗 */
const openAddDialog = () => {
    adminForm.value = {
        ID: null,
        Account: "",
        Password: "",
        Name: "",
        Email: "",
        Phone: "",
    };
    dialog.value.dialogVisible = true;
    dialog.value.isEditMode = false;
}
/**打開【編輯】彈跳視窗 */
const openEditDialog = (row) => {

    getPermissionRequest(row.ID)
    adminForm.value = {
        ...row,
    };
    dialog.value.dialogVisible = true;
    dialog.value.isEditMode = true;

}

/** 點擊【關閉】 */
const clickClose = () => {
    dialog.value.dialogVisible = false;
    dialog.value.isEditMode = false;
    adminForm.value = {
        ID: null,
        Account: "",
        Password: "",
        Name: "",
        Email: "",
        Phone: "",
    };
}

/** 點擊【提交】 */
const clickSubmit = async ({ form, permissions: updatedPermissions }) => {

    // 把 reactive proxy 轉回普通物件
    const rawForm = toRaw(form);
    const rawPermissions = toRaw(updatedPermissions);

    console.log("要送出的表單資料:", rawForm);
    console.log("要送出的權限資料:", rawPermissions);

    try {
        if (dialog.value.isEditMode) {
            // 編輯模式：更新權限 + 更新個人資料
            const memberRsponse = await updateAdminMembers(rawForm);
            if (memberRsponse.data.Code != 200) {
                ElMessage.error('個人資料操作失敗，請稍後再試');
            }
            const permissionResponse = await updateAdminPermissions({
                MemberID: rawForm.ID,
                MemberPermission: rawPermissions,
            });
            if (permissionResponse.data.Code != 200) {
                ElMessage.error('權限操作失敗，請稍後再試');
            }

        } else {
            // 新增模式：新增個人資料 + 新增權限
            const memberRsponse = await addAdminMembers(rawForm);
            if (memberRsponse.data.Code != 200) {
                ElMessage.error('個人資料操作失敗，請稍後再試');
            }
            if (!memberRsponse.data?.MemberID) {
                ElMessage.error('取得管理員失敗，無法新增其權限')
            }
            const permissionResponse = await updateAdminPermissions({
                MemberID: memberRsponse.MemberID,
                MemberPermission: rawPermissions,
            });
            if (permissionResponse.data.Code != 200) {
                ElMessage.error('權限操作失敗，請稍後再試');
            }
        }

        ElMessage.success('操作成功');
        clickClose();

    } catch (error) {
        console.error('操作發生錯誤:', error);
        ElMessage.error('系統錯誤，請稍後再試');
    }
};

onMounted(async () => {
    await nextTick();
    getAdminRequest();
})

</script>