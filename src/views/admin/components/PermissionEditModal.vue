<template>
    <el-dialog v-model="dialogVisible" title="編輯資料" :width="width" @close="emit('close')">
        <el-form ref="formRef" :model="formModel" label-width="80px">
            <el-form-item label="姓名" prop="Name">
                <el-input v-model="formModel.Name" />
            </el-form-item>
            <el-form-item label="帳號" prop="Account">
                <el-input v-model="formModel.Account" />
            </el-form-item>
            <!-- 不顯示密碼 -->
            <el-form-item label="信箱" prop="Email">
                <el-input v-model="formModel.Email" />
            </el-form-item>
            <el-form-item label="電話" prop="Phone">
                <el-input v-model="formModel.Phone" />
            </el-form-item>
        </el-form>

        <el-table :data="permission" style="width: 100%; margin-top: 16px;">
            <el-table-column prop="name" label="權限名稱" />
            <el-table-column label="啟用">
                <template #default="{ row }">
                    <el-checkbox v-model="row.activity" />
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <el-button @click="clickClose">取消</el-button>
            <el-button type="success" @click="clickSubmit">確認</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue";
import { permissionNameMap } from "../composables/permissionMap.js";

const props = defineProps({
    width: { type: [String, Number], default: 500 },
    permissionTableData: {
        type: Object as PropType<Record<string, { Activity: boolean }>>,
        default: () => ({}),
    },
});

const emit = defineEmits<{
    (e: "close"): void;
    (e: "confirm", payload): void;
}>();

const dialogVisible = defineModel<boolean>();
const formModel = defineModel("formModel", {
    type: Object as PropType<{
        Account: string;
        Password?: string;
        Name: string;
        Email: string;
        Phone: string;
    }>,
    required: true,
});

const formRef = ref();
const permission = ref<{ key: string, name: string; activity: boolean }[]>([]);

watch(
    () => props.permissionTableData,
    (newVal) => {
        permission.value = Object.entries(newVal || {}).map(([key, val]) => ({
            key,
            name: permissionNameMap[key] || key,
            activity: !!val.Activity,
        }));
    },
    { immediate: true, deep: true }
);

const clickSubmit = async () => {
    if (!formRef.value) return;
    const valid = await formRef.value.validate();
    if (!valid) return;

    const updatedPermissions: Record<string, { Activity: boolean }> = {};
    for (const row of permission.value) {
        updatedPermissions[row.key] = { Activity: row.activity };
    }

    emit("confirm", {
        form: formModel.value,
        permissions: updatedPermissions,
    });
};

const clickClose = () => {
    dialogVisible.value = false;
};
</script>
