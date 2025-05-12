<template>
    <el-dialog v-model="visible" :title="isEdit ? '編輯分類' : '新增分類'">
        <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
            <el-form-item label="分類名稱" prop="Name">
                <el-input v-model="formModel.Name" placeholder="請輸入分類名稱" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="info" @click="submitForm">{{ isEdit ? '編輯' : '新增' }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';

/* ----------------------
  Props
----------------------- */
defineProps({
    name: {
        type: String,
        default: '新增商品分類'
    }
})

/* ----------------------
  Emits 元件聲明事件
----------------------- */
const emit = defineEmits(['close', 'confirm']);

const visible=defineModel();

// 表單初始化
const formModel = defineModel('formModel', {
    default: () => ({
        Name: '', //分類
    })
});

/* ----------------------
  Methods
----------------------- */
const handleCancel = () => {
    emit('close');
};

const formRef = ref();

const formRules = {
    Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
}

const submitForm = async () => {
    if (formRef.value) return;
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            emit('confirm', formModel.value);
        } else {
            console.warn('表單驗證未通過', fields);
        }
    })
}
</script>