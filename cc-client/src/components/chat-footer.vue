<script setup>

</script>

<template>
<div class="chat-footer-container">
  <textarea id="message-input" placeholder="Type a message..."></textarea>
  <button id="send-button">Send</button>
</div>
</template>

<style scoped>
  .chat-footer-container {
    height: 3rem;
    width: 100vw;
    background-color: var(--secondary-background-color);
    align-self: end;

    display: flex;
  }

  #message-input {
    flex: 1; /* Takes up all available space */
    padding: 10px;
    border: none;
    border-radius: 20px;
    outline: none;
    background-color: var(--primary-background-color);
    color: var(--default-text-color);
    margin: 5px;
    resize: none; /* Disable manual resizing by the user */
    overflow: hidden; /* Hide overflow to enable auto-resizing */
    max-height: 150px; /* Set a max height to keep it from growing too large */
  }

  #send-button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #007bff;
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
