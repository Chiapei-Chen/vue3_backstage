import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getGoodsList, getGoodsType } from '@/service/api';

export function useGoodsList() {
  const tableData = ref([]);
  const tableLoading = ref(false);

  /** 搜尋 UI 應綁定的對象在這 */
  const searchFilter = ref({
    ID: '',
    GoodsName: '',
    GoodsType: ''
  });

  const searchForm = ref({
    ID: 0,
    GoodsName: '',
    GoodsType: 0
  });

  // 紀錄上一次成功搜尋的參數
  const lastSearchForm = ref({ ...searchForm.value });

  const pagination = ref({
    currentPage: 0,
    pageSize: 20,
    total: 0
  });

  /** 新增與編輯商品用的表單 */
  const goodsForm = ref({
    ID: null,
    Show: true,
    GoodsTypeID: 0,
    Name: '',
    
    SpecsAllowance: 0,
    GoodsSpecs: [],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  });

  const goodsTypeList = ref([]);

  /** Goods Type List request */
  /** 獲取【商品類型】列表 */
  const getGoodsTypeList = async () => {
    const [err, res] = await to(getGoodsType({}));
    if (res.data.Code !== 200) {
      console.error(err);
      return;
    }
    goodsTypeList.value = res.data.Data;
    console.log('### GOODS TYPE RES: ', goodsTypeList.value);
  };

  /** 獲取【商品類型】名 */
  const getGoodsTypeName = (typeId) => {
    const match = goodsTypeList.value.find(item => item.ID == typeId);
    return match?.Name;
  }
  /** Goods list request */

  const getGoodsListRequest = async (postData, useLastSearchForm = false) => {
    tableLoading.value = true;
    postData ? (searchForm.value = { ...postData }) : searchForm.value;

    const currentFilter = useLastSearchForm ? lastSearchForm.value : searchForm.value;

    /** 一定要有預設值，ID和TYPE沒給值的部分就轉為 0 */
    const requestData = {
      ID: currentFilter.ID || 0,
      GoodsName: currentFilter.GoodsName || '',
      GoodsType: currentFilter.GoodsType || 0,
      Page: pagination.value.currentPage,
      PageLimit: pagination.value.pageSize
    };

    console.log('### GOODS LIST PAYLOAD: ', requestData);

    const [err, res] = await to(getGoodsList(requestData));
    tableLoading.value = false;
    if (res.data.Code !== 200) {
      console.error(err);
      return;
    }

    tableData.value = res.data.Data;
    lastSearchForm.value = { ...searchForm.value };
    console.log('### GOODS LIST RES: ', tableData.value);
  };

  return {
    searchFilter,
    tableData,
    tableLoading,
    goodsForm,
    goodsTypeList,
    getGoodsListRequest,
    getGoodsTypeList,
    getGoodsTypeName
  };
}
