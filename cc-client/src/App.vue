<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import Background  from "@/components/background.vue";
  import {onMounted, provide} from "vue";
  import {useSession} from '@/stores/sessionStore.js';
  import io from 'socket.io-client';
  import {useProfileStore} from "@/stores/profileStore.js";
  import EC from 'elliptic';

  const socket = io('localhost:3000');
  provide('socket', socket);


  const session = useSession();
  const profile = useProfileStore();
  //startup logic goes here
  let loggedIn = session.session; //should check regularly if still logged in.
  console.log(session.session);

  let keyPair;
  let publicKey;
  let privateKey;
  let username;

  //if(!keyPair){
  //  console.log("no keypair");
    //generate keypair
  //}

  const router = useRouter();

  if(!loggedIn){
    router.push('/login');
  } else {
    //socket.emit('login');
    const ec = new EC.ec('secp256k1');
    privateKey = profile.profile.privateKey;
    publicKey = profile.profile.publicKey;
    keyPair = ec.keyFromPrivate(privateKey);
    username = profile.profile.username;

    console.log(username);

    const signature = keyPair.sign('test').toDER('hex');
    socket.emit('login', { username, signature, message: 'test' });
  }

  socket.on('login_success', async (data)=> {
    console.log("login success");
    const {msgs} = data;
    for (const e of msgs) {
      //console.log(JSON.parse(JSON.parse(e.msg)));
      //const decrypted = await this.decryptMessage(this.publicKeyList[e.from], JSON.parse(JSON.parse(e.msg)));
      //const msgObj = {
      //  from: e.from,
      //  message: decrypted,
      //  timestamp: new Date().getTime(),
      //  type: "text"
      //}
      //this.messages.push(msgObj);

    }
    //await this.saveToIndexedDB('msgs', JSON.stringify(this.messages));
    //this.registered = true;
  });

  socket.on('login_failed', (data) => {
    console.log("login failed");
  });
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
