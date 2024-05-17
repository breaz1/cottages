import { defineStore } from 'pinia'
import axios from 'axios'
export const useUserStore = defineStore('users', {
  state: () =>{
    return{
      users: [],
      user:{},
      auth:false,
      editedUser:{},
    }
  },
  actions: {
    async getManagers() {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const response = await $axiosPlugin.get('/api/user/main')
        this.users = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async getAuth(login,password) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const response = await $axiosPlugin.post('/api/user/auth',{ 
            login:login,
            password:password,
         })
         if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.user = response.data
            this.auth=true;
            return true
          }
          return false
      } catch (error) {
        console.error('Error auth:', error)
      }
    },
    async getUser() {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const response = await $axiosPlugin.get('/api/user/',{
          headers:{
            'auth-token': `${localStorage.getItem('token')}`
          }
        })
        this.user = response.data
      }
      catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }
    },
    async deleteManager(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        await $axiosPlugin.delete(`/api/user/admin`,{
          data:{_id:id},
          headers: {
            'auth-token': localStorage.getItem('token'),
          }
        })
        this.getManagers()
      } catch (error) {
        alert('Ошибка!')
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }
    },
    async addUser(user,photo) {
      const { $axiosPlugin } = useNuxtApp();
      const formData = new FormData();
      for (const key in user) {
        formData.append(key, user[key]);
      }
      formData.append('avatar', photo);
      try {
        await $axiosPlugin.post('/api/user/',formData,{
          headers:{
            'auth-token': `${localStorage.getItem('token')}`
          }
        })
        alert('Пользователь создан!')
        location.reload();
      }
      catch (error) {
        alert(JSON.stringify(error.response.data.errors[0].message))
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
      }
    },
    async updateUser(field, newfield,id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        if(typeof(newfield)==String){
          const response = await $axiosPlugin.put('/api/user/', {
          newField: field,
          field: newfield,
          id:id,
          }, 
          {
            headers: {
              'auth-token': localStorage.getItem('token'),
            }
          });
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.user = response.data
          }
          alert('Профиль успешно изменен!')
        }
        else{
          const formData = new FormData();
          formData.append(`field`, field); 
          formData.append(`newfield`, newfield);
          await $axiosPlugin.put('/api/user/',formData, 
          {
            headers: {
              'auth-token': localStorage.getItem('token'),
            }
          });
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.user = response.data
          }
          console.log('bebe')
          alert('Профиль успешно изменен!')
          location.reload();       
        }
      }  
      catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }    
    },
    async getEditedUser(id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        const params = {
          userId: id,
        };
        const response = await $axiosPlugin.get('/api/user/user', {
          params,
          headers: {
            'auth-token': localStorage.getItem('token'),
          }
        });
        this.editedUser = response.data
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },  
    async editUser(field, newfield, id) {
      const { $axiosPlugin } = useNuxtApp();
      try {
        if(typeof(newfield)==String){
          const response = await $axiosPlugin.put(`/api/user?userId=${id}`, {
              newField: field,
              field: newfield,
            },
            {
              headers: {
                'auth-token': localStorage.getItem('token'),
              },
            }
          );
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.user = response.data
          }
          alert('Профиль успешно изменен!')
        }
        else{
          const formData = new FormData();
          formData.append(`field`, field); 
          formData.append(`newfield`, newfield);
          await $axiosPlugin.put(`/api/user?userId=${id}`, formData, 
            {
              headers: {
                'auth-token': localStorage.getItem('token'),
              },
            }
          );
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.user = response.data
          }
          console.log('bebe')
          alert('Профиль успешно изменен!')
          location.reload();       
        }
      }  
      catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          location.reload();
        }
      }   
    },
  }
})
