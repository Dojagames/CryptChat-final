import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref({});

    function setProfile(user) {
      profile.value = user;
    }

    function setUsername(username) {
     if(username && profile.value)
      profile.value.username = username;
    }

    function setDisplayName(displayName) {
      if(displayName && profile.value)
        profile.value.displayName = displayName;
    }

    return {profile, setProfile, setUsername, setDisplayName};
  },{
    persist: {
      enabled: true,
      storage: window.localStorage,
    }
  }
)

//userProfile = {
//  username,
//  displayName,
//  keyPair,
//  publicKey,
// }
