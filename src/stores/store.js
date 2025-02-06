import { defineStore } from 'pinia'

export const useStoreStore = defineStore('store', {
  state: () => ({
    storeInfo: null
  }),

  getters: {
    hasStore: (state) => state.storeInfo !== null
  },

  actions: {
    setStoreInfo(info) {
      this.storeInfo = info
    },

    clearStoreInfo() {
      this.storeInfo = null
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'store_info',
        storage: localStorage
      }
    ]
  }
}) 