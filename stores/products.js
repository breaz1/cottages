import { defineStore } from 'pinia'
import axios from 'axios'
export const useProductStore = defineStore('products', {
  state: () =>{
    return{
      products: [],
      product:{},
    }
  },
  actions: {
    async fetchProducts(categoryId) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const params = {
          category: categoryId,
        };
        const response = await $axiosPlugin.get('/api/product',{ params })
        this.products = response.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async getItem(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const params = {
          product: id,
        };
        const response = await $axiosPlugin.get(`/api/product/`,{ params })
        this.product = response.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async getCategoryProducts(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const params = {
          category: id,
        };
        const response = await $axiosPlugin.get(`/api/product/`,{ params })
        this.product = response.data
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async addProduct(product,  photos) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        var formData = new FormData();
        for ( var key in product ) {
          formData.append(key, product[key]);
        }
        for ( var key in photos ) {
          formData.append('photos', photos[key]);
        }
        console.log(formData)
        await $axiosPlugin.post('/api/product', formData,{
          headers: {
            'auth-token': localStorage.getItem('token'),
          }
        })
        alert('Объект добавлен!')
        location.reload();
        this.fetchProducts()
      } catch (error) {
        let fields = error.response.data.errors.flatMap(err => err.path || []);
        let uniqueFields = [...new Set(fields)];
        if (uniqueFields.length > 0) {
          let fieldsList = uniqueFields.join(', ');
          alert(`Заполнены не все поля: ${fieldsList}`);
        } else {
          alert('Произошла неизвестная ошибка.');
        }
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }
    },
    async updateProduct(product, photos) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        let modifiedProduct = { ...product };
        delete modifiedProduct.photos;
        delete modifiedProduct.photo;
        const formData = new FormData();
        for ( var key in modifiedProduct ) {
          formData.append(key, modifiedProduct[key]);
        }
        for ( var key in photos ) {
          formData.append('photos', photos[key]);
        }

        await $axiosPlugin.put('/api/product/', formData, {
          headers: {
            'auth-token': localStorage.getItem('token'),
          }
        });
        alert('Объект изменен!')
        location.reload();
      } catch (error) {
        alert('Ошибка!')
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }
    },
    async deleteProduct(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        await $axiosPlugin.delete(`/api/product/`,{
          data:{_id:id},
          headers: {
            'auth-token': localStorage.getItem('token'),
          }
        })
        location.reload();
      } catch (error) {
        alert('Ошибка!')
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }
    },
  },
})
