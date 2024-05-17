<script setup>
import { computed, ref } from 'vue';
import { useProductStore } from '~/stores/products'
import { useRoute } from 'nuxt/app'

const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
});

//w-[250px] h-[200px] md:w-[485px] md:h-[443px] lg:w-[485px] lg:h-[443px] xl:w-[485px] xl:h-[443px] 2xl:w-[485px] 2xl:h-[443px]
</script>

<template>
     <section class="h-full Gotham border border-[#858585] flex flex-col relative overflow-hidden rounded-[20px] w-[250px] xl:w-[300px] 2xl:w-[350px] ">
       <img class="overflow-hidden object-cover  w-[300px] h-[300px] xl:w-[300px] xl:h-[300px] 2xl:w-[400px] 2xl:h-[400px]" :src="user.photo" />
       <section class="h-max flex flex-col justify-end p-2 md:p-4 lg:p-6">
        <h3 class="text-xs  md:text-sn  lg:text-lg Gotham-light">{{ user.post }}</h3>
        <h4 class="text-base xl:text-xl  2xl:text-2xl Gotham">{{user.name}}</h4>
       </section>
     </section>
 </template>

 <style>
 .shadow{
   box-shadow: 
     0 -8px 4px -4px rgba(0, 0, 0, 0.1), /* Тень сверху */
     0 8px 8px -4px rgba(0, 0, 0, 0.1); /* Тень снизу */
 }
 </style>