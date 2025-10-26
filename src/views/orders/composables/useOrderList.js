import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getOrderList, getOrderDetail } from '@/service/api';

export function useOrderList() {
    const tableData = ref([]);
    const tableLoading = ref(false);

    /** 搜尋UI */
    const searchFilter = ref({

    });

    /** 真正搜尋參數 */
    const searchForm = ref({

    });

    const lastSearchForm = ref({ ...searchForm.value });

    /** 分頁資料 */
    const pagination = ref({
        currentPage: 1,
        pageSize: 10,
        total: 0,
    });

    /** 換頁事件 */
    const handlePageChange = (page) => {
        pagination.value.currentPage = page;
        getOrderListReq(searchFilter.value, flase);
    }

    /** 獲取【訂單列表】 */
    const getOrderListReq = async (postData, useLastSearchForm = false) => {
        tableLoading.value = true;
        postData ? (searchForm.value = { ...postData }) : searchForm.value;

        const currentFilter = useLastSearchForm ? lastSearchForm.value : searchForm.value;

        const requestData = {
            ID: currentFilter.ID,
            Page: pagination.value.currentPage,
            PageSize: pagination.value.pageSize,
        };

        console.log('獲取訂單列表請求參數:', requestData);

        const [err, res] = await to(getOrderList(requestData));
        tableLoading.value = false;
        if (res.data.Code != 200) {
            console.error(err);
            return;
        }
        tableData.value = res.data.Data;
        lastSearchForm.value = { ...searchForm.value };
        pagination.value.total = res.data.TotalCount || 0;
    };

    return {
        searchFilter,
        tableData,
        tableLoading,
        pagination,
        handlePageChange,
        getOrderListReq,
    };
}
