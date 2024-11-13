<script setup>
const emit = defineEmits(['changedHeight'])
function resizeInput(e){
  const element = e.target;
  element.style.height = 'auto';
  element.style.height = `calc(${element.scrollHeight}px - 1.2rem )`;
  emit('changedHeight');
}
</script>

<template>
<div class="chat-footer-container">
  <textarea id="message-input" placeholder="Type a message..." @input="resizeInput($event)" rows="1"></textarea>
  <button id="send-button">Send</button>
</div>
</template>

<style scoped>
  .chat-footer-container {
    min-height: 3rem;

    width: 100vw;
    background-color: transparent /*var(--secondary-background-color)*/;
    align-self: end;

    display: flex;
  }

  #message-input {
    z-index: 1000;
    flex: 1; /* Takes up all available space */
    padding: .6rem 10px .6rem 10px;
    margin: 0 5px 5px 5px;
    border: none;
    border-radius: 20px;
    outline: none;
    background-color: var(--primary-background-color);
    color: var(--default-text-color);
    resize: none; /* Disable manual resizing by the user */
    overflow: hidden; /* Hide overflow to enable auto-resizing */
    max-height: 150px; /* Set a max height to keep it from growing too large */
    align-self: end;
  }

  #send-button {
    margin-left: 10px;
    height: calc(3rem - 10px);
    padding: 10px 20px;
    background-color: #007bff;
    align-self: end;
    color: white;
    border: none;
    border-radius: 3rem;
    cursor: pointer;
    margin: 5px;
  }

  #send-button:hover {
    background-color: #0056b3;
  }
</style>
