<script setup>
import { useProductStore } from '~/stores/products'

const productStore = useProductStore()

const products = computed(() => productStore.products)

useAsyncData('products', () => {
  return productStore.fetchProducts()
}, { server: true })

const deleteProduct = (id) => {
    productStore.deleteProduct(id)
};

definePageMeta({
  layout: 'admin'
});
</script>
<template>
     <section class="flex flex-col justify-center mt-24 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48 pb-20 gap-6">
        <NuxtLink to="/admin/products/add" class="text-center p-5 mt-6 bg-gray-300">Добавить объект</NuxtLink>

        <div class="grid gap-5 md:gap-2.5 justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-[30px]">
          <div class="Gotham w-full border border-[#858585] flex flex-col relative overflow-hidden rounded-[20px]" v-for="product in products" >
            <section class="py-6 px-6">
              <h3 class="text-lg Gotham-light pb-3">{{ product.name }}</h3>
              <NuxtLink :to="`products/${product._id}`" class="absoluteborder border-black bg-white py-1 pr-2 rounded-[10px] z-20">Изменить</NuxtLink>
              <button @click="deleteProduct(product._id)" class="absoluteborder border-black bg-white py-1 px-2 rounded-[10px] z-20">Удалить</button>
            </section>
          </div>
        </div>
        
      </section>
</template>