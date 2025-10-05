<template>
  <el-dialog v-model="dialogVisible" @close="clickCancel" 
  :title="isEdit ? '編輯分類' : '新增分類'" :width="width">
    <el-form ref="formRef" :model="formModel" :rules="formRules" :label-width="labelWidth">
      <el-form-item label="分類名稱" prop="Name">
        <el-input v-model="formModel.Name" placeholder="請輸入分類名稱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @close="clickCancel">取消</el-button>
        <el-button type="primary" @click="clickSubmit">{{ isEdit ? '編輯' : '新增' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

const formRef = ref();
// 定義驗證邏輯
const formRules = {
  Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }]
};

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
// 彈跳視窗顯示
const dialogVisible = defineModel<boolean>('visible', {
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
/** 點擊【送出】 */
const clickSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      emit('confirm', formModel.value);
    } else {
      console.warn('表單驗證未通過', fields);
    }
  });
};

/** 點擊【取消】 */
 const clickCancel = () => {
  emit('close');
};

  </script>
