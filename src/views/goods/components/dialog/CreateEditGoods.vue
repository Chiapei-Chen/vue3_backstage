<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯商品' : '新增商品'" :width="width" @close="emit('close')">
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

      <el-form-item label="商品分類" prop="GoodsTypeID">
        <el-select v-model="formModel.GoodsTypeID">請選擇商品分類
          <!-- <el-option :label="請選擇"  :value="0">請選擇商品分類</el-option> -->
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
        </el-select>
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
        <el-button @click="clickCancel">取消</el-button>
        <el-button type="success" :class="isEdit ? 'btn--update' : 'btn--create'" @click="clickSubmit">{{ isEdit ? '編輯'
          : '新增'
          }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
const formRef = ref();
//定義驗證邏輯
const formRules = {
  Name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  GoodsTypeID: [{ required: true, message: '請輸入分類 ID', trigger: 'blur' }],
  UnitPrice: [{ required: true, message: '請輸入價格', trigger: 'blur' }],
  ImagesIdnet: [{ required: true, message: '請輸入圖片識別碼', trigger: 'blur' }],
}
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
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  goodsTypeList: {
    type: Array,
    default: () => []
  }
});

/* ----------------------
  Emits 
----------------------- */
const emit = defineEmits(['close', 'confirm']);

/* ----------------------
  Models
----------------------- */
// 彈跳視窗顯示
const dialogVisible = defineModel < boolean > ('visible', {
  type: Boolean,
  default: false
})
// 表單初始化
const formModel = defineModel('formModel', {
  default: () => ({
    Name: '',
    Show: true,
    GoodsTypeID: null,
    SpecsAllowance: 2,
    GoodsSpecs: [
      { Specs: '' }
    ],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  })
});

/* ----------------------
  Methods
----------------------- */
/** 點擊【取消】 */
const clickCancel = () => {
  emit('close');
};

/** 點擊【提交】 */
const clickSubmit = async () => {
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
