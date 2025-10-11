<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增商品分類"
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
      <el-button type="success" @click="clickSubmit">新增</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addGoodsType } from '@/service/api' 

const props = defineProps({
  width: { type: [String, Number], default: 400 },
  labelWidth: { type: [String, Number], default: 'auto' },
})

const emit = defineEmits(['close', 'confirm'])

const dialogVisible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
})

const formRef = ref()
const formModel = ref({
  Name: '',
})

const formRules = {
  Name: [{ required: true, message: '請輸入分類名稱', trigger: 'blur' }],
}

const clickSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const res = await addGoodsType(formModel.value)
      if (res?.data?.Code === 200) {
        emit('confirm') 
        dialogVisible.value = false
      } else {
        ElMessage.error(res?.data?.Msg || '新增失敗')
      }
    } catch (err) {
      console.error('新增商品分類失敗:', err)
      ElMessage.error('系統錯誤，請稍後再試')
    }
  })
}
</script>
