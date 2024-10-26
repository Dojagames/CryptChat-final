<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const tiltEffect = ref(null);

const handleMouseMove = (e) => {
  if (tiltEffect.value === null){
    return
  }
  const { offsetWidth: width, offsetHeight: height } = tiltEffect.value;
  const { offsetX, offsetY } = e;

  // Calculate the rotation angles based on the mouse position
  const rotateX = ((offsetY / height) - 0.5) * -5; // Tilt up/down
  const rotateY = ((offsetX / width) - 0.5) * 7.5;   // Tilt left/right

  // Apply the transformation
  tiltEffect.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

// Reset the tilt effect when the mouse leaves
const handleMouseLeave = () => {
  tiltEffect.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
};

// Add event listeners on mount
onMounted(() => {
  tiltEffect.value.addEventListener('mousemove', handleMouseMove);
  tiltEffect.value.addEventListener('mouseleave', handleMouseLeave);
});

// Remove event listeners on unmount
onUnmounted(() => {
  tiltEffect.value.removeEventListener('mousemove', handleMouseMove);
  tiltEffect.value.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<template>
  <div ref="tiltEffect" class="login-container">

  </div>
</template>

<style scoped>
  .login-container {
    width: clamp(16%, 460px, 95%);
    height: 90%;

    position: absolute;
    inset: 0; /* Centers horizontally and vertically */
    margin: auto; /* Necessary for the centering with a specific width and height */

    transform-style: preserve-3d;
    transition: transform 0.1s ease;

    border: 3px rgba(255,255,255,.25) solid;
    background-color: rgba(255,255,255, .085);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    box-shadow: -5px -5px 20px 10px rgba(255, 255, 255, 0.08), 5px 5px 20px 10px rgba(0, 0, 0, 0.1); /* More subtle 3D effect shadow */
  }



</style>
