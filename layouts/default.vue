<script setup>
import Map from "~/components/map.vue";
import { ref } from 'vue'

const searchQuery = ref('');

const categoryStore = useCategoryStore()
const categories = computed(() => {
  return categoryStore.categories;
});

useAsyncData('categories', () => {
  return categoryStore.fetchCategories()
}, { server: true })

let isMenuVisible = ref(false)

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
}
const closeMenu = () => {
  isMenuVisible.value = false
}
function handleClickOutside(event) {
  try{
      const menuElement = document.querySelector('.burger-menu');
    const toggleButtonElement = document.querySelector('.burger-menu-button');
    if (!menuElement.contains(event.target) && !toggleButtonElement.contains(event.target)) {
      closeMenu();
    }
    const searchList = document.querySelector('.list');
    const input = document.querySelector('.input'); 
    if (!searchList.contains(event.target) && !input.contains(event.target)) {
      searchQuery.value=""
    }
  }
  catch{
  }

}
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  isMenuVisible.value = false; // Закрытие меню после перехода
};

definePageMeta({
  title: 'Ялтинский берег'
})
</script>
<template>
    <div class="">
    <header :class="{'menu-active': isMenuVisible}" class="top-0 fixed bg-white z-50 w-full px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
      <nav class="flex justify-between items-center list-none lg:text-xs xl:text-sm 2xl:text-base">
        <div>
            <img class="w-24 h-14" src="~/assets/img/logo.png" alt="Logo"/>
        </div>
        <menu>
          <ul class="flex gap-7 items-center">
            <li @click="scrollToSection(category._id)" v-for="category in categories" class="hidden lg:block cursor-pointer">
                {{category.name}}
            </li>
            <li @click="scrollToSection('employees')" class="hidden lg:block cursor-pointer">
              Наши сотрудники
            </li>
            <li class="flex gap-5 items-center">
              <div class="flex flex-col items-end">
                <a href="tel:+79787977267" class="text-xs md:text-base leading-4 Gotham   whitespace-nowrap ">+7 (978) 797-72-67</a>
                <h3 class="Gotham  text-[8px] md:text-xs">Сергей Янковский</h3>
              </div>
              <img src="~/assets/img/viber.svg" alt="Viber icon"/>
            </li>
            <li class="block lg:hidden" :class="{ 'menu-active': isMenuVisible }">
              <div class="burger-menu-button">
                <img class="cursor-pointer" ref="toggleButton" src="~/assets/img/menu.svg" @click="toggleMenu()" alt="Menu">
                <menu ref="menu" class="burger-menu Gotham p-4">  
                  <button class="text-black" @click="closeMenu()">Закрыть</button>
                  <ul class="pt-7 flex flex-col gap-5">
                    <li class="cursor-pointer" @click="scrollToSection(category._id)" v-for="category in categories">
                        {{category.name}}
                    </li>
                    <li class="cursor-pointer" @click="scrollToSection('employees')">
                      Наши сотрудники
                    </li>
                  </ul>
                </menu>
              </div>
            </li>
          </ul>
        </menu>
      </nav>
    </header>
    <main class=" ">
      <section class="mt-14 relative overflow-hidden lg:text-left w-full h-[30vh] sm:h-[50vh] lg:h-[95vh] flex flex-col justify-center  bg-filter  px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48 pb-5 md:pb-10 lg:pb-[60px]">
        <h1 class="h-full flex justify-center items-center text-white w-full text-center leading-none text-[25px] md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl bebas uppercase">СК «БЕРЕГ»: СТРОИТЕЛЬСТВО В КРЫМУ</h1>
        <svg class=" mx-auto arrow" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="19" stroke="white" stroke-width="2"/>
          <path d="M19.2929 25.7071C19.6834 26.0976 20.3166 26.0976 20.7071 25.7071L27.0711 19.3431C27.4616 18.9526 27.4616 18.3195 27.0711 17.9289C26.6805 17.5384 26.0474 17.5384 25.6569 17.9289L20 23.5858L14.3431 17.9289C13.9526 17.5384 13.3195 17.5384 12.9289 17.9289C12.5384 18.3195 12.5384 18.9526 12.9289 19.3431L19.2929 25.7071ZM19 24L19 25L21 25L21 24L19 24Z" fill="white"/>
        </svg>
      </section>
      <slot class="px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48" />
    </main>
    <footer class="relative oveflow:hidden flex flex-col gap-3 bottom-0 w-full px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48 py-7 2xl:text-base xl:text-sm lg:text-xs">
      <section class="hidden md:flex justify-between 2xl:gap-24 gap-5">
        <div class="flex w-full justify-between">
          <img class="2xl:w-60 2xl:h-36 h-20 w-32" src="~/assets/img/big_Logo.png" alt="Big Logo"/>
          <section class="max-w-min xl:block hidden">
            <h3 class="text-[#0085BA] 2xl:text-xl xl:text-base lg:text-sm font-bold Gotham  leading-6">Навигация</h3>
            <nav class="list-none">
              <ul class="">
                <li @click="scrollToSection(category._id)" v-for="category in categories" class="hidden lg:block cursor-pointer">
                    {{category.name}}
                </li>
                <li @click="scrollToSection('employees')" class="hidden lg:block cursor-pointer">
                  Наши сотрудники
                </li>
              </ul>
            </nav>
          </section>
        </div>
        <div class="flex">
          <section class="flex flex-col gap-5">
            <section class="flex flex-col gap-3">
              <h3 class=" text-[#0085BA] 2xl:text-xl xl:text-base lg:text-sm font-bold Gotham  leading-6">Контакты</h3>
              <div class="flex flex-col">
                <div class="flex flex-col">
                  <a  href="tel:+79787977267" class=" leading-4   Gotham  text-base">+7 (978) 797-72-67</a>
                  <h3 class="Gotham  text-xs">Сергей Янковский</h3>
                </div>
                <div class="flex gap-1">
                  <img class="w-4" src="~/assets/img/tg.svg" alt="tg icon"/>
                  <img class="w-4" src="~/assets/img/viber.svg" alt="Viber icon"/>
                </div>            
              </div>
            </section>
          <section class="flex flex-col gap-3">
            <h3 class="text-[#0085BA] 2xl:text-xl xl:text-base lg:text-sm font-bold Gotham  leading-6">Адрес</h3>
            <h3 class="text-black Gotham  w-64">Крым, г. Ялта, ул. Свердлова 10. (Р-н Массандровского пляжа)</h3>
          </section>      
          </section>
          <div class=" ml-3 border border-[#0085BA] relative overflow-hidden max-w-80 h-48 rounded-xl">
            <Map height="198px"  width="308px" lat="44.496746" lon="34.173530"></Map>  
          </div>
        </div>
      </section>
      <section class="relative overflow-hidden flex flex-col md:hidden justify-between 2xl:gap-24 gap-5">
        <div class="grid grid-cols-2 gap-x-12 gap-y-5">
          <img class="2xl:w-60 2xl:h-36 h-20 w-32" src="~/assets/img/big_Logo.png" alt="Big Logo"/>
          <section class="flex flex-col gap-3">
              <h3 class=" text-[#0085BA] text-lg font-bold Gotham  leading-6">Контакты</h3>
              <div class="flex flex-col">
                <div class="flex flex-col">
                  <a href="tel:+79787977267" class=" leading-4   Gotham  text-base">+7 (978) 797-72-67</a>
                  <h3 class="Gotham  text-xs">Сергей Янковский</h3>
                </div>
                <div class="flex gap-1">
                  <img class="w-4" src="~/assets/img/tg.svg" alt="tg icon"/>
                  <img class="w-4" src="~/assets/img/viber.svg" alt="Viber icon"/>
                </div>            
              </div>
            </section>
          <section class="max-w-min">
            <h3 class="text-[#0085BA] text-lg  font-bold Gotham  leading-6 pb-2.5">Навигация</h3>
            <nav class="">
              <ul class=" flex flex-col gap-3.5">
                <li class="cursor-pointer" @click="scrollToSection(category._id)" v-for="category in categories">
                      {{category.name}}
                  </li>
                  <li class="cursor-pointer" @click="scrollToSection('employees')">
                    Наши сотрудники
                  </li>
              </ul>
            </nav>
          </section>
          <section class="flex flex-col relative gap-3">
            <h3 class="text-[#0085BA] text-lg font-bold Gotham  leading-6">Адрес</h3>
            <h3 class="text-black Gotham pb-5">Крым, г. Ялта, ул. Свердлова 10. (Р-н Массандровского пляжа)</h3>
          </section>  
        </div>
        <div class="flex mt-3">
          <div class="w-full h-48 border border-[#0085BA] relative overflow-hidden rounded-xl">
            <Map height="198px"  width="" lat="44.496746" lon="34.173530"></Map>  
          </div>
        </div>
      </section>
      <p class="text-[#A3A3A3] 2xl:text-sm text-xs">© 2011-2024 «Агентство недвижимости».<br> Все права защищены. Полное или частичное копирование материалов данного веб-сайта, без согласия правообладателя, преследуется по закону.</p>
    </footer>
  </div>
</template>

<style>
  .burger-menu-button {
    display: block;
  }

  .menu-active menu {
    display: block; 
    position: fixed;
    right: 0;
    top: 0%; 
    background-color: #fff;
  }
  .burger-menu {
    position: fixed;
    right: 0;  
    top: 0;
    height: 100%;
    background-color: white;
    transform: translateX(100%); 
    transition: transform 0.3s ease; 
    z-index: 100;
  }

  .menu-active .burger-menu {
    transform: translateX(0);
  }

  .bg-filter {
    background-image: url('https://levpidoor.ru/images/6637d0553bf696e7a0be00d8.webp');
    -o-background-size: cover;
    -moz-background-size: cover;
    -webkit-background-size:cover;
    background-size: cover;
  }

  @media screen and (orientation: portrait) {

    .bg-filter {
      height: 30vh;   
    }
    .bg-filter h1{
      padding-bottom: 50px; 
    }

    @media (min-width: 640px) {
      .bg-filter {
          height: 40vh;
      }
      .bg-filter h1{
        padding-bottom: 100px; 
      }
    }
  }

  @media screen and (orientation: landscape) {
    .bg-filter {
      height: 90vh;
    }
    .bg-filter h1{
      padding-bottom: 200px; 
    }
  }
  
  @keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
}

.arrow {
  animation: bounce 2s infinite;
}
</style>
