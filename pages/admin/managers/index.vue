<script setup>
import { useUserStore } from '~/stores/users'

const usersStore = useUserStore()
useAsyncData('users', () => {
    usersStore.getManagers()
}, { server: true })

const users = computed(() => usersStore.users)

const deleteManager = (id) =>{
    usersStore.deleteManager(id)
}


definePageMeta({
  layout: 'admin'
});
</script>
<template>
     <section class="flex flex-col justify-center mt-24 px-4 md:px-12 lg:px-24 xl:px-36 2xl:px-48 pb-20">
        <NuxtLink to="/admin/managers/add" class="text-center p-5 my-6 bg-gray-300">Добавить менеджера</NuxtLink>
        <div class="flex flex-col">
            <section v-for="user in users" class="w-full flex justify-between whitespace-nowrap p-2 mt-2 rounded-[10px] border border-[#696969]">
                <div class="flex gap-2">
                    <img class=" w-28 rounded-xl" :src="user.photo" :alt="user.name" />
                    <section class="flex flex-col leading-tight">
                        <ul>
                            <li><span class="text-[#0085BA] w-auto text-[10px] md:text-sm lg:text-sm Gotham font-bold">{{ user.post }}</span></li>
                            <li><span class="text-[10px] md:text-sm lg:text-sm">{{ user.name }}</span></li>
                            <!--<li><a class="text-[10px] md:text-sm lg:text-sm">{{ user.phone }}</a></li>
                            <li><a class="underline text-[10px] md:text-sm lg:text-sm">{{ user.email }}</a></li>-->
                        </ul>  
                    </section>
                </div>
                <div  class="flex flex-col gap-2 ">
                    <button v-if="!user.admin" @click.prevent="deleteManager(user._id)" class="text-[10px] md:text-sm lg:text-sm border rounded-lg border-gray-500 h-max p-2">Удалить</button>
                    <NuxtLink :to="`managers/${user._id}`" class="text-[10px] md:text-sm lg:text-sm border rounded-lg border-gray-500 h-max p-2">Изменить</NuxtLink>
                </div>            
            </section>
        </div>
        
      </section>
</template>