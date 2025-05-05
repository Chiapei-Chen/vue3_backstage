import { ref, onMounted, computed, nextTick } from 'vue';
import to from 'await-to-js';
import { getGoodsType } from '@/service/api';

export function useGoodsTypeList() {
  const tableData = ref([]);
  const tableLoading = ref(false);

  //獲取商品分類列表
  const getGoodsTypeTableList = async () => {
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
    tableData,
    tableLoading,
    getGoodsTypeTableList
  };
}
