<template>
  <!--基本資訊內容-->
  <el-dialog v-model="visible"  :title="isEdit ? '編輯資料' : '新增資料'"  :width="width" @close="emit('close')">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="帳號" prop="account">
        <el-input v-model="formData.account" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item label="信箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
    </el-form>
  <!--權限表格內容-->
    <el-table :data="rows" style="width: 100%">
  <el-table-column prop="name" label="權限名稱" />
  <el-table-column label="啟用">
    <template #default="{ row }">
      <el-checkbox v-model="row.activity" />
    </template>
  </el-table-column>
</el-table>

  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, computed,reactive } from 'vue';

import { usePermission } from '../composables/usePermission'

const { permissionTableLoading, permissionTableData, getPermissionRequest } = usePermission();
/* ----------------------
  Props
----------------------- */
const props = defineProps({
  width: { type: [String, Number], default: 500 },
  // 預期是一個「鍵是權限名稱、值是物件」的字典
  // 例如：{ admin_manage_add: { Activity: true }, ... }
  permissionTableData: {},
  isEdit: { type: Boolean, default: false },
})

const personData = defineModel('formData');
const submit = () => {
  // 通過驗證

  //就送出

}
// const rows = computed(() => {
//   const dict = props.permissionTableData ?? {}
//   console.log(dict, 'dic')
//   return Object.entries(dict).map(([key, val]) => ({
//     name: key,
//     activity: !!val.Activity,
//   }))
// })
const rows = computed(() => {
  const dict = props.permissionTableData.value ?? {}   // 👈 要加 .value
  console.log(dict, 'dic')
  return Object.entries(dict).map(([key, val]) => ({
    name: key,
    activity: !!val.Activity,
  }))
})

// interface PersonData{
// account:'string',
// password:'string',
// name:'string',
// email:'string',
// phone:'string',
// }

const formData = reactive ({
  account: "",
  password: "",
  name: "",
  email: "",
  phone: "",
});

/* ----------------------
  Emits 元件聲明事件
----------------------- */
const emit = defineEmits(['close', 'confirm']);

/* ----------------------
  Models
----------------------- */
// 控制是否顯示
const visible = defineModel();


onMounted(async () => {
  await nextTick();
})

</script>