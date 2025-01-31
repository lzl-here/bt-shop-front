import { defineStore } from 'pinia'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [
      {
        id: 1,
        name: 'HUAWEI Mate 60 Pro',
        price: 6999,
        image: 'https://via.placeholder.com/200x200',
        brandId: 3,
        brandName: 'HUAWEI',
        storeId: 1,
        storeName: '华为官方旗舰店',
        description: '华为年度旗舰手机，搭载麒麟芯片，超长续航'
      },
      {
        id: 2,
        name: 'HUAWEI Mate 60 Pro',
        price: 6999,
        image: 'https://via.placeholder.com/200x200',
        brandId: 3,
        brandName: 'HUAWEI',
        storeId: 1,
        storeName: '华为官方旗舰店',
        description: '华为年度旗舰手机，搭载麒麟芯片，超长续航'
      }
      // ... 其他商品数据
    ]
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(p => p.id === Number(id))
    }
  }
}) 