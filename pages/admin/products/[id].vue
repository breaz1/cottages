<script setup>
import { ref, computed, watchEffect,onMounted } from 'vue';

import { useRoute, useAsyncData } from 'nuxt/app';
import { useProductStore } from '~/stores/products'; 
import { useCategoryStore } from '~/stores/categories';
import draggable from 'vuedraggable';

const currentSlide = ref(0);
const photos = ref([]);
const disableButton = ref(false);

const route = useRoute();

const productStore = useProductStore();
const categoryStore = useCategoryStore()

const deletePhotos =[]


useAsyncData('product', async () => {
  const id = route.params.id;
  if (id) {
    await productStore.getItem(id);
  } 
  categoryStore.fetchCategories()
  updateItemsToShow();
}, { server: true });

const product = computed(() => productStore.product);
const categories = computed(() => categoryStore.categories)

const slideTo = (index) => {
  currentSlide.value = index;
};
const save = async (index) => {
  console.log(product.value)
  disableButton.value = true;
  const files = photos.value.map(photo => photo.file);
  try {
    await Promise.all(deletePhotos.map(photoId => productStore.deleteProduct(photoId)));

    
    await productStore.updateProduct(product.value, files);
  } catch (error) {
    console.error(error);
  } finally {
    disableButton.value = false;
  }
};

const handleFileUpload = event => {
  Array.from(event.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      photos.value.push({ file, url: e.target.result });
    };
    reader.readAsDataURL(file);
  });
};

const deletePhoto = (id) => {
    product.value.photos = product.value.photos.filter(photo=>photo._id!=id)
    deletePhotos.push(id)
    changeSlide(-1, product.value.photos)
};

const deletePhotoUrl = (index) => {
    photos.value.splice(index, 1);
}
const itemsToShow = ref(3); 

const updateItemsToShow = () => {
};
onMounted(() => {
  updateItemsToShow();
});

defineExpose({
  currentSlide,
  slideTo,
});


const changeSlide = (direction, photos) => {
  const numberOfSlides = photos.length;
  currentSlide.value = (currentSlide.value + direction + numberOfSlides) % numberOfSlides;
};

definePageMeta({
  layout: 'admin'
});
</script>
   
   
<template>
    <div class="">
        <section class="w-full h-[100%] flex flex-col gap-3 justify-between bg-[url('~/assets/img/bgheader-pc.webp')] bg-no-repeat bg-cover p-4 lg:px-24 xl:px-36 2xl:px-48 py-20 items-center">
            <section class="h-full w-full bg-white rounded-[20px] p-10">
                <div class=" flex justify-between items-center pb-5">
                    <input v-model="product.name" class="w-3/4 Gotham text-lg lg:text-[32px]"/>
                    <a href="javascript:history.back()" class="flex items-center gap-2.5 Gotham text-sm lg:Gotham-light lg:text-lg  xl:text-xl  2xl:text-2xl">
                        <svg class="hidden lg:block" width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12L1 6.5L8 1" stroke="black" stroke-linecap="round"/>
                        </svg>

                        <svg class="block lg:hidden" width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L1 5L6 1" stroke="black" stroke-linecap="round"/>
                        </svg>
                        Назад
                    </a>
                </div>
                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-[2]">
                      <div class="relative px-5 md:px-[50px] lg:px-[70px] xl:px-[100px] 2xl:px-[100px] py-[16px] lg:py-[28px] xl:py-[40px] 2xl:py-[52px] overflow-hidden">
                          <div class="rounded-[10px] overflow-hidden relative">
                              <carousel  class="relative overflow-hidden pt-3.5 pb-[5px]" id="gallery" :items-to-show="1" :wrap-around="true" v-model="currentSlide">
                                  <slide class="bg-white rounded-xl" v-for="(photo,index) in product.photos" :key="photo.path" >
                                    <NuxtImg placeholder placeholder-class="animated-background" loading="lazy" @click="openPhoto(photo)" class="cursor-pointer h-full mx-auto rounded-[10px] max-h-[490px]" :src="photo.path" alt="фото объекта" />
                                    <button @click="deletePhoto(photo._id)" class="bg-white absolute top-0 right-0 lg:text-base xl:text-xl 2xl:text-[32px]">☒</button>
                                  </slide >
                              </carousel>
                          </div>
                          <Carousel
                            id="thumbnails"
                            :items-to-show="itemsToShow"
                            :wrap-around="true"
                            v-model="currentSlide"
                            ref="carousel"
                          >
                            <Slide class="thumb" v-for="(photo,index) in product.photos" :key="photo.path">
                                <NuxtImg placeholder placeholder-class="animated-background" loading="lazy"  class="cursor-pointer max-w-[75px] md:max-w-[90px] lg:max-w-[100px] 2xl:max-w-[110px] rounded-[10px] px-1.5"  @click="slideTo(index)" :src="photo.path" alt="фото объекта" />
                            </Slide>
                          </Carousel>
                          <button class="switch-photo-button left-[8px] md:left-[20px] lg:left-[30px]" @click="changeSlide(-1, product.photos)">
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="20" cy="20" r="20" fill="#0085BA"/>
                              <path d="M22.5954 14L18.2977 17L15.2019 19.161C14.6243 19.5642 14.6335 20.4223 15.2196 20.8131L23 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
                              </svg>
                          </button>
                          <button class="switch-photo-button right-[8px] md:right-[20px] lg:right-[30px]" @click="changeSlide(1, product.photos)">
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="20" cy="20" r="20" transform="matrix(-1 0 0 1 40 0)" fill="#0085BA"/>
                                  <path d="M17.4046 14L21.7023 17L24.7981 19.161C25.3757 19.5642 25.3665 20.4223 24.7804 20.8131L17 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
                              </svg>
                          </button>
                        </div>
                      </div>  
                    <div class=" flex-[1] relative overflow-hidden flex flex-col gap-1.5 xl:gap-3 2xl:gap-5 ">
                        <h3 class="Gotham text-lg lg:text-[32px]">Описание объекта</h3>
                        <ul class="relative  flex flex-col xl:gap-0.5 2xl:gap-[10px] pb-5 Gotham-light">    
                            <li class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Заголовок: <input v-model="product.name" class="Gotham-light text-black w-full border-b"/></li>                            
                            <li class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Дата:<input v-model="product.period" class="Gotham-light text-black w-full border-b"/></li>                                            
                            <li class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Адрес:<input v-model="product.address" class="Gotham-light text-black w-full border-b"/></li>                            
                            <li class=" whitespace-nowrap flex text-[#0085BA] Gotham lg:text-xs xl:text-base 2xl:text-xl">Колличество домов:<input v-model="product.houses_count" class="Gotham-light text-black w-full border-b"/></li>                                            
                          </ul>
                        <label>Категория</label>
                        <select class="border border-black rounded-lg p-2" v-model="product.category">
                            <option v-for="category in categories" :value="category._id" :key="category._id">{{ category.name }}</option>
                        </select>
                        <input class="pb-10" type="file" @change="handleFileUpload" multiple>
                        <draggable v-model="photos" class="pb-10 flex flex-wrap gap-2.5" item-key="url" @end="updateOrder">
                          <template #item="{element, index}">
                            <div class="relative">
                              <img :src="element.url" :alt="'Photo ' + index" class="w-20 draggable-item">
                              <button @click="deletePhotoUrl(index)" class="bg-white absolute top-0 right-0 lg:text-base xl:text-xl 2xl:text-[32px]">☒</button>
                            </div>
                          </template>
                        </draggable>
                    </div>
                </div>
            </section>
            <button @click.prevent="save()" :disabled="disableButton" class="bg-white p-3 rounded-xl">Сохранить</button>
        </section>
    </div>

</template>

<style>
.Switch {
  position: absolute;
  top: 40%;
}
.ul-flex-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.ul-flex {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.ul-flex-scroll::-webkit-scrollbar {
  height: 6px;
  width: 25px;
}

.ul-flex-scroll::-webkit-scrollbar-track {
  background: #dddddd;
  border-radius: 10px;
}

.ul-flex-scroll::-webkit-scrollbar-thumb {
  background-color: #0085BA;
  border-radius: 10px;
  width: 50px;
}
.carousel__prev{
    color:#0085BA;  
}
.carousel__next{
    color:#0085BA;  
}
.carousel__prev:hover{
    color:#0085BA;  
}
.carousel__next:hover{
    color:#0085BA;  
}

.thumb {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.switch-photo-button {
  position: absolute;
  top: 45%;
}

.ul-flex-scroll .child:first-child {
  border-top-left-radius: 10px;
  border-color: #B5B5B5;
}

.ul-flex-scroll .child:last-child {
  border-top-right-radius: 10px;
  border-color: #B5B5B5;
  border-right-width:1px;
}

.modal-content {
  width: 90%;
  height: 90%;
}
.slider-container.active {
  cursor: grabbing; /* Курсор в виде захвата */
}

.slider-container {
  user-select: none; /* Предотвращает выделение текста при перетаскивании */
  cursor: grab; /* Курсор в виде руки */
}

@keyframes placeHolderShimmer{
    0%{
        background-position: -468px 0
    }
    100%{
        background-position: 468px 0
    }
}

.animated-background {
    animation-duration: 1.25s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: darkgray;
    background: linear-gradient(to right, #eeeeee 10%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    position: relative;
}
</style>