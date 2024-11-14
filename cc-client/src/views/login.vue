<script setup>
import {ref} from "vue";

import socket from '../socket.js';

import {useProfileStore} from "@/stores/profileStore.js";
import {useSession} from '@/stores/sessionStore.js';


const profileStore = useProfileStore();
const session = useSession();


import EC from 'elliptic';
const ec = new EC.ec('secp256k1'); // Use the secp256k1 elliptic curve
let username = ref("");
let displayName = ref("");

let keyPair;
let publicKey;

let registering = ref(true);




function register(name){
    console.log(name);
    keyPair = ec.genKeyPair();
    publicKey = keyPair.getPublic('hex');

    if (username) {
      socket.emit('register', {
        username: username,
        publicKey: publicKey,
      });
    } else {
      this.error = 'Username is required';
    }
}

function setDisplayName(name){
  socket.emit('setDisplayName', (name));

  session.login();
}

socket.on('displayNameSet', (name) => {
  session.login();
  profileStore.setUsername(name);
});


socket.on('registered', () => {
  //save UserObj
  profileStore.setProfile({
    username: username,
    displayName: username,
    keyPair: keyPair,
    publicKey: publicKey,
  });
  registering = false;
});

socket.on('register_failed', (reason) => {
  if(reason === 'username_taken') {

  } else {

  }
  console.error('Failed to register', reason);
});


</script>

<template>
  <div class="login-container" v-if="registering">
    <input class="login-input-name" placeholder="Username" type="text" v-model="username">
    <button class="login-button" @click="register(username)">Register</button>
  </div>
  <div class="login-container" v-else>
    <input class="login-input-name" placeholder="Displayname" type="text" v-model="displayName">
    <button class="login-button" @click="setDisplayName(displayName)">Register</button>/
  </div>
</template>

<style scoped>
  .login-container {
    width: 100%;
    height: 100%;

    position: absolute;
    inset: 0; /* Centers horizontally and vertically */
    margin: auto; /* Necessary for the centering with a specific width and height */

    /*transform-style: preserve-3d;
    transition: transform 0.1s ease; */

    background-color: var(--transparent-background);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    box-shadow: -5px -5px 20px 10px rgba(255, 255, 255, 0.08), 5px 5px 20px 10px rgba(0, 0, 0, 0.1); /* More subtle 3D effect shadow */

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-input-name{
    border: 1px solid white;
    border-radius: 1.2rem;
    padding: .5rem;
    margin: 1rem;
    outline: none;
    background-color: transparent;
    align-self: center;
    text-align: center;
    width: 85%;
    font-size: 1.5rem;
    color: white;
    box-sizing: border-box;
  }

  .login-button{
    border: 1px solid var(--primary-color);
    border-radius: 1.2rem;
    padding: .5rem;
    background-color: var(--secondary-background-color);
    align-self: center;
    width: 85%;
    cursor: pointer;
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-color);
    box-sizing: border-box;
  }

</style>
