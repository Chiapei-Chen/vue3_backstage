import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getAdminPermissions } from '@/service/api';

export function usePermission() {
    const permissionTableData = ref({});
    const permissionTableLoading = ref(false);

    const pagination = ref({
        currentPage: 0,
        pageSize: 10,
        total: 0,
    });

    async function getPermissionRequest(id) {
        try {
            permissionTableLoading.value = true
            const requestData = {
                MemberID: id
            }
            const responseData = await getAdminPermissions(requestData)
            // 只接受陣列；不是就給空陣列
            const raw = responseData?.data.Data.Permission;
            permissionTableData.value =raw
            console.log(permissionTableData.value, "permissionTableData");
        } finally {
            permissionTableLoading.value = false
        }
    }

    return { permissionTableLoading, permissionTableData, getPermissionRequest }
};