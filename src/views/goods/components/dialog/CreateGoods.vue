<template>
  <el-dialog v-model="visible" :title="title" :width="width" @close="emit('close')">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px">
      <el-form-item label="商品名稱" prop="Name">
        <el-input v-model="formModel.Name" placeholder="請輸入商品名稱" />
      </el-form-item>

      <el-form-item label="前台顯示" prop="Show">
        <el-radio-group v-model="formModel.Show">
          <el-radio-button :value="true">是</el-radio-button>
          <el-radio-button :value="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商品分類 ID" prop="GoodsTypeID">
        <el-input-number v-model="formModel.GoodsTypeID" :min="1" />
      </el-form-item>

      <el-form-item label="是否允許規格" prop="SpecsAllowance">
        <el-radio-group v-model="formModel.SpecsAllowance">
          <el-radio-button :value="1">允許</el-radio-button>
          <el-radio-button :value="0">不允許</el-radio-button>
          <el-radio-button :value="2">依照規格陣列</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="商品規格" v-if="formModel.SpecsAllowance === 2">
        <div v-for="(spec, index) in formModel.GoodsSpecs" :key="index" class="spec-row">
          <el-input v-model="spec.Specs" placeholder="請輸入規格內容" class="w-3/4" />
          <el-button type="danger" @click="removeSpec(index)">刪除</el-button>
        </div>
        <el-button type="primary" @click="addSpec" class="mt-2">新增規格</el-button>
      </el-form-item>

      <el-form-item label="商品價格" prop="UnitPrice">
        <el-input-number v-model="formModel.UnitPrice" :min="0" />
      </el-form-item>

      <el-form-item label="圖片識別碼" prop="ImagesIdnet">
        <el-input v-model="formModel.ImagesIdnet" placeholder="請輸入圖片識別碼" />
      </el-form-item>

      <el-form-item label="商品說明" prop="Description">
        <el-input type="textarea" v-model="formModel.Description" placeholder="請輸入說明" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm">新增</el-button>
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
  title: {
    type: String,
    default: '新增商品'
  },
  width: {
    type: [String, Number],
    default: 500
  },
  labelWidth: {
    type: [String, Number],
    default: 'auto'
  },
  labelPosition: {
    type: String,
    default: 'left'
  }
});

/* ----------------------
  Emits
----------------------- */
const emit = defineEmits(['close', 'confirm']);

/* ----------------------
  Models
----------------------- */

// v-model for dialog visibility
const visible = defineModel();
// v-model for form data
const formModel = defineModel('formModel', {
  default: () => ({
    Name: '',               // 商品名稱
    Show: true,             // 是否顯示
    GoodsTypeID: 1,         // 商品分類
    SpecsAllowance: 2,      // 是否允許規格
    GoodsSpecs: [           // 商品規格
      { Specs: '' }
    ],
    UnitPrice: 0,           // 價格
    ImagesIdnet: '',        // 圖片識別碼
    Description: ''         // 說明
  })
});

/* ----------------------
  Methods
----------------------- */
const handleCancel = () => {
  emit('close');
  // visible.value = false;
};

const formRef = ref();

//定義驗證邏輯
const formRules = {
  Name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  GoodsTypeID: [{ required: true, message: '請輸入分類 ID', trigger: 'blur' }],
  UnitPrice: [{ required: true, message: '請輸入價格', trigger: 'blur' }],
  ImagesIdnet: [{ required: true, message: '請輸入圖片識別碼', trigger: 'blur' }],
}

const submitForm = async ()=> {
  if (!formRef.value) return;
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // 驗證通過才發送 confirm 事件
      emit('confirm', formModel.value);
    } else {
      console.warn('表單驗證未通過', fields);
    }
  });
};

const addSpec = () => {
  formModel.value.GoodsSpecs.push({ Specs: '' })
};

const removeSpec = (index) => {
  formModel.value.GoodsSpecs.splice(index, 1)
};
</script>
