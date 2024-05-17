<script setup>
import { useProductStore } from '~/stores/products'; 
import { useCategoryStore } from '~/stores/categories';
import { useUserStore } from '~/stores/users'
import axios from 'axios';
import Map from '~/components/adminMap.vue';
import draggable from 'vuedraggable';

const newProduct = ref({})

const photosUrls1 = ref([]);
const photos = ref([]);
const mainPhoto = ref([]);

const disableButton = ref(false);

const adress = ref('');
const adressList = ref({});
const center = ref([34.173530,44.496746])


useAsyncData('categories', async () => {
  await categoryStore.fetchCategories()
  handleMarkerMoved([34.169506,44.497415])
}, { server: true });

useAsyncData('users', async () => {
  await usersStore.getManagers()
}, { server: true });

onMounted(async () => {
  await categoryStore.fetchCategories();
  await usersStore.getManagers();
});
const productStore = useProductStore();
const categoryStore = useCategoryStore()
const usersStore = useUserStore()
const categories = computed(() => categoryStore.categories)
const users = computed(() => usersStore.users)

const submitt = async () => {
  disableButton.value = true;

  const files = photos.value.map(photo => photo.file);
  try {
    await productStore.addProduct(newProduct.value, files);
  } catch (error) {
    console.error(error);
  } finally {
    disableButton.value = false;
  }
  console.log(photos.value);
};


const handleFileUpload = event => {
  Array.from(event.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      photos.value.push({ file, path: e.target.result });
    };
    reader.readAsDataURL(file);
  });
};


const handleMarkerMoved = async (coordinates) => {
    newProduct.value.lat = coordinates[1]
    newProduct.value.lon = coordinates[0]
}

const deletePhotoUrl = (index) => {
    photos.value.splice(index, 1);
}
definePageMeta({
  layout: 'admin'
});
</script>
<template>
    <div class="w-full h-full mt-20 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
      <div class="relative overflow-hidden  border-2 border-[#696969] rounded-[20px] ">
          <h4 class="text-xl pb-12 text-center">Добавить продукт</h4>
            <section class=" flex flex-col gap-1.5 xl:gap-3 2xl:gap-5 p-3">
                <label class="whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Категории<span class=" text-red-500">*</span></label>
                <select class="border border-black rounded-lg p-2" v-model="newProduct.category">
                  <option v-for="category in categories" :value="category._id" :key="category._id">{{ category.name }}</option>
                </select>
 
                <div class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">
                  Заголовок<span class=" text-red-500">*</span>: <input v-model="newProduct.name" class="Gotham-light text-black border-b border-black w-full"/>
                </div>
                <div class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">
                  Дата выполнения<span class=" text-red-500">*</span>: <input placeholder="2021-2024 гг." v-model="newProduct.period" class="Gotham-light text-black border-b border-black w-full"/>
                </div>
                <div class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">
                  Колличество домов<span class=" text-red-500">*</span>: <input v-model="newProduct.houses_count" class="Gotham-light text-black border-b border-black w-full"/>
                </div>
                <div class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">
                  Адрес<span class=" text-red-500">*</span>: <input v-model="newProduct.address" class="Gotham-light text-black border-b border-black w-full"/>
                </div>
                <label class="whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Фото</label>
                <input class="pb-10" type="file" @change="handleFileUpload" multiple>
                <draggable v-model="photos" class="pb-10 flex flex-wrap gap-2.5" item-key="url">
                  <template #item="{element, index}">
                    <div class="relative">
                      <img :src="element.path" :alt="'Photo ' + index" class="w-20 draggable-item">
                      <button @click="deletePhotoUrl(index)" class="bg-white absolute top-0 right-0 lg:text-base xl:text-xl 2xl:text-[32px]">☒</button>
                    </div>
                  </template>
                </draggable>
                <button @click.prevent="submitt" :disabled="disableButton" class="border rounded-lg border-gray-500 z-20">Создать</button>
            </section>
          <img src="~/assets/img/wave-r.svg" alt="wave" class="absolute bottom-0 right-0 z-10 opacity-30"/>
        </div>
    </div>
</template>

<style>
.list-move {
  transition: transform 0.5s ease;
}
.dragging {
  opacity: 0.5;
  transform: scale(1.1);
  z-index: 1000; /* Убедитесь, что перетаскиваемый элемент находится над остальными */
}
</style>