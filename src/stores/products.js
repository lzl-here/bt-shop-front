import { defineStore } from 'pinia'
import axios from '../api/axios'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: []
  }),

  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('/api/products')
        this.products = response.data
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
  }
}) 