<script setup>
import { defineProps } from "vue";

const props = defineProps({
  chat: String,
})
</script>

<template>
  <div class="chat-header-container">
    {{chat}}
  </div>
</template>

<style scoped>
.chat-header-container {
  height: 10vh;
  width: 100vw;

  background-color: var(--secondary-background-color);
  align-self: end;
}
</style>
