<template>
  <!--基本資訊內容-->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯資料' : '新增資料'" :width="width" @close="emit('close')">
    <!-- 基本資訊表單 -->
    <el-form ref="formRef" :model="formModel" label-width="80px">
      <el-form-item label="姓名" prop="Name">
        <el-input v-model="formModel.Name" />
      </el-form-item>
      <el-form-item label="帳號" prop="Account">
        <el-input v-model="formModel.Account" />
      </el-form-item>
      <el-form-item label="密碼" prop="Password">
        <el-input v-model="formModel.Password" type="password" />
      </el-form-item>
      <el-form-item label="信箱" prop="Email">
        <el-input v-model="formModel.Email" />
      </el-form-item>
      <el-form-item label="電話" prop="Phone">
        <el-input v-model="formModel.Phone" />
      </el-form-item>
    </el-form>

    <!-- 權限表格內容 -->
    <el-table :data="permission" style="width: 100%; margin-top: 16px;">
      <el-table-column prop="name" label="權限名稱" />
      <el-table-column label="啟用">
        <template #default="{ row }">
          <el-checkbox v-model="row.activity" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部按鈕 -->
    <template #footer>
      <el-button @click="clickClose">取消</el-button>
      <el-button type="success" @click="clickSubmit">確認</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { permissionNameMap } from "../composables/permissionMap.js"

const formRef = ref();
/*權限*/
const permission = ref<{ name: string; activity: boolean }[]>([]);
/* ----------------------
  Props
----------------------- */
const props = defineProps({
  width: { type: [String, Number], default: 500 },
  permissionTableData: {
    type: Object as PropType<Record<string, { Activity: boolean }>>,
    default: () => ({}),
  },
  isEdit: { type: Boolean, default: false },
});

//------------------------------------------------------
watch(
  () => props.permissionTableData,
  (newVal) => {
    permission.value =
      Object.entries(newVal || {}).map(([key, val]) => ({
        name: permissionNameMap[key] || key,
        activity: !!val.Activity,
      }));
  },
  { immediate: true, deep: true }
);
/* ----------------------
  Models
----------------------- */
// 對話框開關
const dialogVisible = defineModel<boolean>();

// 管理員表單
const formModel = defineModel("formModel", {
  type: Object as PropType<{
    Account: string;
    Password: string;
    Name: string;
    Email: string;
    Phone: string;
  }>,
  required: true,
});

/* ----------------------
  Emits
----------------------- */
const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", payload): void;
}>();

/* ----------------------
  Methods
----------------------- */
/** 點擊【送出】 */
const clickSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;

  // 把 rows 轉回權限結構
  const updatedPermissions: Record<string, { Activity: boolean }> = {};
  for (const row of permission.value) {
    updatedPermissions[row.name] = { Activity: row.activity };
  }

  // 一次 emit 完整資料
  emit("confirm", {
    form: formModel.value,
    permissions: updatedPermissions,
  });
};

/** 點擊【關閉】 */
const clickClose = () => {
  dialogVisible.value = false;
}
</script>
