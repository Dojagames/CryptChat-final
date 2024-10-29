import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const users = ref([]);
  users.value = [
    {name: "John", lastMsg: "hallo du bastard"},
    {name: "Doe", lastMsg: "testtesttest"},
    {name: "Alice", lastMsg: "124"}
  ];
  function addUser(user) {
    users.value.push(user);
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
})
