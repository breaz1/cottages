<script setup>
import { ref, onMounted } from 'vue';
import Map from '~/components/map.vue';
import { useUserStore } from '~/stores/users'

const isMenuVisible = ref(false);
const auth = ref(false);
const login = ref('');
const password = ref('');
const error=ref(false)
const menuRef = ref(null);
const toggleButtonRef = ref(null);

const userStore = useUserStore()

const user = computed(() => userStore.user)
const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const closeMenu = () => {
  isMenuVisible.value = false;
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target) && toggleButtonRef.value && !toggleButtonRef.value.contains(event.target)) {
    closeMenu();
  }
};

const getAuth = () => {
  userStore.getAuth(login.value,password.value).then((res)=>auth.value = res)
  error.value=auth.value
};
const logout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if(localStorage.getItem('token')){
    auth.value =  true
    userStore.getUser()
  }
  else{
    auth.value =  false
  }
});

</script>

<template>
    <div v-if="auth" class="h-">
      <header  class="top-0 fixed z-50 bg-white w-full px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
        <nav class="flex justify-between items-center list-none lg:text-xs xl:text-sm 2xl:text-base">
          <div>
            <NuxtLink to="/">
              <img class="w-24 h-14" src="~/assets/img/logo.png" alt="Logo"/>
            </NuxtLink>
          </div>
          <ul class="flex gap-7 items-center">
            <li class="hidden md:block">
                <NuxtLink to="/admin/products">
                    Объекты
                </NuxtLink>
            </li>
            <li class="hidden md:block">
                <NuxtLink to="/admin/settings">
                    Настройки
                </NuxtLink>
            </li>
            <li v-if="user.admin"  class="hidden md:block">
                <NuxtLink to="/admin/managers">
                    Менеджеры
                </NuxtLink>
            </li>
            <li class="hidden md:block">
              <button @click="logout">
                Выйти
              </button>
            </li>
            <li class="block md:hidden" :class="{ 'menu-active': isMenuVisible }">
              <div class="burger-menu-button">
                <img ref="toggleButton" src="~/assets/img/menu.svg" @click="toggleMenu()" alt="Menu">
                <menu ref="menu" class="burger-menu Gotham p-4">
                  <span class="text-black" @click="closeMenu()">Закрыть</span>
                  <ul class="pt-7 flex flex-col gap-5">
                    <li>
                      <NuxtLink to="/">
                        Главная
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink to="/admin/products">
                        Объекты
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink to="/admin/settings">
                        Настройки
                      </NuxtLink>
                    </li>
                    <li v-if="user.admin" >
                      <NuxtLink to="/admin/managers">
                        Менеджеры
                      </NuxtLink>
                    </li>
                    <li v-if="user.admin" >
                      <button @click="logout">
                        Выйти
                      </button>
                    </li>
                  </ul>
                </menu>
              </div>
            </li>
          </ul>
        </nav>
      </header> 
      <main class="h-full">
          <slot />
      </main>
    </div>
    <div v-else class="flex justify-center w-full h-full mt-20 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
      <div class="relative  border-2 border-[#696969] rounded-[20px] flex flex-col p-20">
          <h4 class="text-xl pb-12 text-center">Авторизация</h4>
          <form class="flex flex-col items-start gap-5 max-w-[324px] z-20">
            <input v-model="login" type="text" placeholder="Логин" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="password" type="password" placeholder="Пароль" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <span v-if="auth===undefined">Не верный логин или пароль</span>
            <button @click.prevent="getAuth()" class=" px-2.5 border border-[#696969] rounded-md w-full">Авторизоваться</button>
          </form>
          <img src="~/assets/img/wave-r.svg" alt="wave" class="absolute bottom-0 right-0 z-10 opacity-30"/>
        </div>
    </div>
  </template>

  <style>
    .burger-menu-button {
      display: block; /* Показываем кнопку бургер-меню */
    }
  
    /* Отображение меню при активном бургер-меню */
    .menu-active menu {
      display: block; /* Показываем меню */
      position: fixed;
      right: 0;
      top: 0%; /* Меню будет отображаться под кнопкой бургер-меню */
      background-color: #fff; /* Цвет фона меню */
      /* Другие стили для адаптации меню под мобильные устройства */
    }
    .burger-menu {
      position: fixed;
      right: 0;  
      top: 0;
      width: 33%; /* Ширина меню составляет 1/3 экрана */
      height: 100%;
      background-color: white; /* Фон меню черный */
      transform: translateX(100%); /* Изначально меню скрыто за левой границей экрана */
      transition: transform 0.3s ease; /* Анимация выезда */
      z-index: 100; /* Убедитесь, что меню будет поверх других элементов */
    }
  
    .menu-active .burger-menu {
      transform: translateX(0); /* При активации меню перемещаем его на экран */
    }
  
  </style>