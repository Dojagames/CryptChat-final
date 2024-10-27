<script setup>
import ChatPreview from "@/components/chat-preview.vue";

const chats = [
  "John",
  "Marc",
  "Bob",
  "Alice"
]

</script>

<template>
  <ChatPreview v-for="chat in chats" :chat="chat"/>
</template>

<style scoped>

</style>
