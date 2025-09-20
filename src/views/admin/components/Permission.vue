<template>
    <!--權限表格內容-->
    <el-dialog v-model="visible" :title="isEdit ? '編輯權限' : '新增權限'" :width="width" @close="emit('close')">

        <el-table :data="rows" v-loading="permissionTableLoading" style="width: 100%">
            <el-table-column prop="name" label="權限名稱" width="300">
                <template #default="{ row }">
                    <span class="font-medium">{{ (row.name) }}</span>
                    <div class="text-sm text-gray-500">{{ row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="activity" label="狀態" width="120">
                <template #default="{ row }">
                    <el-tag :type="row.activity ? 'success' : 'danger'">
                        {{ row.activity ? '啟用' : '停用' }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';

import { usePermission } from '../composables/usePermission'

const { permissionTableLoading, permissionTableData, getPermissionRequest } = usePermission();
/* ----------------------
  Props
----------------------- */
const props = defineProps({
  width: { type: [String, Number], default: 500 },
  // 預期是一個「鍵是權限名稱、值是物件」的字典
  // 例如：{ admin_manage_add: { Activity: true }, ... }
  data: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
})

const rows = computed(() => {
  const dict = props.data ?? {}
  return Object.entries(dict).map(([key, val]) => ({
    name: key,
    activity: !!val.Activity,
  }))
})

console.log(rows);

/* ----------------------
  Emits 元件聲明事件
----------------------- */
const emit = defineEmits(['close', 'confirm']);

/* ----------------------
  Models
----------------------- */
// 控制是否顯示
const visible = defineModel();


onMounted(async () => {
    await nextTick();
})

</script>