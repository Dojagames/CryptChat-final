<script setup>

</script>

<template>
  <div id="home-header">
    <h1>CryptChat</h1>
    <div id="header-settings"></div>
  </div>
</template>

<style scoped>
  #home-header {
    position: sticky;
    top: 0;
    background-color: var(--secondary-background-color);
    width: 100%;
    height: 6vh;
    min-height: 6vh;
  }

  h1{
    position: relative;
    text-align: center;
    margin: 0;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    font-size: 2rem;
  }

  #header-settings{
    position: absolute;
    right: 1%;
    top:50%;
    transform: translateY(-50%);
    height: 50%;
    aspect-ratio: 1;
    background-color: red;
  }

</style>
