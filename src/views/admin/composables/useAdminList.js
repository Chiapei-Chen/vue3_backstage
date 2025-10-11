import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getAdminMembers } from '@/service/api';

export function useAdminList() {
    const tableData = ref([]);
    const tableLoading = ref(false);

    const adminForm = ref({
        Account: '',
        Password: '',
        Name: '',
        Email: '',
        Phone: '',
    });


    const pagination = ref({
        currentPage: 1,
        pageSize: 10,
        total: 0,
    });

    const getAdminRequest = async (form) => {
        tableLoading.value = true;

        const requestData = {
            Account: form.Account || '',
            Password: form.Password || '',
            Name: form.Name || '',
            Email: form.Email || '',
            Phone: form.Phone || '',
            Page: pagination.value.currentPage || 0,
            PageLimit: pagination.value.pageSize || 10,
        };
        console.log(requestData, "查詢條件");
        const [err, res] = await to(getAdminMembers(requestData));
        tableLoading.value = false;
        if (res.data.Code != 200) {
            console.error(err);
            return;
        }
        console.log(res, "查詢條件結果");
        tableData.value = res.data.Data;
        pagination.value.total = res.data.TotalCount;
        return tableData.value, pagination.value;
    };

    return {
        tableData,
        tableLoading,
        adminForm,
        pagination,
        getAdminRequest,
    }

}