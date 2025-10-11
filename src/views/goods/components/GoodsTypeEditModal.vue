<template>
  <el-dialog
    v-model="dialogVisible"
    title="編輯商品分類"
    :width="width"
    @close="emit('close')"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      :label-width="labelWidth"
    >
      <el-form-item label="分類名稱" prop="Name">
        <el-input v-model="formModel.Name" placeholder="請輸入分類名稱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="success" @click="clickSubmit">儲存修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateGoodsType } from '@/service/api' 

const props = defineProps({
  width: { type: [String, Number], default: 400 },
  labelWidth: { type: [String, Number], default: 'auto' },
  editData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'confirm'])

const dialogVisible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
})

const formRef = ref()
const formModel = ref({
  ID: null,
  Name: '',
})

const formRules = {
  Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
}

// 監聽父層傳進來的 editData，自動更新表單內容
watch(
  () => props.editData,
  (val) => {
    formModel.value = JSON.parse(JSON.stringify(val || { ID: null, Name: '' }))
  },
  { immediate: true, deep: true }
)

const clickSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const res = await updateGoodsType(formModel.value)
      if (res?.data?.Code === 200) {
        emit('confirm') 
        dialogVisible.value = false
      } else {
        ElMessage.error(res?.data?.Msg || '更新失敗')
      }
    } catch (err) {
      console.error('編輯商品分類失敗:', err)
      ElMessage.error('系統錯誤，請稍後再試')
    }
  })
}
</script>
