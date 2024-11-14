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

    return {profile, setProfile, setUsername};
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
