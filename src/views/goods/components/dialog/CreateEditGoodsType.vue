<template>
  <el-dialog v-model="visible" :title="isEdit ? '編輯分類' : '新增分類'" width="400px">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
      <el-form-item label="分類名稱" prop="Name">
        <el-input v-model="formModel.Name" placeholder="請輸入分類名稱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="submitForm">{{ isEdit ? '編輯' : '新增' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ isEdit: boolean }>();
const emit = defineEmits(['close', 'confirm']);

// v-model 雙向綁定
const visible = defineModel<boolean>();
const formModel = defineModel<{ ID: any; Name: string; Show: boolean }>('formModel', {
  default: () => ({
    ID: null,
    Name: '',
    Show: true,
  }),
});

const formRef = ref();
const formRules = {
  Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('confirm', formModel);
    }
  });
};
</script>
