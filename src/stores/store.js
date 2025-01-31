import { defineStore } from 'pinia'

export const useStoreStore = defineStore('store', {
  state: () => ({
    storeInfo: null,
    hasStore: false
  }),

  actions: {
    setStoreInfo(info) {
      this.storeInfo = info
      this.hasStore = true
    },

    clearStoreInfo() {
      this.storeInfo = null
      this.hasStore = false
    }
  }
}) 