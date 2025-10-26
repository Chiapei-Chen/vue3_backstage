import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getGoodsType } from '@/service/api';

export function useGoodsTypeList() {
  const tableData = ref([]);
  const tableLoading = ref(false);

  // 搜尋
  const searchFilter = ref({
    ID: '',
    Name: ''
  });

  // 送到後端
  const searchForm = ref({
    ID: 0,
    GoodsName: ''
  });

  const pagination = ref({
    currentPage: 0,
    pageSize: 20,
    total: 0
  });

  const goodsTypeForm = ref({
    ID: null,
    Show: true,
    Name: ''
  });

  /** 取得【商品分類】列表 */
  const getGoodsTypeList = async () => {
    tableLoading.value = true;
    const [err, res] = await to(getGoodsType({}));
    tableLoading.value = false;

    if (res.data.Code !== 200) {
      console.error(err);
      return;
    }

    tableData.value = res.data.Data;
  };
  return {
    // 列表
    tableData,
    tableLoading,
    // 搜尋
    searchFilter,
    searchForm,
    // 分頁
    pagination,
    // 編輯表單
    goodsTypeForm,
    // 取得列表函式
    getGoodsTypeList,
  };
}
