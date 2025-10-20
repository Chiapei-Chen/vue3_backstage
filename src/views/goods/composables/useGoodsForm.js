import { ref } from 'vue'

export function useGoodsForm() {
  const formRef = ref()

  const formRules = {
    Name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
    GoodsTypeID: [{ required: true, message: '請選擇商品分類', trigger: 'change' }],
    UnitPrice: [{ required: true, message: '請輸入商品價格', trigger: 'blur' }],
    ImagesIdnet: [{ required: true, message: '請輸入圖片識別碼', trigger: 'blur' }],
  }

  const getEmptyForm = () => ({
    Name: '',
    Show: true,
    GoodsTypeID: null,
    SpecsAllowance: 2,
    GoodsSpecs: [{ Specs: '' }],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  })

  const addSpec = (formModel) => {
    formModel.GoodsSpecs.push({ Specs: '' })
  }

  const removeSpec = (formModel, index) => {
    formModel.GoodsSpecs.splice(index, 1)
  }

  return {
    formRef,
    formRules,
    getEmptyForm,
    addSpec,
    removeSpec
  }
}
