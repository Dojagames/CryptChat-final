<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import Background  from "@/components/background.vue";
  import {onMounted, provide} from "vue";
  import {useSession} from '@/stores/sessionStore.js';
  import io from 'socket.io-client';

  const socket = io('localhost:3000');
  provide('socket', socket);


  const session = useSession();
  //startup logic goes here
  let loggedIn = session.session; //should check regularly if still logged in.
  console.log(session.session);


  const router = useRouter();

  if(!loggedIn){
    router.push('/login');
  } else {
    //socket.emit('login');
  }



</script>

<template>
  <Background/>
  <RouterView />
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
