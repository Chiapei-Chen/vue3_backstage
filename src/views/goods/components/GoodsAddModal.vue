<template>
  <el-dialog v-model="dialogVisible" title="新增商品" :width="width" @close="emit('close')">
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
        <el-select v-model="formModel.GoodsTypeID" placeholder="請選擇商品分類">
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
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
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="success" @click="clickSubmit">新增</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useGoodsForm } from '../composables/useGoodsForm'
import { addGoods } from '@/service/api';

const props = defineProps({
  width: { type: [String, Number], default: 500 },
  goodsTypeList: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'confirm'])
const dialogVisible = defineModel('visible', { default: false })
const { formRef, formRules, getEmptyForm, } = useGoodsForm()
const formModel = ref(getEmptyForm())
//-----------------------------------------------------------------------------------------------
/** 點擊【提交】 */
const clickSubmit = async () => {
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addGoods(formModel.value);
        if (res.data.Code === 200) {
          emit('confirm');
          dialogVisible.value = false
        }
        else {
          ElMessage.error(res.data.Message || '新增失敗')
        }
      }
    })
  } catch (error) {
    console.error('操作商品發生錯誤:', error);
    ElMessage.error('系統錯誤，請稍後再試');
  }
}
</script>
