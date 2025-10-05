import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getAdminMembers } from '@/service/api';

export function useAdminList() {
    const tableData = ref([]);
    const tableLoading = ref(false);

    const searchFilter = ref({

    })

    const pagination = ref({
        currentPage: 0,
        pageSize: 20,
        total: 0,
    });

    const adminForm = ref({
        Account: '',
        Password: '',
        Name: '',
        Email: '',
        Phone: '',
    });

    const getAdminRequest = async () => {
        tableLoading.value = true;

        const requestData = {
            Account: adminForm.GoodsName || '',
            Password: adminForm.GoodsType || 0,
            Name: pagination.value.currentPage,
            Email: pagination.value.pageSize,
            Phone: adminForm.Phone,
        };

        const [err, res] = await to(getAdminMembers(requestData));
        tableLoading.value = false;
        if (res.data.Code != 200) {
            console.error(err);
            return;
        }

        tableData.value = res.data.Data;

    };

    return {
        tableData,
        tableLoading,
        adminForm,
        getAdminRequest,
    }

}