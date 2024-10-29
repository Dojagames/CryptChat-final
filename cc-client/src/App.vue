<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import Background  from "@/components/background.vue";
  import {onMounted} from "vue";
  import {useSession} from '@/stores/sessionStore.js';

  const session = useSession();
  //startup logic goes here
  let loggedIn = session.session; //should check regularly if still logged in.
  console.log(session.session);


  const router = useRouter();

  if(!loggedIn){
    //router.push('/login');
  }



</script>

<template>
  <Background/>
  <transition name="slide" appear mode="out-in">
    <RouterView />
  </transition>
</template>

<style scoped>
/* Entering Animation */
.slide-enter-active {
  transition: transform 0.5s ease;
}

.slide-enter {
  transform: translateX(100%); /* Start the new page from the right side */
}

/* Leaving Animation */
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-leave-to {
  transform: translateX(-100%); /* Move the page out to the left side */
}
</style>
