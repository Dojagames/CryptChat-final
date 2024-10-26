<script setup>

</script>

<template>
  <div class="login-container">

  </div>
</template>

<style scoped>
  .login-container {
    width: clamp(16%, 460px, 95%);
    height: 90%;

    position: absolute;
    inset: 0; /* Centers horizontally and vertically */
    margin: auto; /* Necessary for the centering with a specific width and height */

    /*transform-style: preserve-3d;
    transition: transform 0.1s ease; */

    border: 3px rgba(255,255,255,.25) solid;
    background-color: rgba(255,255,255, .085);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    box-shadow: -5px -5px 20px 10px rgba(255, 255, 255, 0.08), 5px 5px 20px 10px rgba(0, 0, 0, 0.1); /* More subtle 3D effect shadow */
  }



</style>
