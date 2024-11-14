import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const settings = ref({});
    settings.value = {
      biometricLock: false,
      profilePicture: "",
      notification: {
        tone: "default",
        vibrate: "default",
      },
      theme: "default",
      font: "default",
      backup: {
        passwordProtected: false,
        storageLocation: "local",
        autoBackup: false,
        frequency: "30d",
      },
      privacy: {
        lastOnline: false,
        Online: false,
        typingIndicator: false,
        profilePicture: "nobody",
        bio: "nobody",
        blockedContacts: [],
      }
    }
  },
  {
    persist: true
  }
)
