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
    router.push('/login');
  }



</script>

<template>
  <Background/>
  <RouterView />
</template>

<style scoped>

</style>
