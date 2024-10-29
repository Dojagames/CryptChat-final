<script setup>
import { defineProps } from "vue";
import { RouterLink, RouterView, useRouter } from 'vue-router';

const props = defineProps({
  chat: Object,
})

const router = useRouter();

function goToChat(){
  router.push({ name: 'chat', params: { user: props.chat.name } });
}

</script>

<template>
  <div @click="goToChat" class="preview-container">
    <img class="preview-img" src="https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg" alt="pb">
    <div class="preview-text-wrapper">
      <div class="preview-name">
        <p class="preview-secondElement">{{props.chat.name}}</p>
      </div>
      <div class="preview-lastMsg">
        <p class="preview-secondElement">{{props.chat.lastMsg}}</p>
      </div>
    </div>
    <div class="preview-timeStamp"></div>
    <div class="preview-pinned"></div>

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

    border-radius: .5vw;

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .preview-img {
    flex-shrink: 0;
    flex-grow: 0;
    height: 80%;
    aspect-ratio: 1;
    border-radius: 50%;

    margin-left: 1vw;
    margin-right: 1vw;
    object-fit: cover;
  }

  .preview-text-wrapper{
    height: 100%;
    max-width: 70vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .preview-name{
    height: 50%;
    display: flex;
    align-items: end;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 0;
  }

  .preview-secondElement{
    position: relative;
    bottom: 0;
    margin: 0;
    height: fit-content;
    font-size: inherit;
    letter-spacing: inherit;
    text-wrap: nowrap;
  }

  .preview-lastMsg{
    height: 50%;
    display: flex;
    align-items: start;
  }


</style>
