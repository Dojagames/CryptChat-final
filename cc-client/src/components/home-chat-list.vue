<script setup>
import ChatPreview from "@/components/chat-preview.vue";
import {useSession} from '@/stores/sessionStore.js';
import {useUsersStore} from "@/stores/usersStore.js";

const userStore = useUsersStore();


const chats = userStore.users

</script>

<template>
  <ChatPreview v-for="chat in chats" :chat="chat"/>
</template>

<style scoped>

</style>
