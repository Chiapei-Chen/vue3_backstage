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
    <PermissionAddModal v-model="addDialogVisible" v-model:formModel="addForm"
        :permissionTableData="permissionTableData" @confirm="handleAddConfirm" @close="addDialogVisible = false" />

    <PermissionEditModal v-model="editDialogVisible" v-model:formModel="editForm"
        :permissionTableData="permissionTableData" @confirm="handleEditConfirm" @close="editDialogVisible = false" />

    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
        v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]" />
</template>

<script setup lang="ts">
import { toRaw, ref, onMounted, nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PermissionAddModal from './components/PermissionAddModal.vue'
import PermissionEditModal from './components/PermissionEditModal.vue'
import { useAdminList } from './composables/useAdminList'
import { usePermission } from './composables/usePermission'
import { addAdminMembers, updateAdminMembers, updateAdminPermissions } from '@/service/api'

/* ----------------------
  Composables
----------------------- */
const { tableData, tableLoading, adminForm, getAdminRequest, pagination } = useAdminList()
const { getPermissionRequest, permissionTableData } = usePermission()

/* ----------------------
  Dialog 開關控制
----------------------- */
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)

/* ----------------------
  表單資料
----------------------- */
const addForm = ref({
  ID: null,
  Account: '',
  Password: '',
  Name: '',
  Email: '',
  Phone: '',
})

const editForm = ref({
  ID: null,
  Account: '',
  Password: '',
  Name: '',
  Email: '',
  Phone: '',
})

/* ----------------------
  查詢表單
----------------------- */
const queryForm = reactive({
  Account: '',
  Name: '',
  Page: 1,
  PageLimit: 10,
})

/* ----------------------
  Methods
----------------------- */
/** 開啟【新增】Modal */
const clickOpenAddDialog = () => {
  addForm.value = {
    ID: null,
    Account: '',
    Password: '',
    Name: '',
    Email: '',
    Phone: '',
  }

  // 重設權限
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
  }

  addDialogVisible.value = true
}

/** 開啟【編輯】Modal */
const clickOpenEditDialog = async (row) => {
  await getPermissionRequest(row.ID)
  editForm.value = { ...row }
  editDialogVisible.value = true
}

/** 【新增】確認送出 */
const handleAddConfirm = async ({ form, permissions }) => {
  const rawForm = toRaw(form)
  const rawPermissions = toRaw(permissions)

  try {
    const memberResponse = await addAdminMembers(rawForm)
    if (memberResponse.data.Code !== 200) {
      ElMessage.error('新增失敗')
      return
    }

    const newId = memberResponse.data?.Data?.ID
    if (!newId) {
      ElMessage.error('無法取得管理員ID')
      return
    }

    const permissionResponse = await updateAdminPermissions({
      MemberID: newId,
      MemberPermission: rawPermissions,
    })

    if (permissionResponse.data.Code !== 200) {
      ElMessage.error('權限設定失敗')
      return
    }

    ElMessage.success('新增成功');
    addDialogVisible.value = false;
    getAdminRequest(queryForm);
  } catch (err) {
    console.error(err)
    ElMessage.error('系統錯誤')
  }
}

/** 【編輯】確認送出 */
const handleEditConfirm = async ({ form, permissions }) => {
  const rawForm = toRaw(form)
  const rawPermissions = toRaw(permissions)

  try {
    const memberResponse = await updateAdminMembers(rawForm)
    if (memberResponse.data.Code !== 200) {
      ElMessage.error('資料更新失敗')
      return
    }

    const permissionResponse = await updateAdminPermissions({
      MemberID: rawForm.ID,
      MemberPermission: rawPermissions,
    })

    if (permissionResponse.data.Code !== 200) {
      ElMessage.error('權限更新失敗')
      return
    }

    ElMessage.success('編輯成功')
    editDialogVisible.value = false
    getAdminRequest(queryForm)
  } catch (err) {
    console.error(err)
    ElMessage.error('系統錯誤')
  }
}

/** 搜尋 */
const clickSearch = async () => {
  const res = await getAdminRequest(queryForm)
  if (!res) return ElMessage.error('查詢失敗')
  ElMessage.success('查詢成功')
}

/* ----------------------
  初始化
----------------------- */
onMounted(async () => {
  await nextTick()
  getAdminRequest(queryForm)
})
</script>
