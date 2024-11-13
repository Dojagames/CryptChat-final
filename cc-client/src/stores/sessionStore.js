import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSession = defineStore(
  'session',
  () => {
    const session = ref(false)

    function login(callback) {
      // Check if login is valid
      session.value = true
    }

    function logout() {
      session.value = false
    }

    return { session, login, logout }
  },
  {
    persist: true
  }
)
