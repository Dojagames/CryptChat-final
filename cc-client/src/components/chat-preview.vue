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
  <div @click="goToChat">
    {{props.chat}}
  </div>
</template>

<style scoped>

</style>
