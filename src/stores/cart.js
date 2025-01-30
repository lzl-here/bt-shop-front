import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  getters: {
    totalItems: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1,
          selected: true
        })
      }
    },
    
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    
    clearCart() {
      this.items = []
    },

    // 删除选中的商品
    removeSelected() {
      this.items = this.items.filter(item => !item.selected)
    },

    // 清空购物车中选中的商品
    clearSelected() {
      this.items = this.items.filter(item => !item.selected)
    }
  },
  
  persist: true
}) 