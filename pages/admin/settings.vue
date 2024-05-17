<script setup>
import { useUserStore } from '~/stores/users'

const password = ref('');
const newUser = computed(() => userStore.user)
const photosUrls = ref([]);
const photos = ref([]);

const userStore = useUserStore()
const user = ref({ ...newUser.value });

const saveChanges = () => {
  if (user.value.name !== newUser.value.name) {
    userStore.updateUser('name', newUser.value.name);
  }
  if (user.value.email !== newUser.value.email) {
    userStore.updateUser('email', newUser.value.email);
  }
  if (user.value.phone !== newUser.value.phone) {
    userStore.updateUser('phone', newUser.value.phone);
  }
  if (photos.value.length > 0) {
    userStore.updateUser('avatar',photos.value[0]);
  }
  if (password.value) {
    userStore.updateUser('password', password.value);
  }
  alert('Профиль успешно изменен!')
  location.reload();
};

const handleFileUpload = event => {
  const file = event.target.files[0];
  if (file) {
    photos.value = [];
    photosUrls.value = [];

    photos.value.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      photosUrls.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};


definePageMeta({
  layout: 'admin'
});
</script>
<template>
    <div class=" w-full h-full mt-20 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48">
      <div class="relative  border-2 border-[#696969] rounded-[20px] flex flex-col items-center p-20">
          <h4 class="text-xl pb-12 text-center">Настройки</h4>
          <img class="w-32" :src="newUser.photo" alt="avatar" />
          <form class="flex flex-col items-start gap-5 max-w-[324px] z-20">
            <input v-model="newUser.name" type="text" placeholder="Иммя" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="newUser.email" type="text" placeholder="Email" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="newUser.phone" v-maska data-maska="+7(###)-###-##-##"  type="tel" placeholder="Телефон" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input v-model="password" type="text" placeholder="Пароль" class="bg-transparent border-b border-[#979797] focus:outline-none w-full"/>
            <input class="pb-10" type="file" @change="handleFileUpload" multiple>
            <div  class="pb-10 flex">
                <img v-for="(photoUrl, index) in photosUrls" :key="index" :src="photoUrl" :alt="'Photo ' + index" style="width: 100px; height: auto;">
            </div>
            <button @click.prevent="saveChanges()" class=" px-2.5 border border-[#696969] rounded-md w-full">Изменить</button>
          </form>
          <img src="~/assets/img/wave-r.svg" alt="wave" class="absolute bottom-0 right-0 z-10 opacity-30"/>
        </div>
    </div>
</template>