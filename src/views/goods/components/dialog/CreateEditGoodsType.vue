<template>
  <el-dialog v-model="visible" @close="handleCancel" 
  :title="isEdit ? '編輯分類' : '新增分類'" width="400px">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
      <el-form-item label="分類名稱" prop="Name">
        <el-input v-model="formModel.Name" placeholder="請輸入分類名稱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="submitForm">{{ isEdit ? '編輯' : '新增' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

/* ----------------------
  Props
----------------------- */
defineProps({
  title:{
    type:String,
    default: '新增商品分類'
  },
  width:{
    type: [String, Number],
    default: 400
  },
   labelWidth: {
    type: [String, Number],
    default: 'auto'
  },
  labelPosition: {
    type: String,
    default: 'left'
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
/* ----------------------
  Emits 
  ------------------------- */
const emit = defineEmits(['close', 'confirm']);
/* ----------------------
  Models
----------------------- */
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false
})
// 表單初始化
const formModel = defineModel('formModel', {
  type:Object as PropType<{
    ID: number | null;      
    Name: string;       
    Show: boolean;      
  }>,
  default: () => ({
    ID: null,             
    Name: '',              
    Show: true           
  })
}); 

/* ----------------------
  Methods
----------------------- */
 const handleCancel = () => {
  emit('close');
};

const formRef = ref();
// 定義驗證邏輯
const formRules = {
  Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }]
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      emit('confirm', formModel.value);
    } else {
      console.warn('表單驗證未通過', fields);
    }
  });
};
  </script>
