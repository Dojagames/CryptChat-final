<script setup>
import ChatPreview from "@/components/chat-preview.vue";
import {useSession} from '@/stores/sessionStore.js';
import {useUsersStore} from "@/stores/usersStore.js";

const userStore = useUsersStore();


const chats = userStore.users

userStore.addUser({
  username: "John",
  displayName: "John",
  lastMsg: "test123",
});

userStore.addUser({
  username: "Alice",
  displayName: "Alice",
  lastMsg: "test123",
});

userStore.addUser({
  username: "Bob",
  displayName: "Bob",
  lastMsg: "test123",
});
console.log(chats);

</script>

<template>
  <ChatPreview v-for="chat of chats" :chat="chat"/>
</template>

<style scoped>

</style>
