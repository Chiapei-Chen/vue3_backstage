<template>
  <!--基本資訊內容-->
  <el-dialog>
    <el-table>
      <el-form-item :model="formModel">
        <el-input v-model="formRef.name" label="姓名"></el-input>
        <el-input v-model="formRef.account" label="帳號"></el-input>
        <el-input v-model="formRef.password" label="密碼"></el-input>
        <el-input v-model="formRef.email" label="信箱"></el-input>
        <el-input v-model="formRef.phone" label="電話"></el-input>
      </el-form-item>
    </el-table>
  </el-dialog>
  <!--權限表格內容-->
  <el-dialog v-model="visible" :title="isEdit ? '編輯權限' : '新增權限'" :width="width" @close="emit('close')">

    <el-table :data="rows" v-loading="permissionTableLoading" style="width: 100%">
      <el-table-column prop="name" label="權限名稱">
        <template #default="{ row }">
          <span class="font-medium">{{ (row.name) }}</span>
          <div class="text-sm text-gray-500">{{ row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="activity" label="狀態">
        <template #default="{ row }">
          <el-tag :type="row.activity ? 'success' : 'danger'">
            {{ row.activity ? '啟用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';

import { usePermission } from '../composables/usePermission'
import { Interface } from 'readline';

const { permissionTableLoading, permissionTableData, getPermissionRequest } = usePermission();
/* ----------------------
  Props
----------------------- */
const props = defineProps({
  width: { type: [String, Number], default: 500 },
  // 預期是一個「鍵是權限名稱、值是物件」的字典
  // 例如：{ admin_manage_add: { Activity: true }, ... }
  data: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
})

const personData = defineModel('formData');
const submit = () => {
  // 通過驗證

  //就送出

}

const rows = computed(() => {
  const dict = props.data ?? {}
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

const formData = reactive < PersonData > ({
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