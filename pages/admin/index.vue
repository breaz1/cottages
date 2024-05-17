<script setup>
definePageMeta({
  layout: 'admin'
});
//v-if="user.admin"
</script>
<template>
    <div class="w-300px h-[95vh] mt-14 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
        <div class="relative  border-2 border-[#696969] rounded-[20px] flex flex-col p-6 ">
          <h2 class="text-xl pb-12">Админ панель</h2>
          <ul class="flex flex-col gap-4 z-20">
            <li>
              <h3 class=" 2xl:text-2xl xl:text-lg lg:text-base Gotham">Наполнение сайта - "объекты".  <a class="text-[#0085BA]" href="/admin/products">Перейти</a></h3>
            </li>
            <li>
              <h3  class=" 2xl:text-2xl xl:lg lg:base Gotham">Настройка профиля - "настройки".  <a class="text-[#0085BA]" href="/admin/settings">Перейти</a></h3>
            </li>
            <li >
              <h3  class=" 2xl:text-2xl xl:lg lg:base Gotham">Добавление/изменение менеджеров - "менеджеры".  <a class="text-[#0085BA]" href="/admin/managers">Перейти</a></h3>
            </li>
          </ul>
          <img src="~/assets/img/wave-r.svg" alt="wave" class="absolute hidden md:block bottom-0 right-0 z-10 opacity-30"/>
        </div>
    </div>
    
</template>