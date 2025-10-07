<template>
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <!--搜尋-->
        <div class="flex items-center gap-2">
            <el-form :inline="true" :model="queryForm">
                <el-form-item label="帳號">
                    <el-input v-model="queryForm.Account" placeholder="輸入帳號" clearable />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="queryForm.Name" placeholder="輸入姓名" clearable />
                </el-form-item>
                <el-button type="warning" icon="Search" @click="clickSearch">搜尋</el-button>
            </el-form>
        </div>
        <el-button type="success" icon="Plus" @click="clickOpenAddDialog">新增管理員</el-button>
    </div>
    <!--表格內容-->
    <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
        <el-table :data="tableData" stripe v-loading="tableLoading">
            <el-table-column prop="Account" label="帳號"></el-table-column>
            <el-table-column prop="Name" label="姓名"></el-table-column>
            <el-table-column prop="Email" label="信箱"> </el-table-column>
            <el-table-column prop="Phone" label="電話"></el-table-column>

            <el-table-column label="操作">

                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="clickOpenEditDialog(row)">編輯</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <Permission v-model="dialog.dialogVisible" v-model:formModel="adminForm" :isEdit="dialog.isEditMode"
        :permissionTableData="permissionTableData" @confirm="clickSubmit" @close="clickCloseDialog" />

    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
        v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"  />

</template>

<script setup>
import { toRaw, ref, onMounted, nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Permission from "./components/Permission.vue"
import { useAdminList } from './composables/useAdminList';
import { usePermission } from './composables/usePermission';
import { addAdminMembers, updateAdminMembers, updateAdminPermissions } from '@/service/api';

const { tableData, tableLoading, adminForm, getAdminRequest, pagination } = useAdminList();
const { getPermissionRequest, permissionTableData } = usePermission();

/** 彈跳視窗 */
const dialog = ref({
    dialogVisible: false,
    isEditMode: false,
});
/** 查詢表單 */
const queryForm = reactive({
    Account: '',
    Password: '',
    Name: '',
    Email: '',
    Phone: '',
    Page: 1,
    PageLimit: 10,
});

/* ----------------------
  Methods
----------------------- */
/** 點擊打開【新增】彈跳視窗 */
const clickOpenAddDialog = () => {
    // 管理員資料
    adminForm.value = {
        ID: null,
        Account: "",
        Password: "",
        Name: "",
        Email: "",
        Phone: "",
    };

    // 權限資料
    permissionTableData.value = {
        home_dashboard: { Activity: false },
        admin_manage_add: { Activity: false },
        admin_manage_del: { Activity: false },
        admin_manage_edit: { Activity: false },
        admin_manage_page: { Activity: false },
        goods_manage_add: { Activity: false },
        goods_manage_del: { Activity: false },
        goods_manage_edit_goods: { Activity: false },
        goods_manage_edit_type: { Activity: false },
        goods_manage_page: { Activity: false },
        member_manage_del: { Activity: false },
        member_manage_detail: { Activity: false },
        member_manage_page: { Activity: false },
        order_manage_del: { Activity: false },
        order_manage_edit: { Activity: false },
        order_manage_page: { Activity: false },
    };
    dialog.value.dialogVisible = true;
    dialog.value.isEditMode = false;
}

/** 點擊打開【編輯】彈跳視窗 */
const clickOpenEditDialog = (row) => {

    getPermissionRequest(row.ID)
    adminForm.value = {
        ...row,
    };
    dialog.value.dialogVisible = true;
    dialog.value.isEditMode = true;

}

/** 點擊【關閉】彈跳視窗 */
const clickCloseDialog = () => {
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
            if (!memberRsponse.data?.Data.ID) {
                ElMessage.error('取得管理員ID失敗，無法新增其權限')
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
        clickCloseDialog();
         getAdminRequest(queryForm);

    } catch (error) {
        console.error('操作發生錯誤:', error);
        ElMessage.error('系統錯誤，請稍後再試');
    }
};

/** 點擊【搜尋】 */
const clickSearch = async () => {
    const response = await getAdminRequest(queryForm);

    if (!response) {
        ElMessage.error('查詢失敗，請稍後再試');
    }
    console.log(response, "rsp");
    ElMessage.success('查詢成功');
};
onMounted(async () => {
    await nextTick();
    getAdminRequest(queryForm);
})

</script>