import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesToSendStore = defineStore(
  'messagesToSend',
  () => {
    const messagesToSend = ref([]);
    const messagesToSendCount = computed(() => messagesToSend.value.length);
    function addMessageToSend(message) {
      messagesToSend.value.push(message);
    }

    function clearMessagesToSend() {
      messagesToSend.value = [];
    }

    function clearSpecificMessageToSend(id) {
      const index = messagesToSend.value.findIndex((message) => message.id === id);
      if (index !== -1) {
        messagesToSend.value.splice(index, 1);
      }
    }

    return {messagesToSend, addMessageToSend, clearMessagesToSend, clearSpecificMessageToSend, messagesToSendCount};
  },
  {
    persist: {
      enabled: true,
      storage: window.localStorage,
    }
  }
)
