<template>
<<<<<<< Updated upstream
  <el-dialog
    v-model="dialogVisible"
    title="編輯商品"
    :width="width"
    @close="emit('close')"
  >
=======
  <el-dialog v-model="dialogVisible" title="編輯商品" :width="width" @close="emit('close')">
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
<<<<<<< Updated upstream
        <div
          v-for="(spec, index) in formModel.GoodsSpecs"
          :key="index"
          class="spec-row"
        >
          <el-input
            v-model="spec.Specs"
            placeholder="請輸入規格內容"
            class="w-3/4"
          />
          <el-button type="danger" @click="removeSpec(formModel, index)">刪除</el-button>
        </div>
        <el-button type="primary" @click="addSpec(formModel)" class="mt-2">
          新增規格
        </el-button>
=======
        <div v-for="(spec, index) in formModel.GoodsSpecs" :key="index" class="spec-row">
          <el-input v-model="spec.Specs" placeholder="請輸入規格內容" class="w-3/4" />
          <el-button type="danger" @click="removeSpec(formModel, index)">刪除</el-button>
        </div>
        <el-button type="primary" @click="addSpec(formModel)" class="mt-2">新增規格</el-button>
>>>>>>> Stashed changes
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
      <el-button type="primary" @click="clickSubmit">儲存修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
<<<<<<< Updated upstream
import { ElMessage } from 'element-plus'
import { updateGoods } from '@/service/api'
import { useGoodsForm } from '../composables/useGoodsForm'

/* ----------------------
  Props & Emits
----------------------- */
=======
import { useGoodsForm } from './useGoodsForm.js'

>>>>>>> Stashed changes
const props = defineProps({
  width: { type: [String, Number], default: 500 },
  goodsTypeList: { type: Array, default: () => [] },
  editData: { type: Object, default: () => ({}) }
})
<<<<<<< Updated upstream

const emit = defineEmits(['close', 'confirm'])
const dialogVisible = defineModel('visible', { default: false })

/* ----------------------
  Form 初始化
----------------------- */
const { formRef, formRules, getEmptyForm, addSpec, removeSpec } = useGoodsForm()
const formModel = ref(getEmptyForm())

// 監聽外部傳入的 editData，自動更新表單內容
=======
const emit = defineEmits(['close', 'confirm'])
const dialogVisible = defineModel('visible', { default: false })

const { formRef, formRules, getEmptyForm, addSpec, removeSpec } = useGoodsForm()
const formModel = ref(getEmptyForm())

>>>>>>> Stashed changes
watch(
  () => props.editData,
  (val) => {
    formModel.value = JSON.parse(JSON.stringify(val || getEmptyForm()))
  },
  { immediate: true, deep: true }
)

<<<<<<< Updated upstream
/* ----------------------
  Methods
----------------------- */
const clickSubmit = async () => {
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await updateGoods(formModel.value)
        if (res.data.Code === 200) {
          emit('confirm') // ✅ 通知父層成功
          dialogVisible.value = false
        } else {
          ElMessage.error(res.data.Message || '更新失敗')
        }
      }
    })
  } catch (error) {
    console.error('更新商品時發生錯誤:', error)
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
