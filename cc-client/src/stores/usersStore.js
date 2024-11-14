import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore(
  'users',
  () => {
    const users = ref({});



    function addUser(user) {
      users.value[user.username] = user;
    }

    function updateUser(name, updatedUser, callback) {
      const userIndex = users.value.findIndex((e) => e.name === name);

      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex], // Keep existing properties
          ...updatedUser // Overwrite with updated properties
        };
        callback(null)
      } else {
        callback("user not found");
      }
    }

    return {users, addUser, updateUser};
  },
  {
    persist: true
  }
)
