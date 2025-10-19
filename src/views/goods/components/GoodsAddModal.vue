<template>
<<<<<<< Updated upstream
  <el-dialog
    v-model="dialogVisible"
    title="新增商品"
    :width="width"
    @close="emit('close')"
  >
=======
  <el-dialog v-model="dialogVisible" title="新增商品" :width="width" @close="emit('close')">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <el-option
            v-for="item in goodsTypeList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
          />
=======
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
>>>>>>> Stashed changes
        </el-select>
      </el-form-item>

      <el-form-item label="是否允許規格" prop="SpecsAllowance">
        <el-radio-group v-model="formModel.SpecsAllowance">
          <el-radio-button :value="1">允許</el-radio-button>
          <el-radio-button :value="0">不允許</el-radio-button>
          <el-radio-button :value="2">依照規格陣列</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formModel.SpecsAllowance === 2" label="商品規格">
        <div v-for="(spec, index) in formModel.GoodsSpecs" :key="index" class="spec-row">
<<<<<<< Updated upstream
          <el-input
            v-model="spec.Specs"
            placeholder="請輸入規格內容"
            class="w-3/4"
          />
=======
          <el-input v-model="spec.Specs" placeholder="請輸入規格內容" class="w-3/4" />
>>>>>>> Stashed changes
          <el-button type="danger" @click="removeSpec(formModel, index)">刪除</el-button>
        </div>
        <el-button type="primary" @click="addSpec(formModel)" class="mt-2">新增規格</el-button>
      </el-form-item>

      <el-form-item label="商品價格" prop="UnitPrice">
        <el-input-number v-model="formModel.UnitPrice" :min="0" />
      </el-form-item>

      <el-form-item label="圖片識別碼" prop="ImagesIdnet">
        <el-input v-model="formModel.ImagesIdnet" placeholder="請輸入圖片識別碼" />
      </el-form-item>

      <el-form-item label="商品說明" prop="Description">
<<<<<<< Updated upstream
        <el-input
          type="textarea"
          v-model="formModel.Description"
          placeholder="請輸入說明"
        />
=======
        <el-input type="textarea" v-model="formModel.Description" placeholder="請輸入說明" />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
import { addGoods } from '@/service/api'
import { ElMessage } from 'element-plus'
import { useGoodsForm } from '../composables/useGoodsForm'
=======
import { useGoodsForm } from './useGoodsForm.js'
>>>>>>> Stashed changes

const props = defineProps({
  width: { type: [String, Number], default: 500 },
  goodsTypeList: { type: Array, default: () => [] }
})
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const emit = defineEmits(['close', 'confirm'])
const dialogVisible = defineModel('visible', { default: false })

const { formRef, formRules, getEmptyForm, addSpec, removeSpec } = useGoodsForm()
const formModel = ref(getEmptyForm())

<<<<<<< Updated upstream
/** 點擊【提交】 */
const clickSubmit = async () => {
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addGoods(formModel.value)
        if (res.data.Code === 200) {
          ElMessage.success('新增成功')
          emit('confirm') // ✅ 通知父元件成功
          dialogVisible.value = false
        } else {
          ElMessage.error(res.data.Message || '新增失敗')
        }
      }
    })
  } catch (error) {
    console.error('操作商品發生錯誤:', error)
    ElMessage.error('系統錯誤，請稍後再試')
  }
=======
const clickSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) emit('confirm', formModel.value)
  })
>>>>>>> Stashed changes
}
</script>
