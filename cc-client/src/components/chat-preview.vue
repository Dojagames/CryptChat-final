<script setup>
import { defineProps } from "vue";
import { RouterLink, RouterView, useRouter } from 'vue-router';

const props = defineProps({
  chat: String,
})

const router = useRouter();

function goToChat(){
  router.push({ name: 'chat', params: { user: props.chat } });
}

</script>

<template>
  <div @click="goToChat" class="preview-container">
    <img class="preview-img" src="https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg" alt="pb">
    <div class="preview-name">{{props.chat}}</div>
    <div class="preview-lastMsg"></div>
    <div class="timeStamp"></div>
    <div class="pinned"></div>

  </div>
</template>

<style scoped>
  .preview-container {
    position: relative;
    width: 98vw;
    height: 6vh;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    margin: 1vw;

    border-radius: 1vw;
  }

  .preview-img {
    height: 80%;
    aspect-ratio: 1;
    border-radius: 50%;
    position: relative;

    top:50%;
    left: 1vw;
    transform: translateY(-50%);
    object-fit: cover;
  }
</style>
