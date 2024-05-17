<script setup>
import { ref, computed } from 'vue';
import 'vue3-carousel/dist/carousel.css'

const activeIndex = ref(0); 
const currentSlide = ref(0);

const currentPhoto = ref(null);
const isPhotoPopupOpen = ref(false);
const sliderContainer1 = ref(null);

const props = defineProps({
    products: {
        type: Object,
        default: () => ([]),
    },
}); 
const selectSection = (index) => {
  activeIndex.value = index;
  currentSlide.value = 0;

};
const changeSlide = (direction, photos) => {
  const numberOfSlides = photos.length;
  currentSlide.value = (currentSlide.value + direction + numberOfSlides) % numberOfSlides;
};

const getHouseSuffix = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'дом';
  } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return 'дома';
  } else {
    return 'домов';
  }
};

const slideTo = (index) => {
  currentSlide.value = index;
};
const itemsToShow = ref(5); 

const updateItemsToShow = () => {
  const width = window.innerWidth;
  if (width < 500) {
    itemsToShow.value = 3; // для мобильных устройств
  } else if (width >= 500 && width < 768) {
    itemsToShow.value = 5; // для планшетов
  } else if (width >= 768 && width < 1200) {
    itemsToShow.value = 7; // для планшето
  } else {
    itemsToShow.value = 9; // для настольных ПК
  }
};

onMounted(() => {
  updateItemsToShow();
  window.addEventListener('resize', updateItemsToShow);
  window.addEventListener('keydown', handleKeydown);
  if (sliderContainer1.value) {
    initDragToScroll();
  }
});

watch(() => activeIndex.value, () => {
  updateItemsToShow();
});
const openPhoto = (photo) => {
  currentPhoto.value = photo;
  isPhotoPopupOpen.value = true;
}
const closeOnOuterClick = (event) => {
  if (event.target === event.currentTarget) {
    isPhotoPopupOpen.value = false;
    console.log('beb')
  }
  console.log('ne')

};
const scrollRight = () => {
  if (sliderContainer1.value) {
    sliderContainer1.value.scrollLeft += 100;
  }
};

// Функция для прокрутки влево
const scrollLeft = () => {
  if (sliderContainer1.value) {
    sliderContainer1.value.scrollLeft -= 100;
  }
};
const handleKeydown = (event) => {
  if (event.key === "ArrowRight") {
    scrollRight();
  } else if (event.key === "ArrowLeft") {
    scrollLeft();
  }
};
const initDragToScroll = () => {
  let isDown = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDown = true;
    startX = e.pageX - sliderContainer1.value.getBoundingClientRect().left;
    scrollLeft = sliderContainer1.value.scrollLeft;
  };

  const stopDragging = () => {
    isDown = false;
  };

  const doDrag = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderContainer1.value.getBoundingClientRect().left;
    const walk = (x - startX) * 1; // умножаем на 3 для ускорения прокрутки
    sliderContainer1.value.scrollLeft = scrollLeft - walk;
  };  

  sliderContainer1.value.addEventListener('mousedown', startDragging);
  sliderContainer1.value.addEventListener('mouseleave', stopDragging);
  sliderContainer1.value.addEventListener('mouseup', stopDragging);
  sliderContainer1.value.addEventListener('mousemove', doDrag);
};

</script>

<template>
    <section v-if="products[activeIndex]" class="">
      <ul v-if="$device.isDesktop" class="ul-flex-scroll slider-container" ref="sliderContainer11">
        <li
          v-for="(product, index) in products"
          :key="index"
          :class="{
            'text-white bg-[#0085BA]': index === activeIndex,
            'cursor-pointer border border-[#B5B5B5] border-b-0 border-r-0 px-1.5 md:px-3 lg:px-5 xl:px-7 2xl:px-9 py-5 Gotham child': true }"
          @click="selectSection(index)"
        >
          <h3 class="text-sm md:text-base lg:text-xl xl:text-2xl">{{ product.name }}</h3>
        </li>
      </ul>
      <ul v-else class="flex flex-wrap gap-2.5 pb-[14px]">
        <li
          v-for="(product, index) in products"
          :key="index"
          :class="{
            'text-white bg-[#0085BA]': index === activeIndex,
            'cursor-pointer border rounded-[30px] border-[#B5B5B5] px-3.5 md:px-3 lg:px-5 xl:px-7 2xl:px-9 py-1 Gotham': true
          }"
          @click="selectSection(index)"
        >
          <h3 class="text-xs md:text-base lg:text-xl xl:text-2xl leading-5">{{ product.name }}</h3>
        </li>
      </ul>
      <section class="border border-[#B5B5B5]" :class="{'rounded-[20px]':$device.isDesktop, 'rounded-[20px]': !$device.isDesktop}">
          <div class="relative slider-container px-5 md:px-[50px] lg:px-[70px] xl:px-[100px] 2xl:px-[100px] py-[16px] lg:py-[28px] xl:py-[40px] 2xl:py-[52px] overflow-hidden">
            <div class="rounded-[10px] overflow-hidden relative">
              <h3 class="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-5 Gotham">
                {{ products[activeIndex].period }} {{ products[activeIndex].address }} 
                {{ products[activeIndex].houses_count }} {{ getHouseSuffix(products[activeIndex].houses_count) }}</h3>
                <carousel  class="relative overflow-hidden pt-3.5 pb-[5px]" id="gallery" :items-to-show="1" :wrap-around="true" v-model="currentSlide">
                    <slide class="bg-white rounded-xl" v-for="(photo,index) in products[activeIndex].photos" :key="photo.path" >
                      <NuxtImg placeholder placeholder-class="animated-background" loading="lazy" @click="openPhoto(photo)" class="cursor-pointer h-full mx-auto rounded-[10px] max-h-[490px]" :src="photo.path" alt="фото объекта" />
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
              <Slide class="thumb" v-for="(photo,index) in products[activeIndex].photos" :key="photo.path">
                  <NuxtImg placeholder placeholder-class="animated-background" loading="lazy"  class="cursor-pointer max-w-[75px] md:max-w-[90px] lg:max-w-[100px] 2xl:max-w-[110px] rounded-[10px] px-1.5"  @click="slideTo(index)" :src="photo.path" alt="фото объекта" />
              </Slide>
            </Carousel>
            <button class="switch-photo-button left-[8px] md:left-[20px] lg:left-[30px]" @click="changeSlide(-1, products[activeIndex].photos)">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#0085BA"/>
                <path d="M22.5954 14L18.2977 17L15.2019 19.161C14.6243 19.5642 14.6335 20.4223 15.2196 20.8131L23 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <button class="switch-photo-button right-[8px] md:right-[20px] lg:right-[30px]" @click="changeSlide(1, products[activeIndex].photos)">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" transform="matrix(-1 0 0 1 40 0)" fill="#0085BA"/>
                    <path d="M17.4046 14L21.7023 17L24.7981 19.161C25.3757 19.5642 25.3665 20.4223 24.7804 20.8131L17 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
          </div>
          <div v-if="isPhotoPopupOpen" @click="closeOnOuterClick" class="cursor-pointer fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div class="flex items-center relative w-[90%] h-[90%]">
              <button @click.stop="isPhotoPopupOpen = false" class="absolute top-0 right-1 text-white  text-4xl lg:text-6xl">×</button>
              <NuxtImg loading="lazy" ref="photo" :src="currentPhoto.path" class=" object-contain w-full h-full cursor-default rounded-[20px]" alt="Просмотр фото" />
            </div>
          </div>
      </section>  
    </section>
</template>
<style scoped>
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
