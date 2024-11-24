<script setup>
  import { RouterLink, RouterView, useRouter } from 'vue-router';
  import Background  from "@/components/background.vue";
  import {onMounted, provide, onBeforeUnmount} from "vue";
  import {useSession} from '@/stores/sessionStore.js';
  import {useProfileStore} from "@/stores/profileStore.js";
  import {useUsersStore} from "@/stores/usersStore.js";

  import io from 'socket.io-client';
  import EC from 'elliptic';
  const ec = new EC.ec('secp256k1');
  const socket = io('localhost:3000');
  provide('socket', socket);
  provide('ec', ec);


  const session = useSession();
  const profile = useProfileStore();
  const users = useUsersStore();
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

  let toDecrypt = [];

  socket.on('receive_message', async (data) => {
    console.log("recieved msg", data);
    const {from, message, signature} = data;
    if(!users.users[from] || !users.users[from].publicKey){
      console.log(users.users[from]);
      socket.emit('getUserInfo', from);
      toDecrypt.push({from, message});
      console.log(toDecrypt);
      return;
    }

    const pKey = ec.keyFromPublic(users.users[from].publicKey, 'hex');
    const isValid = pKey.verify(message, signature);
    if(!isValid){
      console.warn("signature is not valid; msg recieved from: ", from);
      return;
    }

    const decrypted = await decryptMessage(privateKey,pKey,msg);
    console.log(decrypted);
    //push to messages
  });


  socket.on('receive_user_info', async(data)=> {
    console.log(data)
    if(!users.users[data.username]){
      users.addUser(data);
    } else {
      users.updateUser(data.username, data);
      for(const e of toDecrypt){
        const decrypted = await decryptMessage(privateKey, ec.keyFromPublic(data.publicKey, 'hex'), e.msg);
        console.log(decrypted);
      }

      console.log("updated user");
    }
  })

  async function decryptMessage(privateKey, publicKey, msg) {
    // Ensure the shared secret is derived and cached for this session
    const aesKey = await deriveSharedSecret(privateKey, publicKey);
    const encryptedData = msg.message;
    // Extract IV and encrypted message from the encrypted data
    const { iv, encryptedMessage } = encryptedData;

    // Convert IV and encrypted message from hex strings back to Uint8Array
    const ivArray = new Uint8Array(iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const encryptedMessageArray = new Uint8Array(encryptedMessage.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

    // Decrypt the message using AES-GCM
    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivArray,
        },
        aesKey,
        encryptedMessageArray
      );

      // Convert decrypted buffer to a string and return it
      msg.message = new TextDecoder().decode(decryptedBuffer);
      return msg;
    } catch (e) {
      console.error('Decryption failed:', e);
      throw new Error('Decryption failed');
    }
  }

  async function deriveSharedSecret(privateKey, publicKey) {

      // Derive shared secret using ECDH
      const sharedSecret = privateKey.derive(publicKey.getPublic());

      // Hash the shared secret using SHA-256
      const sharedSecretArray = new TextEncoder().encode(sharedSecret.toString(16));
      const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecretArray);

      // Cache the hashed shared secret
      return await crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
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
