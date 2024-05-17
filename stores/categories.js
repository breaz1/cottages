import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const response = await $axiosPlugin.get('/api/category')
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async addCategory(category) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        await $axiosPlugin.post('/api/categories', category)
        this.fetchCategories() // Refresh the list after adding
      } catch (error) {
        console.error('Error adding category:', error)
      }
    },
    async updateCategory(id, category) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        await $axiosPlugin.put(`/api/categories/${id}`, category)
        this.fetchCategories() // Refresh the list after updating
      } catch (error) {
        console.error('Error updating category:', error)
      }
    },
    async deleteCategory(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        await $axiosPlugin.delete(`{/api/categories/${id}`)
        this.fetchCategories() // Refresh the list after deleting
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    },
  },
})
