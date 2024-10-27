<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const chat = route.params.user; // 'HelloWorld'

</script>

<template>
  <div id="test">
    {{ chat }}
  </div>
</template>

<style scoped>

</style>
