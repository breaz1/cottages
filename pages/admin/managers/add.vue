<script setup>
import { useUserStore } from '~/stores/users'

const photosUrls = ref([]);
const user = ref({});
const photos = ref([]);
const disableButton = ref(false);

const userStore = useUserStore()
const handleFileUpload = event => {
  const file = event.target.files[0];
  if (file) {
    photos.value = [];
    photosUrls.value = [];

    user.value.avatar = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      photosUrls.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
} 
const saveChanges = () => {
  disableButton.value = true; 

  try {
  userStore.addUser(user.value,photos.value)
  } catch (error) {
    console.error(error);
  } finally {
    disableButton.value = false;
  }
};
definePageMeta({
  layout: 'admin'
});
</script>
<template> 
<div  class="w-full h-full mt-20 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
      <div class="relative  border-2 border-[#696969] rounded-[20px] flex flex-col items-center p-20">
          <h4 class="text-xl pb-12 text-center">Добавить менеджера</h4>
          <form class="flex flex-col items-start gap-5 max-w-[324px] z-20">
            <input v-model="user.name" type="text" placeholder="Имя" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="user.post" type="text" placeholder="Должность" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <!--<input v-model="user.login" type="text" placeholder="Логин" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="user.email" type="text" placeholder="Email" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-maska data-maska="+7(###)-###-##-##" v-model="user.phone" type="tel" placeholder="Телефон" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="user.password" type="text" placeholder="Пароль" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>-->
            <input class="pb-10" type="file" @change="handleFileUpload" multiple>
            <div  class="pb-10 flex">
                <img v-for="(photoUrl, index) in photosUrls" :key="index" :src="photoUrl" :alt="'Photo ' + index" style="width: 100px; height: auto;">
            </div>
            <button :disabled="disableButton" @click.prevent="saveChanges()" class=" px-2.5 border border-[#696969] rounded-md w-full">Создать</button>
          </form>
          <img src="~/assets/img/wave-r.svg" alt="wave" class="absolute bottom-0 right-0 z-10 opacity-30"/>
        </div>
    </div>
</template>