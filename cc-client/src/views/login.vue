<script setup>
import { ref, inject, onUnmounted } from "vue";
import { useProfileStore } from "@/stores/profileStore.js";
import { useSession } from '@/stores/sessionStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const profileStore = useProfileStore();
const session = useSession();

// Inject socket (assuming it was provided by a parent component or globally)
const socket = inject('socket');

import EC from 'elliptic';
const ec = new EC.ec('secp256k1'); // Use the secp256k1 elliptic curve

// Reactive variables
const username = ref("");
const displayName = ref("");
const registering = ref(true);
const error = ref(null);

// Non-reactive variables for the key pair
let keyPair;
let publicKey;

function register(name) {
  if (!name) {
    error.value = 'Username is required';
    return;
  }

  console.log("registering with username:", name);

  // Generate key pair
  keyPair = ec.genKeyPair();
  publicKey = keyPair.getPublic('hex');

  // Emit register event with the user data
  const user = {
    username: name,
    publicKey: publicKey,
  };
  socket.emit('register', user); // No need to wrap `user` in parentheses
}

function setDisplayName(name) {
  if (!name) {
    error.value = 'Display name is required';
    return;
  }

  socket.emit('setDisplayName', name);
}

// Socket event listeners
socket.on('displayNameSet', (name) => {
  session.login();
  profileStore.setUsername(name);
  router.push('/chat');
});

socket.on('registered', () => {
  profileStore.setProfile({
    username: username.value,
    displayName: username.value,
    keyPair: keyPair,
    publicKey: publicKey,
  });
  registering.value = false;
});

socket.on('register_failed', (reason) => {
  if (reason === 'username_taken') {
    error.value = 'Username is already taken';
  } else {
    error.value = 'Registration failed';
  }
  console.error('Failed to register:', reason);
});

// Cleanup socket listeners on component unmount
onUnmounted(() => {
  socket.off('displayNameSet');
  socket.off('registered');
  socket.off('register_failed');
});
</script>

<template>
  <div v-if="registering" class="login-container">
    <input
      v-model="username"
      type="text"
      placeholder="Username"
      class="login-input-name"
      @keyup.enter="register(username)"
    />
    <button @click="register(username)" class="login-button">Register</button>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>

  <div v-else class="login-container">
    <input
      v-model="displayName"
      type="text"
      placeholder="Display name"
      class="login-input-name"
      @keyup.enter="setDisplayName(displayName)"
    />
    <button @click="setDisplayName(displayName)" class="login-button">Set Display Name</button>
    <p v-if="error" class="error-message">{{ error }}</p>
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
