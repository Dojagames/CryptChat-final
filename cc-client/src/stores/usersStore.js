import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore(
  'users',
  () => {
    const users = ref({});



    function addUser(user) {
      if(users.value[user.username]) {
        console.log("could not add user");
        return;
      }
      users.value[user.username] = user;
      console.log("added user");
    }

    function updateUser(name, updatedUser, callback) {

      if (users.value[name]) {
        users.value[name] = {
          ...users.value[name], // Keep existing properties
          ...updatedUser // Overwrite with updated properties
        };
        if(callback){
          callback(null);
        }
      } else {
        if(callback){
          callback("user not found");
        }
      }
    }



    return {users, addUser, updateUser};
  },
  {
    persist: true
  }
)
