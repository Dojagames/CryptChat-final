<script setup>
import { defineProps, ref, watch } from "vue";
import {useRoute, useRouter} from 'vue-router';
const router = useRouter();


const props = defineProps({
  chat: Object,
})
console.log(props.chat);

const emit = defineEmits(['call', 'openSettings', 'openProfile', 'search']);

let showSearchModal = ref(false);





function openProfile(){
  emit('openProfile');
}

function openSearch(){
  //open modal for search (replace current header content)
  showSearchModal.value = true;
}

function call(){
  emit('call');
}

function openSettings(){
  emit('openSettings');
}

function exitChat(){
  router.push({ name: 'home' });
}

let searchText = ref('');
watch(searchText, (newValue, oldValue) => {
  emit("search", newValue);
})

</script>

<template>
  <div class="chat-header-container" v-if="!showSearchModal">
    <img @click="exitChat" class="chat-exit" src="../assets/icons/back.png" alt="back">
    <img @click="openProfile()" id="chat-header-icon" src="https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg" :src="chat.pb" alt="pb">
    <p @click="openProfile()" id="chat-header-name">
      {{chat.username}}
    </p>
    <div id="chat-header-icon-wrapper">
      <img @click="openSearch()" src="../assets/icons/magnifying-glass.png" alt="search">
      <img @click="call()" src="../assets/icons/phone-call.png" alt="phone">
      <img @click="openSettings()" src="../assets/icons/more.png" alt="more">
    </div>

  </div>
  <div class="search-modal chat-header-container" v-else>
    <!-- search modal -->
    <img class="chat-exit" src="../assets/icons/back.png" alt="back" @click="showSearchModal = false; searchText = ''">
    <div class="searchRightWrapper">
      <input class="searchMsgInput" type="text" placeholder="search" v-model="searchText">
      <img class="searchBtn searchBtnUp" src="../assets/icons/up-arrow.png" alt="search-up">
      <img class="searchBtn searchBtnDown" src="../assets/icons/down-arrow.png" alt="search-down">
    </div>
  </div>
</template>

<style scoped>
.chat-header-container {
  height: 6vh;
  width: 100vw;

  background-color: var(--secondary-background-color);
  align-self: start;
  display: flex;
  flex-direction: row;
}

#chat-header-icon{
  height: 80%;
  aspect-ratio: 1;
  border-radius: 50%;
  align-self: center;
  margin: 0 1vw;
}

#chat-header-name{
  align-self: center;
  font-size: 2rem;
  margin: 0;
  margin-left: 2vw;
}

#chat-header-icon-wrapper{
  position: absolute;
  right: 1vw;
  width: fit-content;
  text-wrap: nowrap;
  align-self: center;
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#chat-header-icon-wrapper img {
  height: 45%;
  margin: 0 2.5vw;
}

.search-modal{

}

.chat-exit{
  height: 2rem;
  aspect-ratio: 1;
  align-self: center;
  margin: 0 1rem;
}

.searchRightWrapper{
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 80%;
  height: 6vh;
  position: absolute;
  right: 0;
}

.searchMsgInput{
  height: 2rem;
  align-self: center;
  background-color: transparent;
  outline: none;
  border: 1px solid white;
  border-radius: 1rem;
  padding: .2rem .5rem;
  width: 80%;
}

.searchBtn{
  height: 2rem;
  aspect-ratio: 1;
  align-self: center;
  margin: 0 1rem;
}

</style>
