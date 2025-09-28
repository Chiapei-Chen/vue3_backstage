<template>
  <!--基本資訊內容-->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯資料' : '新增資料'" :width="width" @close="emit('close')">
    <!-- 基本資訊表單 -->
    <el-form  ref="formRef" :model="formModel" label-width="80px">
      <el-form-item label="姓名" prop="Name">
        <el-input v-model="formModel.Name" />
      </el-form-item>
      <el-form-item label="帳號" prop="Account">
        <el-input v-model="formModel.Account" />
      </el-form-item>
      <el-form-item label="密碼" prop="Password">
        <el-input v-model="formModel.Password" />
      </el-form-item>
      <el-form-item label="信箱" prop="Email">
        <el-input v-model="formModel.Email" />
      </el-form-item>
      <el-form-item label="電話" prop="Phone">
        <el-input v-model="formModel.Phone" />
      </el-form-item>
    </el-form>

    <!-- 權限表格內容 -->
    <el-table :data="rows" style="width: 100%; margin-top: 16px;">
      <el-table-column prop="name" label="權限名稱" />
      <el-table-column label="啟用">
        <template #default="{ row }">
          <el-checkbox v-model="row.activity" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部按鈕 -->
    <template #footer>
      <el-button  @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">確認</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
const formRef = ref();
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
  Computed
----------------------- */
const rows = computed(() => {
  const dict = props.permissionTableData || {};
  return Object.entries(dict).map(([key, val]) => ({
    name: key,
    activity: !!val.Activity,
  }));
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
const submit = async () => {
  console.log("提交申請");
  if (!formRef.value) {
    console.log("為存在");
    return;
  }
      emit('confirm', formModel.value);
  await formRef.value.validate((valid, fields) => {


    // if(valid){
    //   emit('confirm',formModel.value);
    // }else{
    //         console.warn('表單驗證未通過', fields);
    // }
  });
};
</script>
